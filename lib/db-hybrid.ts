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

// Check if we're in a serverless environment (Vercel)
const isServerless = () => {
  return process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined
}

// Demo user password hash for "demo123"
const DEMO_PASSWORD_HASH = '$2b$12$/wmvm9gn5NNaPAfgBCuPiuENv8KDOTVmNf5LK6fthH/l/eW20srdW'

// Demo users that always exist (for testing on Vercel)
const DEMO_USERS: User[] = [
  {
    id: 'demo-1',
    email: 'demo@hireme.ai',
    password: DEMO_PASSWORD_HASH, // password: demo123
    name: 'Demo User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo-2', 
    email: 'test@example.com',
    password: DEMO_PASSWORD_HASH, // password: demo123
    name: 'Test User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

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
  // Check database first - real users take precedence over demo users
  let dbUser: User | null = null
  
  if (isServerless()) {
    console.log('☁️ Serverless environment, using memory database')
    dbUser = await memoryDb.findUserByEmail(email)
  } else {
    console.log('💻 Local environment, trying local database')
    try {
      dbUser = await localDb.findUserByEmail(email)
    } catch (error) {
      console.log('❌ Local database failed, falling back to memory database')
      dbUser = await memoryDb.findUserByEmail(email)
    }
  }
  
  // If found in database, return the real user
  if (dbUser) {
    console.log('✅ Found user in database:', email)
    return dbUser
  }
  
  // Fall back to demo users only if no real user exists
  const demoUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (demoUser) {
    console.log('🎭 Found demo user:', email)
    return demoUser
  }
  
  return null
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

