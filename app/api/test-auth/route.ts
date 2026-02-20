import { NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/db-memory'

export async function POST() {
  try {
    console.log('🧪 Testing authentication flow...')
    
    // Test creating a user
    const testEmail = `test-auth-${Date.now()}@example.com`
    console.log('📝 Creating test user:', testEmail)
    
    const testUser = await createUser(testEmail, 'testpassword123', 'Test Auth User')
    console.log('✅ User created:', testUser.id)
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Test finding the user (simulating sign-in)
    console.log('🔍 Looking for user:', testEmail)
    const foundUser = await findUserByEmail(testEmail)
    console.log('👤 User found:', foundUser ? 'Yes' : 'No')
    
    if (foundUser) {
      console.log('✅ Authentication flow test successful!')
      return NextResponse.json({
        success: true,
        message: 'Authentication flow test successful',
        userId: testUser.id,
        foundUser: foundUser.id,
        userEmail: foundUser.email
      })
    } else {
      console.log('❌ Authentication flow test failed - user not found after creation')
      return NextResponse.json({
        success: false,
        message: 'User not found after creation - database persistence issue',
        createdUserId: testUser.id,
        foundUser: null
      })
    }
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication test failed',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
