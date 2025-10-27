// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { signIn as nextAuthSignIn } from 'next-auth/react'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // You can replace this with your real authentication logic
    // Example: using next-auth credentials provider
    const result = await nextAuthSignIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true, message: 'Login successful' })
  } catch (err) {
    console.error('Login API error:', err)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
