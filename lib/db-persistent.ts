import bcrypt from 'bcryptjs'

export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
  updatedAt: string
}

// Simple in-memory storage with persistence attempt
let users: User[] = []

// Try to load users from environment variable (for serverless persistence)
const loadUsersFromEnv = (): User[] => {
  try {
    const usersJson = process.env.USERS_DATA
    if (usersJson) {
      const parsed = JSON.parse(usersJson)
      console.log('📦 Loaded users from environment:', parsed.length)
      return parsed
    }
  } catch (error) {
    console.log('❌ Failed to load users from environment:', error)
  }
  return []
}

// Try to save users to environment (this won't work in serverless, but we'll try)
const saveUsersToEnv = (users: User[]) => {
  try {
    // This is a hack - in real serverless, you'd use a database
    // For now, we'll just log the users for debugging
    console.log('💾 Users data (would be saved):', JSON.stringify(users, null, 2))
  } catch (error) {
    console.log('❌ Failed to save users:', error)
  }
}

// Initialize users from environment
users = loadUsersFromEnv()

// Create a new user
export const createUser = async (email: string, password: string, name: string): Promise<User> => {
  try {
    console.log('💾 Persistent DB: Creating user:', { email, name })
    console.log('💾 Persistent DB: Current users count:', users.length)
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      console.log('❌ Persistent DB: User already exists')
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

    users.push(newUser)
    console.log('💾 Persistent DB: Saving users, new count:', users.length)
    saveUsersToEnv(users)
    console.log('✅ Persistent DB: User created successfully:', newUser.id)
    
    return newUser
  } catch (error) {
    console.error('❌ Persistent DB: Error creating user:', error)
    throw error
  }
}

// Find user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = users.find(user => user.email === email)
  console.log('💾 Persistent DB: Finding user by email:', email, user ? 'found' : 'not found')
  console.log('💾 Persistent DB: Total users in memory:', users.length)
  return user || null
}

// Find user by ID
export const findUserById = async (id: string): Promise<User | null> => {
  const user = users.find(user => user.id === id)
  console.log('💾 Persistent DB: Finding user by ID:', id, user ? 'found' : 'not found')
  return user || null
}

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}
