/**
 * Security Headers Middleware
 * Adds security headers to all API responses
 */

import { NextResponse, NextRequest } from 'next/server'

/**
 * Security headers configuration
 */
export const securityHeaders = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',

  // Enable XSS protection in older browsers
  'X-XSS-Protection': '1; mode=block',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',

  // Strict-Transport-Security (HSTS) - only in production
  ...(process.env.NODE_ENV === 'production' && {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  })
}

/**
 * CORS configuration
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXTAUTH_URL || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
}

/**
 * Applies security headers to a response
 */
export const applySecurityHeaders = (response: NextResponse): NextResponse => {
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Remove sensitive headers
  response.headers.delete('X-Powered-By')
  response.headers.delete('Server')

  return response
}

/**
 * Middleware for adding security headers to all responses
 */
export const withSecurityHeaders = (
  handler: (request: NextRequest) => Promise<NextResponse>
) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Handle preflight CORS requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 })
      return applySecurityHeaders(response)
    }

    try {
      const response = await handler(request)
      return applySecurityHeaders(response)
    } catch (error) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
      return applySecurityHeaders(errorResponse)
    }
  }
}

/**
 * Validates request origin for CORS
 */
export const isValidOrigin = (origin: string | null): boolean => {
  if (!origin) return false

  const allowedOrigins = [
    process.env.NEXTAUTH_URL || 'http://localhost:3000',
    ...(process.env.ALLOWED_ORIGINS?.split(',') || [])
  ]

  return allowedOrigins.some(allowed => origin === allowed.trim())
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

/**
 * Default rate limiting configs for different endpoints
 */
export const rateLimitConfigs = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5 // 5 attempts
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100 // 100 requests
  },
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10 // 10 uploads
  }
}

/**
 * In-memory rate limit store (for development/testing)
 * For production, use Redis or a similar service
 */
class RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>()

  check(key: string, config: RateLimitConfig): { allowed: boolean; remaining: number } {
    const now = Date.now()
    const entry = this.store.get(key)

    if (!entry || now > entry.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      })
      return { allowed: true, remaining: config.maxRequests - 1 }
    }

    entry.count += 1

    if (entry.count > config.maxRequests) {
      return { allowed: false, remaining: 0 }
    }

    return { allowed: true, remaining: config.maxRequests - entry.count }
  }

  reset(key: string) {
    this.store.delete(key)
  }
}

export const rateLimitStore = new RateLimitStore()

/**
 * Gets client IP from request (handles proxies)
 */
export const getClientIp = (request: NextRequest): string => {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    'unknown'
  )
}

/**
 * Checks rate limit for a client
 */
export const checkRateLimit = (
  request: NextRequest,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime?: number } => {
  const clientIp = getClientIp(request)
  const { allowed, remaining } = rateLimitStore.check(clientIp, config)

  return {
    allowed,
    remaining,
    resetTime: allowed ? undefined : Date.now() + config.windowMs
  }
}

/**
 * Applies rate limiting to a response
 */
export const applyRateLimitHeaders = (
  response: NextResponse,
  remaining: number,
  resetTime?: number
): NextResponse => {
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  if (resetTime) {
    response.headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString())
  }
  return response
}
