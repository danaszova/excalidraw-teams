import express from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { UserModel } from '../models/User'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Validation schemas
const registerSchema = z.object({
 name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// Helper function to generate JWT
const generateToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d'
  })
}

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body)
    
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }
    
    // Create user
    const user = await UserModel.create({ name, email, password })
    
    // Generate token
    const token = generateToken(user.id)
    
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    })
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
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    
    // Find user
    const user = await UserModel.findByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    // Check password
    const isValidPassword = await UserModel.verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    // Generate token
    const token = generateToken(user.id)
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    })
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
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
 }
})

// Get current user endpoint
router.get('/me', authenticateToken, (req: AuthRequest, res) => {
  res.json({
    user: req.user
  })
})

export default router
