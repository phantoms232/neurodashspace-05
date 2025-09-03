import DOMPurify from 'dompurify';

// Input validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  gameCode: /^[A-Z0-9]{6}$/,
  referralCode: /^[A-Z0-9]{8}$/,
  testType: /^[a-zA-Z_-]{1,50}$/,
  fullName: /^[a-zA-Z\s'.-]{1,100}$/
};

// Password strength requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true
};

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove potential script tags and dangerous content
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  // Additional cleanup for extra security
  return cleaned.trim().slice(0, 1000); // Limit length
}

/**
 * Validate email format
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(email);
  
  if (!sanitized) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!VALIDATION_PATTERNS.email.test(sanitized)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    return { isValid: false, error: `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters` };
  }
  
  if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    return { isValid: false, error: `Password must not exceed ${PASSWORD_REQUIREMENTS.maxLength} characters` };
  }
  
  if (!VALIDATION_PATTERNS.password.test(password)) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
    };
  }
  
  return { isValid: true };
}

/**
 * Validate username format
 */
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(username);
  
  if (!sanitized) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (!VALIDATION_PATTERNS.username.test(sanitized)) {
    return { isValid: false, error: 'Username must be 3-20 characters, letters, numbers, underscore, or dash only' };
  }
  
  return { isValid: true };
}

/**
 * Validate full name format
 */
export function validateFullName(fullName: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(fullName);
  
  if (!sanitized) {
    return { isValid: false, error: 'Full name is required' };
  }
  
  if (!VALIDATION_PATTERNS.fullName.test(sanitized)) {
    return { isValid: false, error: 'Full name contains invalid characters' };
  }
  
  return { isValid: true };
}

/**
 * Validate game code format
 */
export function validateGameCode(code: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(code);
  
  if (!sanitized) {
    return { isValid: false, error: 'Game code is required' };
  }
  
  if (!VALIDATION_PATTERNS.gameCode.test(sanitized)) {
    return { isValid: false, error: 'Game code must be exactly 6 alphanumeric characters' };
  }
  
  return { isValid: true };
}

/**
 * Validate referral code format
 */
export function validateReferralCode(code: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(code);
  
  if (!sanitized) {
    return { isValid: false, error: 'Referral code is required' };
  }
  
  if (!VALIDATION_PATTERNS.referralCode.test(sanitized)) {
    return { isValid: false, error: 'Referral code must be exactly 8 alphanumeric characters' };
  }
  
  return { isValid: true };
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  
  constructor(private maxAttempts: number = 5, private windowMs: number = 300000) {} // 5 attempts per 5 minutes
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Reset if window has passed
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Check if limit exceeded
    if (record.count >= this.maxAttempts) {
      return false;
    }
    
    // Increment count
    record.count++;
    record.lastAttempt = now;
    return true;
  }
  
  getRemainingAttempts(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return this.maxAttempts;
    
    const now = Date.now();
    if (now - record.lastAttempt > this.windowMs) {
      return this.maxAttempts;
    }
    
    return Math.max(0, this.maxAttempts - record.count);
  }
}

// Global rate limiters
export const authRateLimiter = new RateLimiter(5, 300000); // 5 attempts per 5 minutes
export const gameRateLimiter = new RateLimiter(10, 60000); // 10 attempts per minute
export const testRateLimiter = new RateLimiter(20, 60000); // 20 attempts per minute