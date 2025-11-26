import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing complete auth flow...')

    const session = await getServerSession(authOptions)
    console.log('📊 Session from getServerSession:', session)    // Test headers
    const headers = request.headers
    const cookies = headers.get('cookie')
    console.log('🍪 Cookies:', cookies)

    const hasSessionToken = cookies?.includes('next-auth.session-token') ||
                           cookies?.includes('__Secure-next-auth.session-token')
    console.log('🔐 Has session token:', hasSessionToken)

  
    if (cookies) {
      const sessionWithCookies = await getServerSession(authOptions)
      console.log('📊 Session with cookies:', sessionWithCookies)
    }

    return NextResponse.json({
      success: true,
      session: session,
      hasSession: !!session,
      user: session?.user || null,
      cookies: cookies,
      hasSessionToken: hasSessionToken,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Auth flow test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Auth flow test failed'
    })
  }
}
