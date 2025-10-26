import express from 'express'
import { z } from 'zod'
import { WhiteboardModel } from '../models/Whiteboard'
import { authenticateToken, AuthRequest, optionalAuth } from '../middleware/auth'

const router = express.Router()

// Validation schemas
const createWhiteboardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  scene_data: z.any().optional(),
  is_public: z.boolean().optional()
})

const updateWhiteboardSchema = z.object({
  title: z.string().min(1).optional(),
  is_public: z.boolean().optional()
})

const updateSceneSchema = z.object({
  scene_data: z.any()
})

// Get user's whiteboards
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const whiteboards = await WhiteboardModel.findByOwner(req.user!.id)
    
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
    })
  } catch (error) {
    console.error('Error fetching whiteboards:', error)
    res.status(500).json({ error: 'Failed to fetch whiteboards' })
  }
})

// Get specific whiteboard with scene data
router.get('/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid whiteboard ID' })
    }

    // Check access permissions
    if (req.user) {
      const hasAccess = await WhiteboardModel.checkAccess(id, req.user.id)
      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied' })
      }
    } else {
      // For non-authenticated users, only allow public whiteboards
      const whiteboard = await WhiteboardModel.findById(id)
      if (!whiteboard || !whiteboard.is_public) {
        return res.status(403).json({ error: 'Access denied' })
      }
    }

    const whiteboard = await WhiteboardModel.findById(id, true)
    if (!whiteboard) {
      return res.status(404).json({ error: 'Whiteboard not found' })
    }

    res.json(whiteboard)
  } catch (error) {
    console.error('Error fetching whiteboard:', error)
    res.status(500).json({ error: 'Failed to fetch whiteboard' })
  }
})

// Create new whiteboard
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const validatedData = createWhiteboardSchema.parse(req.body)
    
    const whiteboard = await WhiteboardModel.create({
      title: validatedData.title,
      owner_id: req.user!.id,
      scene_data: validatedData.scene_data,
      is_public: validatedData.is_public || false
    })
    
    res.status(201).json(whiteboard)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      })
    }
    console.error('Error creating whiteboard:', error)
    res.status(500).json({ error: 'Failed to create whiteboard' })
  }
})

// Update whiteboard metadata
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid whiteboard ID' })
    }

    const updates = updateWhiteboardSchema.parse(req.body)
    
    // Check ownership
    const existing = await WhiteboardModel.findById(id)
    if (!existing || existing.owner_id !== req.user!.id) {
      return res.status(404).json({ error: 'Whiteboard not found' })
    }
    
    const whiteboard = await WhiteboardModel.update(id, updates)
    res.json(whiteboard)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      })
    }
    console.error('Error updating whiteboard:', error)
    res.status(500).json({ error: 'Failed to update whiteboard' })
  }
})

// Update whiteboard scene data
router.put('/:id/scene', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid whiteboard ID' })
    }

    const { scene_data } = updateSceneSchema.parse(req.body)
    
    // Check ownership
    const whiteboard = await WhiteboardModel.findById(id)
    if (!whiteboard || whiteboard.owner_id !== req.user!.id) {
      return res.status(404).json({ error: 'Whiteboard not found' })
    }
    
    await WhiteboardModel.updateScene(whiteboard.scene_id, scene_data)
    res.json({ success: true, message: 'Scene updated successfully' })
 } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      })
    }
    console.error('Error updating scene:', error)
    res.status(500).json({ error: 'Failed to update scene' })
  }
})

// Delete whiteboard
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid whiteboard ID' })
    }

    const deleted = await WhiteboardModel.delete(id, req.user!.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Whiteboard not found' })
    }
    
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting whiteboard:', error)
    res.status(500).json({ error: 'Failed to delete whiteboard' })
  }
})

export default router
