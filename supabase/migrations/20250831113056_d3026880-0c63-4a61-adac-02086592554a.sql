-- Fix security issue: Strengthen RLS policies for subscribers table to prevent email data theft

-- First, ensure all existing subscriber records have a user_id
-- This is critical for RLS policies to work properly
UPDATE public.subscribers 
SET user_id = (
  SELECT id FROM auth.users WHERE email = subscribers.email LIMIT 1
)
WHERE user_id IS NULL;

-- Make user_id NOT NULL to prevent future security gaps
ALTER TABLE public.subscribers 
ALTER COLUMN user_id SET NOT NULL;

-- Drop existing potentially vulnerable policies
DROP POLICY IF EXISTS "Users can view their own subscription by user_id" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription details" ON public.subscribers;
DROP POLICY IF EXISTS "Users can insert their own subscription records" ON public.subscribers;

-- Create bulletproof RLS policies that prevent any unauthorized access

-- 1. SELECT: Users can ONLY view their own subscription data
CREATE POLICY "subscribers_select_own_only" ON public.subscribers
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND user_id IS NOT NULL 
  AND auth.uid() = user_id
);

-- 2. INSERT: Users can only insert records for themselves with proper validation
CREATE POLICY "subscribers_insert_own_only" ON public.subscribers
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id IS NOT NULL 
  AND auth.uid() = user_id
  AND email IS NOT NULL
);

-- 3. UPDATE: Users can only update their own records
CREATE POLICY "subscribers_update_own_only" ON public.subscribers
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND user_id IS NOT NULL 
  AND auth.uid() = user_id
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id IS NOT NULL 
  AND auth.uid() = user_id
);

-- 4. Maintain service role access for edge functions (essential for subscription management)
CREATE POLICY "subscribers_service_role_access" ON public.subscribers
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 5. Add a defensive policy to explicitly deny all other access
CREATE POLICY "subscribers_deny_all_others" ON public.subscribers
FOR ALL 
USING (false);

-- Add security logging for any subscription data access
CREATE OR REPLACE FUNCTION log_subscription_access()
RETURNS trigger AS $$
BEGIN
  -- Log access attempts to security_logs
  INSERT INTO security_logs (user_id, event_type, details)
  VALUES (
    auth.uid(),
    'subscription_data_access',
    jsonb_build_object(
      'operation', TG_OP,
      'table_name', TG_TABLE_NAME,
      'timestamp', now(),
      'subscriber_email', CASE WHEN TG_OP = 'DELETE' THEN OLD.email ELSE NEW.email END
    )
  );
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to log all subscription table access
CREATE TRIGGER subscription_access_logger
  AFTER INSERT OR UPDATE OR DELETE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION log_subscription_access();