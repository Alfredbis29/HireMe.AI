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
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          console.log('🔍 Auth: Looking for user:', credentials.email)
          const user = await findUserByEmail(credentials.email)
          console.log('👤 Auth: User found:', user ? 'Yes' : 'No')
          if (!user) return null

          console.log('🔐 Auth: Verifying password...')
          const isValidPassword = await verifyPassword(credentials.password, user.password)
          if (!isValidPassword) return null

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
        // @ts-expect-error id/email/name augmentation
        token.id = user.id
        // @ts-expect-error id/email/name augmentation
        token.email = user.email
        // @ts-expect-error id/email/name augmentation
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error augment
        session.user.id = token.id as string
        // @ts-expect-error augment
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
  secret: process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-secret-change-me' : undefined),
  debug: process.env.NODE_ENV === 'development',
}


