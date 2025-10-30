
import bcrypt from 'bcryptjs'

export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
  updatedAt: string
}

// In-memory database for serverless environments
let users: User[] = []

// Create a new user
export const createUser = async (email: string, password: string, name: string): Promise<User> => {
  try {
    console.log('🧠 Memory DB: Creating user:', { email, name })
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      console.log('❌ Memory DB: User already exists')
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
    console.log('✅ Memory DB: User created successfully:', newUser.id)
    
    return newUser
  } catch (error) {
    console.error('❌ Memory DB: Error creating user:', error)
    throw error
  }
}

// Find user by email
export const findUserByEmail = (email: string): User | null => {
  console.log('🧠 Memory DB: Looking for user:', email)
  const user = users.find(user => user.email === email)
  console.log('🧠 Memory DB: User found:', user ? 'Yes' : 'No')
  return user || null
}

// Find user by ID
export const findUserById = (id: string): User | null => {
  console.log('🧠 Memory DB: Looking for user by ID:', id)
  const user = users.find(user => user.id === id)
  console.log('🧠 Memory DB: User found by ID:', user ? 'Yes' : 'No')
  return user || null
}

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

// Utility functions
export function getUsers(): User[] {
  return users
}

export function saveUsers(u: User[]) {
  users = u
}
