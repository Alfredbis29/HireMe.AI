import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/db-hybrid'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 })
    }

    // Create new user
    const newUser = await createUser(email, password, name)
    
    return NextResponse.json({ 
      message: 'Signup successful', 
      user: { id: newUser.id, email: newUser.email, name: newUser.name } 
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Signup failed.' }, { status: 500 })
  }
}
