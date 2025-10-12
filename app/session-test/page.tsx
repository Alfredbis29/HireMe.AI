'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SessionTestPage() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('pablo@gmail.com')
  const [password, setPassword] = useState('testpassword123')
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log('🔄 Session changed:', { session, status })
  }, [session, status])

  const testLogin = async () => {
    setIsLoading(true)
    try {
      console.log('🔄 Attempting login...')
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      console.log('📊 Login result:', result)
      
      // Wait a moment for session to update
      setTimeout(async () => {
        try {
          const response = await fetch('/api/test-login-session', {
            method: 'POST',
            credentials: 'include'
          })
          const data = await response.json()
          setTestResult(data)
        } catch (error) {
          console.error('❌ Session test error:', error)
        }
      }, 1000)
      
    } catch (error) {
      console.error('❌ Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const testSessionAPI = async () => {
    try {
      const response = await fetch('/api/test-login-session', {
        method: 'POST',
        credentials: 'include'
      })
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      console.error('❌ Session API error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🔍 Session Test</h1>
        
        {/* Current Session Status */}
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
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={testLogin} disabled={isLoading}>
                Test Login
              </Button>
              <Button onClick={testSessionAPI}>
                Test Session API
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(testResult, null, 2)}
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
              <Button onClick={() => signOut()}>
                Sign Out
              </Button>
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
