import { NextRequest, NextResponscurrent-post
import { findUserByEmail } from '../../../../lib/db'
import bcrypt from 'bcryptjs'import { findUserByEmail, verifyPassword } from '@/limain

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
 current-post
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required.' }, { status: 400 })
    }
  const user = findUserByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
    }
    return NextResponse.json({ message: 'Login successful', user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed.' }, { status: 500
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
   main
  }
}
