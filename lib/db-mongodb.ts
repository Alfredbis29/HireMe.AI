import bcrypt from 'bcryptjs'
import { getDatabase } from './mongodb'

export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
  updatedAt: string
}

// Create a new user
export const createUser = async (email: string, password: string, name: string): Promise<User> => {
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
}

// Find user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const db = await getDatabase()
  const users = db.collection('users')
  const user = await users.findOne({ email })
  return user as User | null
}

// Find user by ID
export const findUserById = async (id: string): Promise<User | null> => {
  const db = await getDatabase()
  const users = db.collection('users')
  const user = await users.findOne({ id })
  return user as User | null
}

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}
