import bcrypt from 'bcryptjs'
import { getDatabase } from './mongodb'
import * as localDb from './db'

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
  // Force local database for now (remove this line to enable MongoDB)
  return false
  
  try {
    await getDatabase()
    return true
  } catch (error) {
    console.log('MongoDB not available, using local database')
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
      console.log('📁 Using local JSON database for user creation')
      // Use local JSON database
      const result = await localDb.createUser(email, password, name)
      console.log('✅ User created in local database:', result.id)
      return result
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
    // Use local JSON database
    return localDb.findUserByEmail(email)
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
    // Use local JSON database
    return localDb.findUserById(id)
  }
}

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}
