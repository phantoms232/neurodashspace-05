-- Fix security issue with subscribers table RLS policies
-- The current "Service role can manage subscriptions" policy has "Using Expression: true" 
-- which is too permissive and could allow unauthorized access

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscribers;

-- Create a properly restricted policy for service role operations
CREATE POLICY "Service role can manage all subscriptions" ON public.subscribers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Also add a policy specifically for edge functions that need to upsert subscription data
-- This allows edge functions to insert subscription records when they don't exist
CREATE POLICY "Service role can insert subscription records" ON public.subscribers
FOR INSERT
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Ensure the existing user policies remain secure
-- Verify the SELECT policy is properly restrictive (users can only see their own data)
DROP POLICY IF EXISTS "Users can view their own subscription by user_id" ON public.subscribers;
CREATE POLICY "Users can view their own subscription by user_id" ON public.subscribers
FOR SELECT
TO authenticated
USING (user_id = auth.uid() AND user_id IS NOT NULL);

-- Add additional security: prevent users from accessing records with null user_id
-- This ensures no orphaned records can be accessed
CREATE POLICY "Prevent access to orphaned subscription records" ON public.subscribers
FOR SELECT
TO authenticated
USING (user_id IS NOT NULL AND user_id = auth.uid());