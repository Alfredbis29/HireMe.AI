# HireMe.AI Developer Guide

## 📚 Table of Contents

- [Setup & Installation](#setup--installation)
- [Architecture](#architecture)
- [API Utilities](#api-utilities)
- [Error Handling](#error-handling)
- [Input Validation](#input-validation)
- [Security](#security)
- [Database Operations](#database-operations)
- [Logging](#logging)
- [Environment Configuration](#environment-configuration)

---

## Setup & Installation

### Prerequisites

- Node.js 18+ or higher
- npm or yarn package manager
- MongoDB (optional, for persistent storage)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/Alfredbis29/HireMe.AI.git
cd HireMe.AI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Update .env.local with your configuration
# Required:
# - NEXTAUTH_SECRET (generated above)
# - NEXTAUTH_URL (http://localhost:3000 for development)
# Optional:
# - OPENAI_API_KEY (for resume analysis)
# - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (for OAuth)
# - LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET (for LinkedIn integration)

# Run development server
npm run dev

# Visit http://localhost:3000
```

---

## Architecture

### Project Structure

```
HireMe.AI/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes and endpoints
│   ├── auth/                 # Authentication pages
│   ├── upload/               # Resume upload interface
│   └── results/              # Analysis results display
├── components/               # Reusable React components
├── lib/                      # Utility functions and helpers
│   ├── validation.ts        # Input validation utilities
│   ├── error-handler.ts     # Error handling utilities
│   ├── request-logger.ts    # Request/response logging
│   ├── security.ts          # Security headers and rate limiting
│   ├── env.ts               # Environment configuration
│   ├── db-retry.ts          # Database retry logic
│   ├── db.ts                # Database operations
│   └── auth.ts              # Authentication utilities
├── types/                    # TypeScript type definitions
└── public/                   # Static assets
```

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: MongoDB / In-Memory (dev)
- **API Integration**: OpenAI (resume analysis), LinkedIn, Google OAuth
- **Form Handling**: React Hook Form
- **File Upload**: Multer + React Dropzone

---

## API Utilities

### Creating a New API Route

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { withSecurityHeaders } from '@/lib/security'
import { withLogging, createLogContext } from '@/lib/request-logger'
import { sendErrorResponse, AppError, ErrorCodes } from '@/lib/error-handler'
import { validateEmail, validatePassword } from '@/lib/validation'

export const POST = withSecurityHeaders(
  withLogging(async (request: NextRequest, context) => {
    try {
      const body = await request.json()

      // Validate input
      const emailValidation = validateEmail(body.email)
      if (!emailValidation.isValid) {
        throw new AppError(
          ErrorCodes.VALIDATION_ERROR,
          400,
          'Invalid email',
          { errors: emailValidation.errors }
        )
      }

      // Your logic here
      const result = { success: true, data: 'Your data' }

      return NextResponse.json(result)
    } catch (error) {
      return sendErrorResponse(error instanceof Error ? error : new Error(String(error)), request)
    }
  })
)
```

### Using Middleware Wrappers

```typescript
// withSecurityHeaders - Adds security headers automatically
// withLogging - Logs request/response with request ID
// withRetry - Adds automatic retry logic with exponential backoff (for async operations)

// Combine multiple wrappers
export const GET = withSecurityHeaders(withLogging(myHandler))
```

---

## Error Handling

### Built-in Error Classes

```typescript
import { AppError, ErrorCodes, createValidationError, createAuthenticationError } from '@/lib/error-handler'

// Standard HTTP errors
throw new AppError(ErrorCodes.VALIDATION_ERROR, 400, 'Invalid input', { field: 'email' })
throw new AppError(ErrorCodes.NOT_FOUND, 404, 'User not found')
throw new AppError(ErrorCodes.AUTHENTICATION_ERROR, 401, 'Unauthorized')

// Specialized error factories
throw createValidationError('Email is invalid', { field: 'email' })
throw createAuthenticationError('Session expired')
throw createAuthorizationError('Insufficient permissions')
throw createDatabaseError('Connection failed')
```

### Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email",
    "statusCode": 400,
    "details": { "field": "email" },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## Input Validation

### Available Validators

```typescript
import {
  validateEmail,
  validatePassword,
  validateName,
  validateFileUpload,
  sanitizeString
} from '@/lib/validation'

// Email validation
const emailResult = validateEmail('user@example.com')
if (!emailResult.isValid) {
  console.log(emailResult.errors) // Array of error messages
}

// Password validation (min 8 chars, uppercase, lowercase, number)
const passwordResult = validatePassword('MyPassword123')

// Name validation (2-100 chars, letters/spaces/hyphens only)
const nameResult = validateName('John Doe')

// File upload validation
const fileResult = validateFileUpload(file, 5, ['application/pdf', 'application/msword'])

// XSS prevention
const safe = sanitizeString(userInput)
```

### Validation Result Object

```typescript
interface ValidationResult {
  isValid: boolean
  errors: string[] // Detailed error messages
}
```

---

## Security

### Security Headers

All responses automatically include:

- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-XSS-Protection: 1; mode=block` - Browser XSS protection
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- `Strict-Transport-Security: max-age=31536000` (production only)

### Rate Limiting

```typescript
import { checkRateLimit, rateLimitConfigs } from '@/lib/security'

// Check rate limit
const result = checkRateLimit(request, rateLimitConfigs.auth)

if (!result.allowed) {
  return NextResponse.json(
    { error: 'Rate limit exceeded' },
    { status: 429 }
  )
}

// Use config for your endpoint
export const POST = async (request: NextRequest) => {
  const limit = checkRateLimit(request, rateLimitConfigs.api)
  // ... rest of handler
}
```

### CORS Configuration

Configured in `lib/security.ts`. Update `NEXTAUTH_URL` and `ALLOWED_ORIGINS` environment variables.

---

## Database Operations

### Retry Logic with Exponential Backoff

```typescript
import { executeWithRetry, defaultRetryConfig } from '@/lib/db-retry'

const user = await executeWithRetry(
  () => findUserByEmail(email),
  defaultRetryConfig,
  'Find user by email'
)

// Custom retry configuration
const customConfig = {
  maxRetries: 5,
  initialDelayMs: 50,
  maxDelayMs: 10000,
  backoffMultiplier: 2
}

const result = await executeWithRetry(operation, customConfig)
```

### Circuit Breaker Pattern

```typescript
import { CircuitBreaker, executeWithCircuitBreaker } from '@/lib/db-retry'

const dbCircuitBreaker = new CircuitBreaker(
  5,      // Failure threshold
  60000   // Reset timeout in ms
)

// Use in operations
const result = await executeWithCircuitBreaker(
  () => database.query(...),
  dbCircuitBreaker,
  'Database query'
)
```

### Connection Pool Management

```typescript
import { ConnectionPool } from '@/lib/db-retry'

const pool = new ConnectionPool(
  10,      // Max connections
  30000    // Health check interval
)

// Get pool statistics
const stats = pool.getStats()
console.log(`Pool utilization: ${stats.utilization.toFixed(2)}%`)
```

---

## Logging

### Structured Request Logging

```typescript
import { withLogging, logRequest, logResponse, logError } from '@/lib/request-logger'

// Automatic logging with middleware
export const GET = withLogging(async (request, context) => {
  // context contains: requestId, timestamp, method, path

  logRequest(context, 'Processing request', { userId: '123' })

  // ... do work ...

  logResponse(context, 200, 'Successfully processed', duration)

  return NextResponse.json({ success: true })
})

// Manual logging
const context = createLogContext(request)
logError(context, new Error('Database failed'), { table: 'users' })
```

### Log Format

```
[2024-01-15T10:30:00Z] [1705317000000-abc123def] [INFO] POST /api/users (125ms) - Request received | {"userId":"123"}
```

---

## Environment Configuration

### Validating Environment

```typescript
import { validateEnvironment, isDevelopment, isProduction } from '@/lib/env'

// Validate at startup
try {
  const config = validateEnvironment()
  console.log('✅ Environment is valid')
} catch (error) {
  console.error('❌ Environment validation failed:', error.message)
  process.exit(1)
}

// Environment checks
if (isDevelopment()) {
  // Dev-only code
}

if (isProduction()) {
  // Prod-only code
}
```

### Required Environment Variables

```env
# Required
NODE_ENV=development
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# Optional but recommended
OPENAI_API_KEY=sk-...
DATABASE_URL=mongodb://...

# Optional OAuth providers (both required if using)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...

# Optional
DEBUG=false
ALLOWED_ORIGINS=https://example.com,https://app.example.com
```

---

## Best Practices

### 1. Always Use Error Handling

```typescript
try {
  // Your code
} catch (error) {
  return sendErrorResponse(error, request)
}
```

### 2. Validate User Input

```typescript
const validation = validateEmail(input)
if (!validation.isValid) {
  throw createValidationError('Invalid email', { errors: validation.errors })
}
```

### 3. Use Retry Logic for Database Operations

```typescript
const user = await executeWithRetry(
  () => findUser(id),
  undefined,
  'Find user'
)
```

### 4. Implement Rate Limiting for Auth Endpoints

```typescript
const limit = checkRateLimit(request, rateLimitConfigs.auth)
if (!limit.allowed) {
  throw new AppError(ErrorCodes.RATE_LIMIT_ERROR, 429, 'Too many attempts')
}
```

### 5. Log Important Operations

```typescript
const context = createLogContext(request)
logRequest(context, 'User registration started', { email: sanitizeString(email) })
// ... process ...
logResponse(context, 200, 'User registered', duration)
```

### 6. Sanitize User Input

```typescript
const cleanName = sanitizeString(userInput)
```

### 7. Use TypeScript Strict Mode

- Enable `noImplicitAny`
- Enable `strictNullChecks`
- Use proper typing for all functions

---

## Testing

### Running Tests

```bash
npm test
```

### Testing API Routes

Create test files in `__tests__` directories:

```typescript
import { POST } from '@/app/api/users/route'
import { NextRequest } from 'next/server'

describe('/api/users', () => {
  it('should create a user', async () => {
    const request = new NextRequest('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'Test123' })
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
```

---

## Troubleshooting

### Environment Variable Issues

```bash
# Check environment variables
node -e "console.log(process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not set')"

# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

### Database Connection Issues

1. Check `NEXTAUTH_URL` matches your domain
2. Verify MongoDB connection string
3. Check retry logs for connection attempts
4. Review circuit breaker state with `getStats()`

### Rate Limiting Issues

Check X-RateLimit-Remaining and X-RateLimit-Reset headers in response.

### TypeScript Errors

Run `npm run build` to check for TypeScript errors.

---

## Contributing

When adding new features:

1. ✅ Add proper TypeScript types
2. ✅ Add input validation
3. ✅ Add error handling
4. ✅ Add structured logging
5. ✅ Add security headers
6. ✅ Update this documentation

---

## Support

For issues or questions:

- Check the [GitHub Issues](https://github.com/Alfredbis29/HireMe.AI/issues)
- Review documentation in `/docs`
- Check environment validation errors

## Test Suite

Comprehensive testing framework for authentication and job matching features.
