import bcrypt from 'bcryptjs'
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

// Check if we're in a serverless environment
const isServerless = (): boolean => {
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
}

// Create a new user
export const createUser = async (email: string, password: string, name: string): Promise<User> => {
  try {
    console.log('🔍 Attempting to create user:', { email, name })
    
    if (isServerless()) {
      console.log('☁️ Serverless environment detected, using memory database')
      return await memoryDb.createUser(email, password, name)
    } else {
      console.log('💻 Local environment, trying local database')
      try {
        return await localDb.createUser(email, password, name)
      } catch (error) {
        console.log('❌ Local database failed, falling back to memory database')
        return await memoryDb.createUser(email, password, name)
      }
    }
  } catch (error) {
    console.error('❌ Error in createUser:', error)
    throw error
  }
}

// Find user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  if (isServerless()) {
    console.log('☁️ Serverless environment, using memory database')
    return memoryDb.findUserByEmail(email)
  } else {
    console.log('💻 Local environment, trying local database')
    try {
      return localDb.findUserByEmail(email)
    } catch (error) {
      console.log('❌ Local database failed, falling back to memory database')
      return memoryDb.findUserByEmail(email)
    }
  }
}

// Find user by ID
export const findUserById = async (id: string): Promise<User | null> => {
  if (isServerless()) {
    console.log('☁️ Serverless environment, using memory database')
    return memoryDb.findUserById(id)
  } else {
    console.log('💻 Local environment, trying local database')
    try {
      return localDb.findUserById(id)
    } catch (error) {
      console.log('❌ Local database failed, falling back to memory database')
      return memoryDb.findUserById(id)
    }
  }
}

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}
