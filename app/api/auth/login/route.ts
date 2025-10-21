import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '@/lib/db-hybrid'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required.' }, { status: 400 })
    }
  const user = await findUserByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
    }
    return NextResponse.json({ message: 'Login successful', user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 })
  }
}
  
