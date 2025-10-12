import bcrypt from 'bcryptjs'
import { getDatabase } from './mongodb'
import * as localDb from './db'
import * as memoryDb from './db-memory'
import * as persistentDb from './db-persistent'

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
        console.log('❌ Local database failed, trying memory database:', localError)
        try {
          console.log('🧠 Using memory database for user creation')
          // Try memory database first
          const result = await memoryDb.createUser(email, password, name)
          console.log('✅ User created in memory database:', result.id)
          return result
        } catch (memoryError) {
          console.log('❌ Memory database failed, using persistent database:', memoryError)
          console.log('💾 Using persistent database for user creation')
          // Final fallback to persistent database
          const result = await persistentDb.createUser(email, password, name)
          console.log('✅ User created in persistent database:', result.id)
          return result
        }
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
      console.log('❌ Local database failed for findUserByEmail, trying memory database')
      try {
        // Try memory database first
        return await memoryDb.findUserByEmail(email)
      } catch (memoryError) {
        console.log('❌ Memory database failed for findUserByEmail, using persistent database')
        // Final fallback to persistent database
        return await persistentDb.findUserByEmail(email)
      }
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
      console.log('❌ Local database failed for findUserById, trying memory database')
      try {
        // Try memory database first
        return await memoryDb.findUserById(id)
      } catch (memoryError) {
        console.log('❌ Memory database failed for findUserById, using persistent database')
        // Final fallback to persistent database
        return await persistentDb.findUserById(id)
      }
    }
  }
}

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}
