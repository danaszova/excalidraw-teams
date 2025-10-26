import express from 'express'
import { z } from 'zod'

const router = express.Router()

// Validation schemas
const createWhiteboardSchema = z.object({
  title: z.string().min(1),
  sceneData: z.object({}).optional()
})

const updateWhiteboardSchema = z.object({
  title: z.string().min(1).optional(),
  sceneData: z.object({}).optional()
})

// Mock whiteboard storage (replace with actual database later)
const whiteboards: Array<{
  id: string
  title: string
  sceneId: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
}> = []

// Get all whiteboards
router.get('/', (req, res) => {
  // TODO: Add authentication middleware to get user ID
  // TODO: Filter by user permissions
  res.json({
    whiteboards: whiteboards.map(wb => ({
      id: wb.id,
      title: wb.title,
      sceneId: wb.sceneId,
      createdAt: wb.createdAt,
      updatedAt: wb.updatedAt,
      isPublic: wb.isPublic
    }))
  })
})

// Get specific whiteboard
router.get('/:id', (req, res) => {
  const { id } = req.params
  const whiteboard = whiteboards.find(wb => wb.id === id)
  
  if (!whiteboard) {
    return res.status(404).json({ error: 'Whiteboard not found' })
  }
  
  // TODO: Check permissions
  res.json({
    id: whiteboard.id,
    title: whiteboard.title,
    sceneId: whiteboard.sceneId,
    createdAt: whiteboard.createdAt,
    updatedAt: whiteboard.updatedAt,
    isPublic: whiteboard.isPublic
  })
})

// Create new whiteboard
router.post('/', (req, res) => {
  try {
    const { title, sceneData } = createWhiteboardSchema.parse(req.body)
    
    // TODO: Get user ID from authentication middleware
    const mockUserId = 'user-1'
    
    const whiteboard = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      sceneId: Math.random().toString(36).substr(2, 9), // This should be saved to MongoDB
      ownerId: mockUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false
    }
    
    whiteboards.push(whiteboard)
    
    res.status(201).json({
      id: whiteboard.id,
      title: whiteboard.title,
      sceneId: whiteboard.sceneId,
      createdAt: whiteboard.createdAt,
      updatedAt: whiteboard.updatedAt,
      isPublic: whiteboard.isPublic
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to create whiteboard' })
  }
})

// Update whiteboard
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params
    const updates = updateWhiteboardSchema.parse(req.body)
    
    const whiteboardIndex = whiteboards.findIndex(wb => wb.id === id)
    if (whiteboardIndex === -1) {
      return res.status(404).json({ error: 'Whiteboard not found' })
    }
    
    // TODO: Check ownership/permissions
    
    const whiteboard = whiteboards[whiteboardIndex]
    if (updates.title) {
      whiteboard.title = updates.title
    }
    whiteboard.updatedAt = new Date()
    
    whiteboards[whiteboardIndex] = whiteboard
    
    res.json({
      id: whiteboard.id,
      title: whiteboard.title,
      sceneId: whiteboard.sceneId,
      createdAt: whiteboard.createdAt,
      updatedAt: whiteboard.updatedAt,
      isPublic: whiteboard.isPublic
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to update whiteboard' })
  }
})

// Delete whiteboard
router.delete('/:id', (req, res) => {
  const { id } = req.params
  const whiteboardIndex = whiteboards.findIndex(wb => wb.id === id)
  
  if (whiteboardIndex === -1) {
    return res.status(404).json({ error: 'Whiteboard not found' })
  }
  
  // TODO: Check ownership/permissions
  
  whiteboards.splice(whiteboardIndex, 1)
  res.status(204).send()
})

export default router
