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


const usersFile = path.join(process.cwd(), 'data', 'users.json')

function ensureUsersFile() {
  if (!fs.existsSync(usersFile)) {
    fs.mkdirSync(path.dirname(usersFile), { recursive: true })
    fs.writeFileSync(usersFile, '[]')
  }
}

export function getUsers(): User[] {
  try {
    ensureUsersFile()
    const raw = fs.readFileSync(usersFile, 'utf-8')
    return JSON.parse(raw) as User[]
  } catch (err) {
    console.error('Error reading users file:', err)
    return []
  }
}

export function saveUsers(users: User[]) {
  try {
    ensureUsersFile()
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
  } catch (err) {
    console.error('Error saving users file:', err)
  }
}


export function findUserByEmail(email: string): User | null {
  const users = getUsers()
  return users.find(u => u.email === email) ?? null
}

export function findUserById(id: string): User | null {
  const users = getUsers()
  return users.find(u => u.id === id) ?? null
}

const DB_PATH = path.join(process.cwd(), 'data', 'users.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
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

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)

}
