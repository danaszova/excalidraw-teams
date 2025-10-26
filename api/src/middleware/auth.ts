import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { UserModel } from '../models/User'

export interface AuthRequest extends Request {
  user?: {
    id: number
    name: string
    email: string
  }
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { userId: number }
    
    // Get user from database
    const user = await UserModel.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email
    }
    
    next()
  } catch (error) {
    console.error('JWT verification error:', error)
    return res.status(403).json({ error: 'Invalid or expired token' })
 }
}

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { userId: number }
    const user = await UserModel.findById(decoded.userId)
    
    if (user) {
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
  } catch (error) {
    // Continue without user for optional auth
    console.log('Optional auth failed:', error)
  }
  
  next()
}
