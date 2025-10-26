import { Pool } from 'pg'
import { MongoClient, Db } from 'mongodb'

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Test PostgreSQL connection
pool.on('connect', () => {
  console.log('📊 Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err)
})

// MongoDB connection
let mongoDb: Db | null = null
let mongoClient: MongoClient | null = null

export const connectMongoDB = async (): Promise<Db> => {
  if (mongoDb) {
    return mongoDb
  }

  try {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://mongo:27017/excalidraw'
    mongoClient = new MongoClient(mongoUrl)
    await mongoClient.connect()
    
    mongoDb = mongoClient.db()
    console.log('📊 Connected to MongoDB database')
    return mongoDb
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

// PostgreSQL query helper
export const query = async (text: string, params?: any[]) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('🔍 Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('❌ Database query error:', error)
    throw error
  }
}

// MongoDB getter
export const getMongoDB = async (): Promise<Db> => {
  if (!mongoDb) {
    return await connectMongoDB()
  }
  return mongoDb
}

// Graceful shutdown
export const closeDatabaseConnections = async () => {
  console.log('🔄 Closing database connections...')
  
  try {
    await pool.end()
    console.log('✅ PostgreSQL connection closed')
  } catch (error) {
    console.error('❌ Error closing PostgreSQL:', error)
  }

  try {
    if (mongoClient) {
      await mongoClient.close()
      console.log('✅ MongoDB connection closed')
    }
  } catch (error) {
    console.error('❌ Error closing MongoDB:', error)
  }
}

// Handle process termination
process.on('SIGINT', closeDatabaseConnections)
process.on('SIGTERM', closeDatabaseConnections)
