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
  if (await isMongoAvailable()) {
    // Use MongoDB
    const db = await getDatabase()
    const users = db.collection('users')
    
    // Check if user already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
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

    await users.insertOne(newUser)
    return newUser
  } else {
    // Use local JSON database
    return await localDb.createUser(email, password, name)
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
