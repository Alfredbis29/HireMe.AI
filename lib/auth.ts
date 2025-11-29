import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'
import { findUserByEmail, verifyPassword } from '@/lib/db-hybrid'

export const authOptions: NextAuthOptions = {
  providers: [
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
        console.log('🚀 Auth: authorize called with email:', credentials?.email)
        console.log('🌍 Environment:', process.env.VERCEL ? 'Vercel' : 'Local', '| NODE_ENV:', process.env.NODE_ENV)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Auth: Missing credentials')
          return null
        }

        try {
          console.log('🔍 Auth: Looking for user:', credentials.email)
          const user = await findUserByEmail(credentials.email)
          console.log('👤 Auth: User found:', user ? `Yes (id: ${user.id})` : 'No')
          
          if (!user) {
            console.log('❌ Auth: User not found for email:', credentials.email)
            return null
          }

          console.log('🔐 Auth: Verifying password...')
          const isValidPassword = await verifyPassword(credentials.password, user.password)
          console.log('🔐 Auth: Password valid:', isValidPassword)
          
          if (!isValidPassword) {
            console.log('❌ Auth: Invalid password for:', credentials.email)
            return null
          }

          console.log('✅ Auth: Authentication successful for:', user.email)
          return { id: user.id, email: user.email, name: user.name }
        } catch (error) {
          console.error('❌ Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && profile) {
        // Google OAuth path
        token.accessToken = account.access_token
        // Prefer profile.sub, else credentials user.id
        token.id = (profile as any)?.sub || user?.id || token.id
      }
      if (user) {
        // Credentials path
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.accessToken = (token as any).accessToken as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  jwt: { maxAge: 30 * 24 * 60 * 60 },
  // IMPORTANT: NEXTAUTH_SECRET must be set in production environment variables
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only-change-in-production',
  debug: true, // Enable debug temporarily to diagnose issues
}


