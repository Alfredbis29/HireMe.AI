/**
 * API Request Logging Utilities
 * Provides structured logging for API requests and responses
 */

import { NextRequest, NextResponse } from 'next/server'

export interface LogContext {
  requestId: string
  timestamp: string
  method: string
  path: string
  duration?: number
}

export interface RequestLog {
  requestId: string
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  method: string
  path: string
  message: string
  data?: Record<string, unknown>
  duration?: number
}

/**
 * Generates a unique request ID
 */
export const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Creates a logging context from a request
 */
export const createLogContext = (request: NextRequest): LogContext => {
  return {
    requestId: generateRequestId(),
    timestamp: new Date().toISOString(),
    method: request.method,
    path: new URL(request.url).pathname
  }
}

/**
 * Formats a log entry as a structured string
 */
const formatLogEntry = (log: RequestLog): string => {
  const prefix = `[${log.timestamp}] [${log.requestId}] [${log.level}]`
  const meta = `${log.method} ${log.path}`
  const duration = log.duration ? ` (${log.duration}ms)` : ''
  const data = log.data ? ` | ${JSON.stringify(log.data)}` : ''

  return `${prefix} ${meta}${duration} - ${log.message}${data}`
}

/**
 * Logs an API request
 */
export const logRequest = (context: LogContext, message: string = 'Request received', data?: Record<string, unknown>) => {
  const log: RequestLog = {
    requestId: context.requestId,
    timestamp: context.timestamp,
    level: 'INFO',
    method: context.method,
    path: context.path,
    message,
    data
  }

  console.log(formatLogEntry(log))
}

/**
 * Logs a successful API response
 */
export const logResponse = (
  context: LogContext,
  statusCode: number,
  message: string = 'Response sent',
  duration?: number
) => {
  const log: RequestLog = {
    requestId: context.requestId,
    timestamp: context.timestamp,
    level: statusCode >= 400 ? 'WARN' : 'INFO',
    method: context.method,
    path: context.path,
    message: `${message} (${statusCode})`,
    duration
  }

  const logFn = statusCode >= 400 ? console.warn : console.log
  logFn(formatLogEntry(log))
}

/**
 * Logs an error
 */
export const logError = (
  context: LogContext,
  error: Error | string,
  additionalData?: Record<string, unknown>,
  duration?: number
) => {
  const message = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : undefined

  const log: RequestLog = {
    requestId: context.requestId,
    timestamp: context.timestamp,
    level: 'ERROR',
    method: context.method,
    path: context.path,
    message,
    data: {
      ...additionalData,
      ...(process.env.NODE_ENV === 'development' && { stack })
    },
    duration
  }

  console.error(formatLogEntry(log))
}

/**
 * Logs a warning
 */
export const logWarning = (
  context: LogContext,
  message: string,
  data?: Record<string, unknown>,
  duration?: number
) => {
  const log: RequestLog = {
    requestId: context.requestId,
    timestamp: context.timestamp,
    level: 'WARN',
    method: context.method,
    path: context.path,
    message,
    data,
    duration
  }

  console.warn(formatLogEntry(log))
}

/**
 * Logs debug information
 */
export const logDebug = (
  context: LogContext,
  message: string,
  data?: Record<string, unknown>,
  duration?: number
) => {
  if (process.env.DEBUG !== 'true') return

  const log: RequestLog = {
    requestId: context.requestId,
    timestamp: context.timestamp,
    level: 'DEBUG',
    method: context.method,
    path: context.path,
    message,
    data,
    duration
  }

  console.debug(formatLogEntry(log))
}

/**
 * Middleware for request/response logging
 */
export const withLogging = (
  handler: (request: NextRequest, context?: LogContext) => Promise<NextResponse>
) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    const context = createLogContext(request)
    const startTime = Date.now()

    logRequest(context, 'Incoming request')

    try {
      const response = await handler(request, context)
      const duration = Date.now() - startTime

      logResponse(context, response.status, 'Response sent', duration)

      return response
    } catch (error) {
      const duration = Date.now() - startTime
      logError(context, error instanceof Error ? error : new Error(String(error)), undefined, duration)

      throw error
    }
  }
}

/**
 * Extracts safe request data for logging (removes sensitive info)
 */
export const getSafeRequestData = (request: NextRequest): Record<string, unknown> => {
  const url = new URL(request.url)

  return {
    method: request.method,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams.entries()),
    headers: {
      'user-agent': request.headers.get('user-agent'),
      'content-type': request.headers.get('content-type')
    }
  }
}
