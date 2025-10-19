export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
  updatedAt: string
}

let users: User[] = []

export function getUsers(): User[] {
  return users
}

export function saveUsers(u: User[]) {
  users = u
}

export function createUser(email: string, password: string, name: string): User {
  const newUser: User = {
    id: Date.now().toString(),
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  users.push(newUser)
  return newUser
}

export function findUserByEmail(email: string): User | null {
  return users.find(u => u.email === email) ?? null
}

export function findUserById(id: string): User | null {
  return users.find(u => u.id === id) ?? null
}
