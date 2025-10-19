import fs from 'fs'
import path from 'path'

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

export function createUser(email: string, password: string, name: string): User {
  const users = getUsers()
  const newUser: User = {
    id: Date.now().toString(),
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export function findUserByEmail(email: string): User | null {
  const users = getUsers()
  return users.find(u => u.email === email) ?? null
}

export function findUserById(id: string): User | null {
  const users = getUsers()
  return users.find(u => u.id === id) ?? null
}
