'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SimpleTestPage() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('testpassword123')
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    console.log('🔄 Session changed:', { session, status })
  }, [session, status])

  const handleLogin = async () => {
    try {
      console.log('🔄 Attempting login...')
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      console.log('📊 Login result:', result)
      setResult(result)
    } catch (error) {
      console.error('❌ Login error:', error)
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Simple Login Test</h1>
        
        <div className="space-y-4">
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
          
          <Button onClick={handleLogin} className="w-full">
            Test Login
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-semibold">Session Status:</h3>
            <p>Status: {status}</p>
            <p>Has Session: {session ? 'Yes' : 'No'}</p>
            {session && (
              <div>
                <p>User: {session.user?.name}</p>
                <p>Email: {session.user?.email}</p>
              </div>
            )}
          </div>

          {result && (
            <div>
              <h3 className="font-semibold">Login Result:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
