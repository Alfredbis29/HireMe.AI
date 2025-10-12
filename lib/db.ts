import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
  updatedAt: string
}

const DB_PATH = path.join(process.cwd(), 'data', 'users.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read users from file
export const getUsers = (): User[] => {
  ensureDataDir()
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading users:', error)
  }
  return []
}

// Write users to file
export const saveUsers = (users: User[]) => {
  ensureDataDir()
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error saving users:', error)
  }
}

// Create a new user
export const createUser = async (email: string, password: string, name: string): Promise<User> => {
  try {
    console.log('📁 Local DB: Creating user:', { email, name })
    const users = getUsers()
    console.log('📁 Local DB: Current users count:', users.length)
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      console.log('❌ Local DB: User already exists')
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
    console.log('📁 Local DB: Saving users, new count:', users.length)
    saveUsers(users)
    console.log('✅ Local DB: User created successfully:', newUser.id)
    
    return newUser
  } catch (error) {
    console.error('❌ Local DB: Error creating user:', error)
    throw error
  }
}

// Find user by email
export const findUserByEmail = (email: string): User | null => {
  const users = getUsers()
  return users.find(user => user.email === email) || null
}

// Find user by ID
export const findUserById = (id: string): User | null => {
  const users = getUsers()
  return users.find(user => user.id === id) || null
}

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}
