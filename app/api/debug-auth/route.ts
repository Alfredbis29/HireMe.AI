import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/db-hybrid'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Testing authentication system...')
    
    // Test 1: Check if we can create a user
    const testEmail = `debug-${Date.now()}@example.com`
    console.log('📝 Creating test user:', testEmail)
    
    const testUser = await createUser(testEmail, 'testpassword123', 'Debug Test User')
    console.log('✅ User created:', testUser.id)
    
    // Test 2: Check if we can find the user
    console.log('🔍 Looking for user:', testEmail)
    const foundUser = await findUserByEmail(testEmail)
    console.log('👤 User found:', foundUser ? 'Yes' : 'No')
    
    // Test 3: Check environment variables
    const envCheck = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not Set',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not Set',
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set'
    }
    
    return NextResponse.json({
      success: true,
      message: 'Authentication system diagnostic complete',
      tests: {
        userCreation: 'Success',
        userLookup: foundUser ? 'Success' : 'Failed',
        environmentVariables: envCheck
      },
      createdUser: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name
      },
      foundUser: foundUser ? {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name
      } : null
    })
    
  } catch (error) {
    console.error('❌ Debug authentication failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Debug failed',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
