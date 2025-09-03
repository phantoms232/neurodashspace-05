-- Fix security vulnerability: Remove email-based access from subscribers table
-- This prevents potential email harvesting while maintaining proper access control

-- Drop the existing policy that allows email-based access
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;

-- Create a new secure policy that only allows user_id-based access
CREATE POLICY "Users can view their own subscription by user_id" 
ON public.subscribers 
FOR SELECT 
USING (user_id = auth.uid());

-- Add security logging for this policy change
INSERT INTO public.security_logs (event_type, details) 
VALUES ('rls_policy_security_fix', jsonb_build_object(
  'table', 'subscribers',
  'action', 'removed_email_based_access',
  'reason', 'prevent_email_harvesting'
));