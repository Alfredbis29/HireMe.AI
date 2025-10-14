import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, verifyPassword } from '@/lib/db-hybrid'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🔍 Debug Auth: Testing authentication for:', email)
    
    // Step 1: Find user
    console.log('🔍 Step 1: Looking for user...')
    const user = await findUserByEmail(email)
    console.log('🔍 User found:', user ? 'Yes' : 'No')
    
    if (!user) {
      return NextResponse.json({
        success: false,
        step: 'user_lookup',
        message: 'User not found',
        debug: {
          email,
          userExists: false
        }
      })
    }
    
    console.log('🔍 User details:', {
      id: user.id,
      email: user.email,
      name: user.name,
      hasPassword: !!user.password,
      passwordLength: user.password?.length || 0
    })
    
    // Step 2: Verify password
    console.log('🔍 Step 2: Verifying password...')
    const isValidPassword = await verifyPassword(password, user.password)
    console.log('🔍 Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        step: 'password_verification',
        message: 'Invalid password',
        debug: {
          email,
          userExists: true,
          passwordValid: false,
          providedPassword: password,
          storedPasswordHash: user.password?.substring(0, 20) + '...'
        }
      })
    }
    
    // Step 3: Test bcrypt directly
    console.log('🔍 Step 3: Testing bcrypt directly...')
    const directBcryptTest = await bcrypt.compare(password, user.password)
    console.log('🔍 Direct bcrypt test:', directBcryptTest)
    
    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      debug: {
        email,
        userExists: true,
        passwordValid: isValidPassword,
        directBcryptTest,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        }
      }
    })
    
  } catch (error) {
    console.error('❌ Debug Auth Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        errorType: typeof error,
        errorMessage: error instanceof Error ? error.message : String(error)
      }
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Debug Auth API - Use POST with email and password',
    usage: {
      method: 'POST',
      body: {
        email: 'user@example.com',
        password: 'userpassword'
      }
    }
  })
}
