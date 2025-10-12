import bcrypt from 'bcryptjs'
import { getDatabase } from './mongodb'
import * as localDb from './db'
import * as memoryDb from './db-memory'

export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
  updatedAt: string
}

// Check if MongoDB is available
const isMongoAvailable = async (): Promise<boolean> => {
  // Check if MONGODB_URI is set (production environment)
  if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI not set, using local database')
    return false
  }
  
  try {
    await getDatabase()
    console.log('✅ MongoDB connection successful')
    return true
  } catch (error) {
    console.log('❌ MongoDB not available, using local database:', error)
    return false
  }
}

// Create a new user
export const createUser = async (email: string, password: string, name: string): Promise<User> => {
  try {
    console.log('🔍 Attempting to create user:', { email, name })
    
    if (await isMongoAvailable()) {
      console.log('📊 Using MongoDB for user creation')
      // Use MongoDB
      const db = await getDatabase()
      const users = db.collection('users')
      
      // Check if user already exists
      const existingUser = await users.findOne({ email })
      if (existingUser) {
        console.log('❌ User already exists in MongoDB')
        throw new Error('User already exists')
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const result = await users.insertOne(newUser)
      console.log('✅ User created in MongoDB:', result.insertedId)
      return newUser
    } else {
      console.log('📁 Attempting local JSON database for user creation')
      try {
        // Try local JSON database first
        const result = await localDb.createUser(email, password, name)
        console.log('✅ User created in local database:', result.id)
        return result
      } catch (localError) {
        console.log('❌ Local database failed, using memory database:', localError)
        console.log('🧠 Using memory database for user creation')
        // Fallback to memory database
        const result = await memoryDb.createUser(email, password, name)
        console.log('✅ User created in memory database:', result.id)
        return result
      }
    }
  } catch (error) {
    console.error('❌ Error in createUser:', error)
    throw error
  }
}

// Find user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  if (await isMongoAvailable()) {
    // Use MongoDB
    const db = await getDatabase()
    const users = db.collection('users')
    const user = await users.findOne({ email })
    return user as User | null
  } else {
    try {
      // Try local JSON database first
      return localDb.findUserByEmail(email)
    } catch (error) {
      console.log('❌ Local database failed for findUserByEmail, using memory database')
      // Fallback to memory database
      return await memoryDb.findUserByEmail(email)
    }
  }
}

// Find user by ID
export const findUserById = async (id: string): Promise<User | null> => {
  if (await isMongoAvailable()) {
    // Use MongoDB
    const db = await getDatabase()
    const users = db.collection('users')
    const user = await users.findOne({ id })
    return user as User | null
  } else {
    try {
      // Try local JSON database first
      return localDb.findUserById(id)
    } catch (error) {
      console.log('❌ Local database failed for findUserById, using memory database')
      // Fallback to memory database
      return await memoryDb.findUserById(id)
    }
  }
}

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}
