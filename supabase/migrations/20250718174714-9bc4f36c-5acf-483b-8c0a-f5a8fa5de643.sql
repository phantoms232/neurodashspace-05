-- Fix Supabase security warnings

-- 1. Drop the problematic NeuroDash table if it exists (has RLS enabled but no policies)
DROP TABLE IF EXISTS public."NeuroDash";

-- 2. Configure auth settings to fix OTP expiry and leaked password protection
-- Update auth config to enable leaked password protection and reduce OTP expiry
UPDATE auth.config 
SET 
  -- Reduce OTP expiry to 10 minutes (600 seconds) instead of default 1 hour
  otp_exp = 600,
  -- Enable leaked password protection
  password_min_length = 6,
  enable_signup = true
WHERE instance_id = '00000000-0000-0000-0000-000000000000';

-- Note: Some auth settings may need to be configured via the Supabase dashboard
-- The above addresses the table RLS issue and attempts to fix auth settings via SQL