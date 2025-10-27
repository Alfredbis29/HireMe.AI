import { NextRequest, NextResponse } from 'next/server'
import { signIn } from 'next-auth/react'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 })
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    })

    if (result?.error) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 })
    }

    return NextResponse.json({ success: true, message: 'Login successful' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
