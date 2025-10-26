"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const Whiteboard_1 = require("../models/Whiteboard");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Validation schemas
const createWhiteboardSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    scene_data: zod_1.z.any().optional(),
    is_public: zod_1.z.boolean().optional()
});
const updateWhiteboardSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    is_public: zod_1.z.boolean().optional()
});
const updateSceneSchema = zod_1.z.object({
    scene_data: zod_1.z.any()
});
// Get user's whiteboards
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const whiteboards = await Whiteboard_1.WhiteboardModel.findByOwner(req.user.id);
        res.json({
            whiteboards: whiteboards.map(wb => ({
                id: wb.id,
                title: wb.title,
                scene_id: wb.scene_id,
                owner_id: wb.owner_id,
                is_public: wb.is_public,
                created_at: wb.created_at,
                updated_at: wb.updated_at
            }))
        });
    }
    catch (error) {
        console.error('Error fetching whiteboards:', error);
        res.status(500).json({ error: 'Failed to fetch whiteboards' });
    }
});
// Get specific whiteboard with scene data
router.get('/:id', auth_1.optionalAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid whiteboard ID' });
        }
        // Check access permissions
        if (req.user) {
            const hasAccess = await Whiteboard_1.WhiteboardModel.checkAccess(id, req.user.id);
            if (!hasAccess) {
                return res.status(403).json({ error: 'Access denied' });
            }
        }
        else {
            // For non-authenticated users, only allow public whiteboards
            const whiteboard = await Whiteboard_1.WhiteboardModel.findById(id);
            if (!whiteboard || !whiteboard.is_public) {
                return res.status(403).json({ error: 'Access denied' });
            }
        }
        const whiteboard = await Whiteboard_1.WhiteboardModel.findById(id, true);
        if (!whiteboard) {
            return res.status(404).json({ error: 'Whiteboard not found' });
        }
        res.json(whiteboard);
    }
    catch (error) {
        console.error('Error fetching whiteboard:', error);
        res.status(500).json({ error: 'Failed to fetch whiteboard' });
    }
});
// Create new whiteboard
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const validatedData = createWhiteboardSchema.parse(req.body);
        const whiteboard = await Whiteboard_1.WhiteboardModel.create({
            title: validatedData.title,
            owner_id: req.user.id,
            scene_data: validatedData.scene_data,
            is_public: validatedData.is_public || false
        });
        res.status(201).json(whiteboard);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        console.error('Error creating whiteboard:', error);
        res.status(500).json({ error: 'Failed to create whiteboard' });
    }
});
// Update whiteboard metadata
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid whiteboard ID' });
        }
        const updates = updateWhiteboardSchema.parse(req.body);
        // Check ownership
        const existing = await Whiteboard_1.WhiteboardModel.findById(id);
        if (!existing || existing.owner_id !== req.user.id) {
            return res.status(404).json({ error: 'Whiteboard not found' });
        }
        const whiteboard = await Whiteboard_1.WhiteboardModel.update(id, updates);
        res.json(whiteboard);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        console.error('Error updating whiteboard:', error);
        res.status(500).json({ error: 'Failed to update whiteboard' });
    }
});
// Update whiteboard scene data
router.put('/:id/scene', auth_1.authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid whiteboard ID' });
        }
        const { scene_data } = updateSceneSchema.parse(req.body);
        // Check ownership
        const whiteboard = await Whiteboard_1.WhiteboardModel.findById(id);
        if (!whiteboard || whiteboard.owner_id !== req.user.id) {
            return res.status(404).json({ error: 'Whiteboard not found' });
        }
        await Whiteboard_1.WhiteboardModel.updateScene(whiteboard.scene_id, scene_data);
        res.json({ success: true, message: 'Scene updated successfully' });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        console.error('Error updating scene:', error);
        res.status(500).json({ error: 'Failed to update scene' });
    }
});
// Delete whiteboard
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid whiteboard ID' });
        }
        const deleted = await Whiteboard_1.WhiteboardModel.delete(id, req.user.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Whiteboard not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting whiteboard:', error);
        res.status(500).json({ error: 'Failed to delete whiteboard' });
    }
});
exports.default = router;
//# sourceMappingURL=whiteboards.js.map