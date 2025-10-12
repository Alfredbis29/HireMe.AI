import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing session...')
    
    const session = await getServerSession(authOptions)
    console.log('📊 Session data:', session)
    
    return NextResponse.json({
      success: true,
      session: session,
      hasSession: !!session,
      user: session?.user || null
    })
    
  } catch (error) {
    console.error('❌ Session test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Session test failed'
    })
  }
}
