/**
 * Database Connection Retry Logic
 * Provides resilience for database operations with exponential backoff
 */

export interface RetryConfig {
  maxRetries: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
}

/**
 * Default retry configuration
 */
export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 100,
  maxDelayMs: 5000,
  backoffMultiplier: 2
}

/**
 * Calculates delay for exponential backoff
 */
export const calculateBackoffDelay = (attempt: number, config: RetryConfig): number => {
  const delay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1)
  return Math.min(delay, config.maxDelayMs)
}

/**
 * Adds random jitter to delay to prevent thundering herd
 */
export const addJitter = (delay: number, jitterPercent: number = 10): number => {
  const jitter = (Math.random() - 0.5) * (delay * (jitterPercent / 100)) * 2
  return Math.max(1, Math.round(delay + jitter))
}

/**
 * Sleeps for the specified number of milliseconds
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retryable database operation function
 */
export type DbOperation<T> = () => Promise<T>

/**
 * Executes a database operation with exponential backoff retry logic
 */
export const executeWithRetry = async <T>(
  operation: DbOperation<T>,
  config: RetryConfig = defaultRetryConfig,
  operationName: string = 'Database operation'
): Promise<T> => {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      console.log(`📊 ${operationName} - Attempt ${attempt}/${config.maxRetries}`)
      const result = await operation()
      if (attempt > 1) {
        console.log(`✅ ${operationName} - Succeeded after ${attempt} attempts`)
      }
      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === config.maxRetries) {
        console.error(
          `❌ ${operationName} - Failed after ${config.maxRetries} attempts:`,
          lastError.message
        )
        throw lastError
      }

      const delayMs = calculateBackoffDelay(attempt, config)
      const delayWithJitter = addJitter(delayMs)

      console.warn(
        `⏳ ${operationName} - Attempt ${attempt} failed: ${lastError.message}. Retrying in ${delayWithJitter}ms...`
      )

      await sleep(delayWithJitter)
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new Error(`${operationName} failed`)
}

/**
 * Wrapper for database operations with automatic retry
 */
export const withRetry = <T>(
  operation: DbOperation<T>,
  operationName?: string,
  config?: RetryConfig
) => {
  return executeWithRetry(operation, config, operationName)
}

/**
 * Circuit breaker pattern for database connections
 */
export class CircuitBreaker {
  private failureCount: number = 0
  private lastFailureTime: number = 0
  private state: 'closed' | 'open' | 'half-open' = 'closed'

  constructor(
    private failureThreshold: number = 5,
    private resetTimeoutMs: number = 60000
  ) {}

  /**
   * Records a failure
   */
  recordFailure(): void {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open'
      console.warn(
        `🔴 Circuit breaker OPEN: Too many failures (${this.failureCount}/${this.failureThreshold})`
      )
    }
  }

  /**
   * Records a success
   */
  recordSuccess(): void {
    if (this.state === 'half-open') {
      this.state = 'closed'
      this.failureCount = 0
      console.log('🟢 Circuit breaker CLOSED: Connection restored')
    }
  }

  /**
   * Checks if the circuit breaker is open
   */
  isOpen(): boolean {
    if (this.state === 'closed') {
      return false
    }

    if (this.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime
      if (timeSinceLastFailure > this.resetTimeoutMs) {
        this.state = 'half-open'
        this.failureCount = 0
        console.log('🟡 Circuit breaker HALF-OPEN: Attempting recovery')
        return false
      }
      return true
    }

    return false
  }

  /**
   * Gets the current state
   */
  getState(): 'closed' | 'open' | 'half-open' {
    return this.state
  }

  /**
   * Resets the circuit breaker
   */
  reset(): void {
    this.state = 'closed'
    this.failureCount = 0
    this.lastFailureTime = 0
  }
}

/**
 * Executes operation with circuit breaker
 */
export const executeWithCircuitBreaker = async <T>(
  operation: DbOperation<T>,
  circuitBreaker: CircuitBreaker,
  operationName: string = 'Database operation'
): Promise<T> => {
  if (circuitBreaker.isOpen()) {
    throw new Error(
      `${operationName} - Circuit breaker is open. Service temporarily unavailable.`
    )
  }

  try {
    const result = await operation()
    circuitBreaker.recordSuccess()
    return result
  } catch (error) {
    circuitBreaker.recordFailure()
    throw error
  }
}

/**
 * Connection pool with health checking
 */
export class ConnectionPool {
  private connections: Map<string, { lastUsed: number; healthy: boolean }> = new Map()
  private maxConnections: number = 10
  private healthCheckIntervalMs: number = 30000

  constructor(maxConnections: number = 10, healthCheckIntervalMs: number = 30000) {
    this.maxConnections = maxConnections
    this.healthCheckIntervalMs = healthCheckIntervalMs

    // Start health check timer
    this.startHealthCheck()
  }

  /**
   * Gets a connection
   */
  getConnection(id: string): boolean {
    const conn = this.connections.get(id)
    if (conn && conn.healthy) {
      conn.lastUsed = Date.now()
      return true
    }
    return false
  }

  /**
   * Adds a connection
   */
  addConnection(id: string): boolean {
    if (this.connections.size >= this.maxConnections) {
      return false
    }
    this.connections.set(id, {
      lastUsed: Date.now(),
      healthy: true
    })
    return true
  }

  /**
   * Removes a connection
   */
  removeConnection(id: string): void {
    this.connections.delete(id)
  }

  /**
   * Marks a connection as unhealthy
   */
  markUnhealthy(id: string): void {
    const conn = this.connections.get(id)
    if (conn) {
      conn.healthy = false
    }
  }

  /**
   * Gets pool statistics
   */
  getStats(): {
    total: number
    healthy: number
    unhealthy: number
    utilization: number
  } {
    const healthy = Array.from(this.connections.values()).filter(c => c.healthy).length
    const unhealthy = this.connections.size - healthy

    return {
      total: this.connections.size,
      healthy,
      unhealthy,
      utilization: (this.connections.size / this.maxConnections) * 100
    }
  }

  /**
   * Starts periodic health check
   */
  private startHealthCheck(): void {
    setInterval(() => {
      const now = Date.now()
      const timeout = 5 * 60 * 1000 // 5 minutes

      for (const [id, conn] of this.connections.entries()) {
        if (now - conn.lastUsed > timeout) {
          this.removeConnection(id)
        }
      }

      const stats = this.getStats()
      if (stats.unhealthy > 0) {
        console.log(
          `📊 Connection Pool Stats:`,
          `Total: ${stats.total}, Healthy: ${stats.healthy}, Unhealthy: ${stats.unhealthy}, Utilization: ${stats.utilization.toFixed(2)}%`
        )
      }
    }, this.healthCheckIntervalMs)
  }
}
