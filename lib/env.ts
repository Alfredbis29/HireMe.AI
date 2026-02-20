/**
 * Environment Validation
 * Validates that required environment variables are set at startup
 */

interface EnvironmentConfig {
  node_env: 'development' | 'production' | 'test'
  nextAuthSecret: string
  nextAuthUrl: string
  databaseUrl?: string
  openaiApiKey?: string
  googleClientId?: string
  googleClientSecret?: string
  linkedinClientId?: string
  linkedinClientSecret?: string
}

/**
 * Validates that all required environment variables are set
 */
export const validateEnvironment = (): EnvironmentConfig => {
  const errors: string[] = []

  // Required in all environments
  const nodeEnv = process.env.NODE_ENV as 'development' | 'production' | 'test'
  if (!nodeEnv || !['development', 'production', 'test'].includes(nodeEnv)) {
    errors.push('NODE_ENV must be set to development, production, or test')
  }

  const nextAuthSecret = process.env.NEXTAUTH_SECRET
  if (!nextAuthSecret) {
    errors.push('NEXTAUTH_SECRET is required - generate one with: openssl rand -base64 32')
  }

  const nextAuthUrl = process.env.NEXTAUTH_URL
  if (!nextAuthUrl) {
    errors.push('NEXTAUTH_URL is required (e.g., http://localhost:3000 or your production domain)')
  }

  // Optional but recommended
  const openaiApiKey = process.env.OPENAI_API_KEY
  if (!openaiApiKey && nodeEnv === 'production') {
    errors.push('OPENAI_API_KEY is required in production for resume analysis')
  }

  // Optional OAuth providers
  if (process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_SECRET) {
    errors.push('GOOGLE_CLIENT_SECRET must be set if GOOGLE_CLIENT_ID is provided')
  }
  if (!process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    errors.push('GOOGLE_CLIENT_ID must be set if GOOGLE_CLIENT_SECRET is provided')
  }

  if (process.env.LINKEDIN_CLIENT_ID && !process.env.LINKEDIN_CLIENT_SECRET) {
    errors.push('LINKEDIN_CLIENT_SECRET must be set if LINKEDIN_CLIENT_ID is provided')
  }
  if (!process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    errors.push('LINKEDIN_CLIENT_ID must be set if LINKEDIN_CLIENT_SECRET is provided')
  }

  // Throw error if any required variables are missing
  if (errors.length > 0) {
    const errorMessage = `Environment validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`
    throw new Error(errorMessage)
  }

  return {
    node_env: nodeEnv,
    nextAuthSecret: nextAuthSecret as string,
    nextAuthUrl: nextAuthUrl as string,
    databaseUrl: process.env.DATABASE_URL,
    openaiApiKey,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    linkedinClientId: process.env.LINKEDIN_CLIENT_ID,
    linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET
  }
}

/**
 * Checks if we're in development mode
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development'
}

/**
 * Checks if we're in production mode
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production'
}

/**
 * Checks if we're in test mode
 */
export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test'
}

/**
 * Gets the base URL for the application
 */
export const getBaseUrl = (): string => {
  return process.env.NEXTAUTH_URL || 'http://localhost:3000'
}

/**
 * Safely gets an environment variable with a default value
 */
export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key]
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`)
    return ''
  }
  return value || defaultValue || ''
}

/**
 * Validates a single environment variable
 */
export const validateEnvVariable = (key: string, required: boolean = false): boolean => {
  const value = process.env[key]
  if (required && !value) {
    throw new Error(`Required environment variable ${key} is not set`)
  }
  return !!value
}

/**
 * Logs environment configuration (safe - excludes sensitive values)
 */
export const logEnvironmentConfig = () => {
  const safeConfig = {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    HAS_OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    HAS_GOOGLE_OAUTH: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    HAS_LINKEDIN_OAUTH: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
    HAS_DATABASE_URL: !!process.env.DATABASE_URL,
    DEBUG_MODE: process.env.DEBUG === 'true'
  }

  console.log('📋 Environment Configuration:', JSON.stringify(safeConfig, null, 2))
}
