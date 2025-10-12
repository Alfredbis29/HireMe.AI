'use client'

import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DebugPage() {
  const { data: session, status } = useSession()
  const [testEmail, setTestEmail] = useState('test@example.com')
  const [testPassword, setTestPassword] = useState('testpassword123')
  const [testResults, setTestResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testLogin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: testPassword })
      })
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: 'Test failed' })
    } finally {
      setIsLoading(false)
    }
  }

  const testAuthSystem = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/debug-auth')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: 'Debug failed' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email: testEmail,
        password: testPassword,
        redirect: false,
      })
      setTestResults({ signInResult: result })
    } catch (error) {
      setTestResults({ success: false, error: 'Sign in failed' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🔍 Authentication Debug Tool</h1>
        
        {/* Current Session Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Session Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Session:</strong> {session ? 'Active' : 'Not Active'}</p>
            {session && (
              <div>
                <p><strong>User:</strong> {session.user?.name}</p>
                <p><strong>Email:</strong> {session.user?.email}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Authentication System */}
        <Card>
          <CardHeader>
            <CardTitle>Test Authentication System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testAuthSystem} disabled={isLoading}>
              Test Auth System
            </Button>
          </CardContent>
        </Card>

        {/* Test Login */}
        <Card>
          <CardHeader>
            <CardTitle>Test Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="testpassword123"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={testLogin} disabled={isLoading}>
                Test Login API
              </Button>
              <Button onClick={handleSignIn} disabled={isLoading}>
                Test NextAuth SignIn
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {testResults && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(testResults, null, 2)}
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
