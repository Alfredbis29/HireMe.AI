import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import InjectedContentBlocker from '@/components/InjectedContentBlocker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HireMe.AI - AI-Powered Career Assistant',
  description: 'Transform your career with AI-powered resume analysis and job matching',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body className={inter.className}>
          <SessionProvider>
            <InjectedContentBlocker />
            {children}
          </SessionProvider>
        </body>
    </html>
  )
}
