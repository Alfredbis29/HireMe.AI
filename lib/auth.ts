import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'
import { findUserByEmail, verifyPassword } from '@/lib/db-hybrid'

export const authOptions: NextAuthOptions = {
  providers: [
    // Only enable Google if env vars are present
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Auth: Missing credentials')
          return null
        }

        try {
          console.log('🔍 Auth: Looking for user:', credentials.email)
          const user = await findUserByEmail(credentials.email)
          console.log('👤 Auth: User found:', user ? 'Yes' : 'No')
          
          if (!user) {
            console.log('❌ Auth: User not found')
            return null
          }

          console.log('🔐 Auth: Verifying password...')
          const isValidPassword = await verifyPassword(credentials.password, user.password)
          console.log('🔐 Auth: Password valid:', isValidPassword)
          
          if (!isValidPassword) {
            console.log('❌ Auth: Invalid password')
            return null
          }

          console.log('✅ Auth: Authentication successful for:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('❌ Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      console.log('🔑 JWT Callback:', { token, account, profile, user })
      
      if (account && profile) {
        token.accessToken = account.access_token
        token.id = profile.sub
      }
      
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      
      console.log('🔑 JWT Token updated:', token)
      return token
    },
    async session({ session, token }) {
      console.log('📊 Session Callback:', { session, token })
      
      if (token && session.user) {
        session.user.id = token.id as string
        session.accessToken = token.accessToken as string
      }
      
      console.log('📊 Session updated:', session)
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true,
  // Provide a sensible default secret in development to avoid 500s
  secret: process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-secret-change-me' : undefined),
}
