'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DebugLoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('testpassword123')
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    console.log('🔄 Session status changed:', status)
    console.log('📊 Session data:', session)
  }, [session, status])

  const testSignIn = async () => {
    setIsLoading(true)
    setDebugInfo(null)
    
    try {
      console.log('🔄 Starting sign in process...')
      console.log('📧 Email:', email)
      console.log('🔐 Password:', password)
      
      const result = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
      })
      
      console.log('📊 Sign in result:', result)
      
      setDebugInfo({
        signInResult: result,
        sessionAfterSignIn: session,
        statusAfterSignIn: status,
        timestamp: new Date().toISOString()
      })
      
      // Wait a moment for session to update
      setTimeout(() => {
        console.log('⏰ Session after delay:', session)
        setDebugInfo((prev: any) => ({
          ...prev,
          sessionAfterDelay: session,
          statusAfterDelay: status
        }))
      }, 2000)
      
    } catch (error) {
      console.error('❌ Sign in error:', error)
      setDebugInfo({
        error: error,
        signInResult: null
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testSessionAPI = async () => {
    try {
      const response = await fetch('/api/test-session')
      const data = await response.json()
      setDebugInfo((prev: any) => ({
        ...prev,
        sessionAPIResponse: data
      }))
    } catch (error) {
      console.error('❌ Session API error:', error)
    }
  }

  const createTestUser = async () => {
    try {
      const response = await fetch('/api/test-complete-auth', {
        method: 'POST'
      })
      const data = await response.json()
      setDebugInfo((prev: any) => ({
        ...prev,
        testUserCreation: data
      }))
    } catch (error) {
      console.error('❌ Test user creation error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🔍 Login Debug Tool</h1>
        
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Session Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
              {session && (
                <div>
                  <p><strong>User ID:</strong> {session.user?.id}</p>
                  <p><strong>Name:</strong> {session.user?.name}</p>
                  <p><strong>Email:</strong> {session.user?.email}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test User Creation */}
        <Card>
          <CardHeader>
            <CardTitle>Test User Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={createTestUser}>
              Create Test User
            </Button>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Test Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="testpassword123"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={testSignIn} disabled={isLoading}>
                Test Sign In
              </Button>
              <Button onClick={testSessionAPI}>
                Test Session API
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug Results */}
        {debugInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Debug Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-x-2">
            {session ? (
              <div className="space-x-2">
                <Button onClick={() => signOut()}>
                  Sign Out
                </Button>
                <Button onClick={() => router.push('/')}>
                  Go to Home
                </Button>
              </div>
            ) : (
              <Button onClick={() => signIn()}>
                Sign In
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
