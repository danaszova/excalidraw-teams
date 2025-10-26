"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Validation schemas
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters')
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required')
});
// Helper function to generate JWT
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || 'dev-secret', {
        expiresIn: '7d'
    });
};
// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);
        // Check if user already exists
        const existingUser = await User_1.UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        // Create user
        const user = await User_1.UserModel.create({ name, email, password });
        // Generate token
        const token = generateToken(user.id);
        res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });
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
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        // Find user
        const user = await User_1.UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Check password
        const isValidPassword = await User_1.UserModel.verifyPassword(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Generate token
        const token = generateToken(user.id);
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });
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
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
// Get current user endpoint
router.get('/me', auth_1.authenticateToken, (req, res) => {
    res.json({
        user: req.user
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map