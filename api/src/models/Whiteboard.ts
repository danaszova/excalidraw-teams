import { query } from '../config/database'
import { getMongoDB } from '../config/database'
import { Collection, ObjectId } from 'mongodb'

interface SceneDocument {
  _id: string; // Use string ID
  data: any;
  created_at: Date;
  updated_at: Date;
}

export interface Whiteboard {
  id: number
  title: string
 scene_id: string
  owner_id: number
  is_public: boolean
  created_at: Date
  updated_at: Date
}

export interface CreateWhiteboardData {
  title: string
  owner_id: number
  scene_data?: any
  is_public?: boolean
}

export interface WhiteboardResponse {
  id: number
  title: string
  scene_id: string
  owner_id: number
  is_public: boolean
  created_at: Date
  updated_at: Date
}

export interface WhiteboardWithScene extends WhiteboardResponse {
  scene_data?: any
}

export class WhiteboardModel {
  static async create(data: CreateWhiteboardData): Promise<WhiteboardResponse> {
    const { title, owner_id, scene_data, is_public = false } = data
    
    // Generate unique scene ID
    const scene_id = `scene_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Save scene data to MongoDB if provided
    if (scene_data) {
      const db = await getMongoDB()
      const scenesCollection = db.collection<SceneDocument>('scenes')
      await scenesCollection.insertOne({
        _id: scene_id, // Use string ID directly
        data: scene_data,
        created_at: new Date(),
        updated_at: new Date()
      })
    }
    
    // Save metadata to PostgreSQL
    const result = await query(
      `INSERT INTO whiteboards (title, scene_id, owner_id, is_public) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [title, scene_id, owner_id, is_public]
    )
    
    return result.rows[0]
  }

  static async findByOwner(owner_id: number): Promise<WhiteboardResponse[]> {
    const result = await query(
      'SELECT * FROM whiteboards WHERE owner_id = $1 ORDER BY updated_at DESC',
      [owner_id]
    )
    
    return result.rows
  }

  static async findById(id: number, include_scene = false): Promise<WhiteboardWithScene | null> {
    const result = await query(
      'SELECT * FROM whiteboards WHERE id = $1',
      [id]
    )
    
    if (!result.rows[0]) return null
    
    const whiteboard = result.rows[0]
    
    if (include_scene) {
      try {
        const db = await getMongoDB()
        const scenesCollection = db.collection<SceneDocument>('scenes')
        const scene = await scenesCollection.findOne({ _id: whiteboard.scene_id })
        return {
          ...whiteboard,
          scene_data: scene?.data || null
        }
      } catch (error) {
        console.error('Error fetching scene data:', error)
        return whiteboard
      }
    }
    
    return whiteboard
  }

 static async updateScene(scene_id: string, scene_data: any): Promise<void> {
    const db = await getMongoDB()
    const scenesCollection = db.collection<SceneDocument>('scenes')
    
    await scenesCollection.updateOne(
      { _id: scene_id },
      { 
        $set: { 
          data: scene_data, 
          updated_at: new Date() 
        } 
      },
      { upsert: true }
    )
    
    // Update timestamp in PostgreSQL
    await query(
      'UPDATE whiteboards SET updated_at = CURRENT_TIMESTAMP WHERE scene_id = $1',
      [scene_id]
    )
  }

 static async update(id: number, updates: Partial<Pick<Whiteboard, 'title' | 'is_public'>>): Promise<WhiteboardResponse> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ')
    
    const values = [id, ...Object.values(updates)]
    
    const result = await query(
      `UPDATE whiteboards 
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      values
    )
    
    return result.rows[0]
  }

  static async delete(id: number, owner_id: number): Promise<boolean> {
    // First get the scene_id
    const whiteboard = await query(
      'SELECT scene_id FROM whiteboards WHERE id = $1 AND owner_id = $2',
      [id, owner_id]
    )
    
    if (!whiteboard.rows[0]) return false
    
    const scene_id = whiteboard.rows[0].scene_id
    
    // Delete from PostgreSQL
    const result = await query(
      'DELETE FROM whiteboards WHERE id = $1 AND owner_id = $2',
      [id, owner_id]
    )
    
    // Delete scene from MongoDB
    try {
      const db = await getMongoDB()
      const scenesCollection = db.collection<SceneDocument>('scenes')
      await scenesCollection.deleteOne({ _id: scene_id })
    } catch (error) {
      console.error('Error deleting scene data:', error)
    }
    
    return result.rowCount !== null && result.rowCount > 0
  }

  static async checkAccess(id: number, user_id: number): Promise<boolean> {
    const result = await query(
      'SELECT id FROM whiteboards WHERE id = $1 AND (owner_id = $2 OR is_public = true)',
      [id, user_id]
    )
    
    return result.rows.length > 0
  }
}
