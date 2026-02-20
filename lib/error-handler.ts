/**
 * Error Handling Utilities
 * Provides standardized error handling for API endpoints
 */

import { NextResponse, NextRequest } from 'next/server'

export interface ApiError {
  code: string
  message: string
  statusCode: number
  details?: Record<string, unknown>
  timestamp: string
}

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number = 500,
    message: string = 'Internal Server Error',
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Common error codes
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST'
}

/**
 * Creates a standardized API error response
 */
export const createErrorResponse = (error: Error | AppError): ApiError => {
  const timestamp = new Date().toISOString()

  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      timestamp
    }
  }

  // Handle native errors
  console.error('Unhandled error:', error)

  return {
    code: ErrorCodes.INTERNAL_ERROR,
    message: 'An unexpected error occurred',
    statusCode: 500,
    details: process.env.NODE_ENV === 'development' ? { error: error.message } : undefined,
    timestamp
  }
}

/**
 * Sends a standardized error response
 */
export const sendErrorResponse = (error: Error | AppError): NextResponse => {
  const apiError = createErrorResponse(error)

  return NextResponse.json(
    {
      success: false,
      error: apiError
    },
    { status: apiError.statusCode }
  )
}

/**
 * Handles async errors in route handlers
 */
export const asyncHandler =
  (fn: (req: NextRequest) => Promise<NextResponse>) =>
  async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await fn(req)
    } catch (error) {
      return sendErrorResponse(error instanceof Error ? error : new Error(String(error)))
    }
  }

/**
 * Validation error factory
 */
export const createValidationError = (
  message: string,
  details?: Record<string, unknown>
): AppError => {
  return new AppError(ErrorCodes.VALIDATION_ERROR, 400, message, details)
}

/**
 * Authentication error factory
 */
export const createAuthenticationError = (message: string = 'Authentication required'): AppError => {
  return new AppError(ErrorCodes.AUTHENTICATION_ERROR, 401, message)
}

/**
 * Authorization error factory
 */
export const createAuthorizationError = (message: string = 'Access denied'): AppError => {
  return new AppError(ErrorCodes.AUTHORIZATION_ERROR, 403, message)
}

/**
 * Not found error factory
 */
export const createNotFoundError = (resource: string): AppError => {
  return new AppError(ErrorCodes.NOT_FOUND, 404, `${resource} not found`)
}

/**
 * Conflict error factory
 */
export const createConflictError = (message: string): AppError => {
  return new AppError(ErrorCodes.CONFLICT, 409, message)
}

/**
 * Database error factory
 */
export const createDatabaseError = (message: string = 'Database operation failed'): AppError => {
  return new AppError(ErrorCodes.DATABASE_ERROR, 500, message, {
    hint: 'Please try again later or contact support'
  })
}
