import { NextResponse } from 'next/server'
import { createUser, findUserByEmail, verifyPassword } from '@/lib/db-memory'

export async function POST() {
  try {
    console.log('🧪 Testing complete authentication flow...')
    
    // Step 1: Create a test user
    const testEmail = `test-login-${Date.now()}@example.com`
    const testPassword = 'testpassword123'
    const testName = 'Test Login User'
    
    console.log('📝 Step 1: Creating test user:', testEmail)
    const testUser = await createUser(testEmail, testPassword, testName)
    console.log('✅ User created:', testUser.id)
    
    // Step 2: Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Step 3: Try to find the user
    console.log('🔍 Step 2: Looking for user:', testEmail)
    const foundUser = await findUserByEmail(testEmail)
    console.log('👤 User found:', foundUser ? 'Yes' : 'No')
    
    if (!foundUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found after creation',
        step: 'user_lookup_failed'
      })
    }
    
    // Step 4: Verify password
    console.log('🔐 Step 3: Verifying password...')
    const isValidPassword = await verifyPassword(testPassword, foundUser.password)
    console.log('🔐 Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Password verification failed',
        step: 'password_verification_failed'
      })
    }
    
    // Step 5: Check environment variables
    const envStatus = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not Set',
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set'
    }
    
    console.log('✅ Complete authentication test successful')
    return NextResponse.json({
      success: true,
      message: 'Complete authentication flow successful',
      steps: {
        userCreation: 'Success',
        userLookup: 'Success',
        passwordVerification: 'Success'
      },
      environmentVariables: envStatus,
      testUser: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name
      },
      foundUser: {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name
      }
    })
    
  } catch (error) {
    console.error('❌ Complete authentication test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Complete authentication test failed',
      step: 'error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}
