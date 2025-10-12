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
    console.log('📊 Memory DB: Total users:', users.length)
    
    return newUser
  } catch (error) {
    console.error('❌ Memory DB: Error creating user:', error)
    throw error
  }
}

// Find user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = users.find(user => user.email === email)
  console.log('🧠 Memory DB: Finding user by email:', email, user ? 'found' : 'not found')
  return user || null
}

// Find user by ID
export const findUserById = async (id: string): Promise<User | null> => {
  const user = users.find(user => user.id === id)
  console.log('🧠 Memory DB: Finding user by ID:', id, user ? 'found' : 'not found')
  return user || null
}

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}
