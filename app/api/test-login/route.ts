import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail, verifyPassword } from '@/lib/db-hybrid'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🧪 Testing login for:', email)
    
    // Step 1: Find user
    console.log('🔍 Looking for user:', email)
    const user = await findUserByEmail(email)
    console.log('👤 User found:', user ? 'Yes' : 'No')
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        step: 'user_lookup'
      })
    }
    
    // Step 2: Verify password
    console.log('🔐 Verifying password...')
    const isValidPassword = await verifyPassword(password, user.password)
    console.log('🔐 Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid password',
        step: 'password_verification'
      })
    }
    
    // Step 3: Return user data
    console.log('✅ Login test successful')
    return NextResponse.json({
      success: true,
      message: 'Login test successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
    
  } catch (error) {
    console.error('❌ Login test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Login test failed',
      step: 'error'
    })
  }
}
