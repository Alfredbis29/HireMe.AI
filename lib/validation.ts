/**
 * Input Validation Utilities
 * Provides reusable validation functions for API endpoints
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = []

  if (!email) {
    errors.push('Email is required')
  } else if (email.length > 255) {
    errors.push('Email must not exceed 255 characters')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = []

  if (!password) {
    errors.push('Password is required')
  } else if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  } else if (password.length > 128) {
    errors.push('Password must not exceed 128 characters')
  } else if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one digit')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates username/name format
 */
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = []

  if (!name) {
    errors.push('Name is required')
  } else if (name.length < 2) {
    errors.push('Name must be at least 2 characters long')
  } else if (name.length > 100) {
    errors.push('Name must not exceed 100 characters')
  } else if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    errors.push('Name can only contain letters, spaces, hyphens, and apostrophes')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates file upload parameters
 */
export const validateFileUpload = (
  file: File | undefined,
  maxSizeInMB: number = 5,
  allowedMimeTypes: string[] = ['application/pdf', 'application/msword']
): ValidationResult => {
  const errors: string[] = []

  if (!file) {
    errors.push('File is required')
    return { isValid: false, errors }
  }

  if (file.size > maxSizeInMB * 1024 * 1024) {
    errors.push(`File size must not exceed ${maxSizeInMB}MB`)
  }

  if (!allowedMimeTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedMimeTypes.join(', ')}`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitizes string input to prevent XSS attacks
 */
export const sanitizeString = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

/**
 * Validates request body JSON
 */
export const validateJSON = (data: unknown): ValidationResult => {
  const errors: string[] = []

  if (!data || typeof data !== 'object') {
    errors.push('Invalid JSON: request body must be an object')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
