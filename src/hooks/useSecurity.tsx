import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  validateGameCode, 
  validateReferralCode, 
  sanitizeInput,
  gameRateLimiter,
  testRateLimiter 
} from '@/lib/security';

export const useSecurity = () => {
  const { toast } = useToast();

  // Security logging function
  const logSecurityEvent = useCallback(async (eventType: string, details: Record<string, any> = {}) => {
    try {
      // Type assertion needed until Supabase types are updated
      await (supabase.rpc as any)('log_security_event', {
        event_type: eventType,
        details
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, []);

  // Secure game code validation
  const validateAndSanitizeGameCode = useCallback((code: string): { isValid: boolean; sanitizedCode?: string; error?: string } => {
    const sanitized = sanitizeInput(code);
    const validation = validateGameCode(sanitized);
    
    if (!validation.isValid) {
      logSecurityEvent('invalid_game_code_attempt', { attempted_code: code });
      return { isValid: false, error: validation.error };
    }
    
    return { isValid: true, sanitizedCode: sanitized };
  }, [logSecurityEvent]);

  // Secure referral code validation
  const validateAndSanitizeReferralCode = useCallback((code: string): { isValid: boolean; sanitizedCode?: string; error?: string } => {
    const sanitized = sanitizeInput(code);
    const validation = validateReferralCode(sanitized);
    
    if (!validation.isValid) {
      logSecurityEvent('invalid_referral_code_attempt', { attempted_code: code });
      return { isValid: false, error: validation.error };
    }
    
    return { isValid: true, sanitizedCode: sanitized };
  }, [logSecurityEvent]);

  // Rate limiting for game operations
  const checkGameRateLimit = useCallback((identifier: string): boolean => {
    if (!gameRateLimiter.isAllowed(identifier)) {
      logSecurityEvent('game_rate_limit_exceeded', { identifier });
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  }, [toast, logSecurityEvent]);

  // Rate limiting for test submissions
  const checkTestRateLimit = useCallback((identifier: string): boolean => {
    if (!testRateLimiter.isAllowed(identifier)) {
      logSecurityEvent('test_rate_limit_exceeded', { identifier });
      toast({
        title: "Too many test attempts",
        description: "Please wait before submitting another test.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  }, [toast, logSecurityEvent]);

  // Secure data sanitization for test results
  const sanitizeTestData = useCallback((data: Record<string, any>): Record<string, any> => {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value);
      } else if (typeof value === 'number') {
        // Validate numeric values are within reasonable bounds
        if (isNaN(value) || !isFinite(value)) {
          sanitized[key] = 0;
        } else {
          sanitized[key] = Math.max(0, Math.min(value, 999999)); // Cap at reasonable maximum
        }
      } else if (typeof value === 'boolean') {
        sanitized[key] = Boolean(value);
      } else {
        // For other types, convert to string and sanitize
        sanitized[key] = sanitizeInput(String(value));
      }
    }
    
    return sanitized;
  }, []);

  return {
    logSecurityEvent,
    validateAndSanitizeGameCode,
    validateAndSanitizeReferralCode,
    checkGameRateLimit,
    checkTestRateLimit,
    sanitizeTestData
  };
};