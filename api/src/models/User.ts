import bcrypt from 'bcryptjs'
import { query } from '../config/database'

export interface User {
  id: number
  name: string
  email: string
  password_hash: string
  created_at: Date
  updated_at: Date
}

export interface CreateUserData {
  name: string
  email: string
  password: string
}

export interface UserResponse {
  id: number
  name: string
  email: string
  created_at: Date
  updated_at: Date
}

export class UserModel {
  static async create(userData: CreateUserData): Promise<UserResponse> {
    const { name, email, password } = userData
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 12)
    
    const result = await query(
      `INSERT INTO users (name, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, created_at, updated_at`,
      [name, email, password_hash]
    )
    
    return result.rows[0]
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    
    return result.rows[0] || null
  }

  static async findById(id: number): Promise<UserResponse | null> {
    const result = await query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
      [id]
    )
    
    return result.rows[0] || null
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }

  static async updateProfile(id: number, updates: Partial<Pick<User, 'name' | 'email'>>): Promise<UserResponse> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ')
    
    const values = [id, ...Object.values(updates)]
    
    const result = await query(
      `UPDATE users 
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING id, name, email, created_at, updated_at`,
      values
    )
    
    return result.rows[0]
  }

  static async changePassword(id: number, newPassword: string): Promise<void> {
    const password_hash = await bcrypt.hash(newPassword, 12)
    
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [password_hash, id]
    )
  }
}
