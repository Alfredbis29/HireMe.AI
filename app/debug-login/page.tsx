'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAuth = async () => {
    try {
      setLoading(true)
      setDebugInfo(null)
      
      const response = await fetch('/api/debug-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      setDebugInfo({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Debug Login Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email you registered with"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the password you registered with"
              />
            </div>
            
            <Button 
              onClick={testAuth} 
              disabled={loading || !email || !password}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Authentication'}
            </Button>
            
            {debugInfo && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Debug Results:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">How to use this debug tool:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Enter the email and password you used to register</li>
                <li>Click "Test Authentication" to see detailed debug info</li>
                <li>Check the results to see where the authentication fails</li>
                <li>Look for any error messages or missing data</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
