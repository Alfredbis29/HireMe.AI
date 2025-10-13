import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'
import { findUserByEmail, verifyPassword } from '@/lib/db-hybrid'

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
          const user = findUserByEmail(credentials.email)
          if (!user) {
            return null
          }

          const isValidPassword = await verifyPassword(credentials.password, user.password)
          if (!isValidPassword) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('Auth error:', error)
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
        token.id = profile.sub || user?.id || ''
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
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect Callback:', { url, baseUrl })
      
      // If url is relative, make it absolute
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      
      // If url is on the same origin, allow it
      if (url.startsWith(baseUrl)) {
        return url
      }
      
      // Default redirect to home page
      return baseUrl
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
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
