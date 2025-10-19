import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing login and session...')
    
    // Get the session
    const session = await getServerSession(authOptions)
    console.log('📊 Current session:', session)
    
    // Get headers to check cookies
    const headers = request.headers
    const cookies = headers.get('cookie')
    console.log('🍪 Cookies:', cookies)
    
    // Check if we have NextAuth session cookie
    const hasNextAuthCookie = cookies?.includes('next-auth.session-token') || cookies?.includes('__Secure-next-auth.session-token')
    console.log('🔐 Has NextAuth cookie:', hasNextAuthCookie)
    
    return NextResponse.json({
      success: true,
      session: session,
      hasSession: !!session,
      user: session?.user || null,
      cookies: cookies,
      hasNextAuthCookie: hasNextAuthCookie,
      headers: Object.fromEntries(headers.entries())
    })
    
  } catch (error) {
    console.error('❌ Login session test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Login session test failed'
    })
  }
}
