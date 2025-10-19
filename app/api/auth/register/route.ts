import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail } from '../../../../lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (findUserByEmail(email)) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 })
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = createUser(email, hashedPassword, name)
    return NextResponse.json({ message: 'Signup successful', user: { id: newUser.id, email, name } })
  } catch (error) {
    return NextResponse.json({ error: 'Signup failed.' }, { status: 500 })
  }
}
