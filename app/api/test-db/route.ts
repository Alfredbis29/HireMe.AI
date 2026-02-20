import { NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/db-memory'

export async function POST() {
  try {
    console.log('🧪 Testing database connection...')

    // Test creating a user
    const testEmail = `test-${Date.now()}@example.com`
    const testUser = await createUser(testEmail, 'testpassword', 'Test User')
    console.log('✅ User created:', testUser.id)

    // Test finding the user
    const foundUser = await findUserByEmail(testEmail)
    console.log('✅ User found:', foundUser?.id)

    return NextResponse.json({
      success: true,
      message: 'Database test successful',
      userId: testUser.id,
      foundUser: foundUser?.id,
      email: foundUser?.email
    })

  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Database test failed',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
