-- Fix the main security issue: overly permissive service role policy
-- Replace the policy that allows any authenticated user to update subscriptions

DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscribers;

-- Create a properly restricted policy for service role only
CREATE POLICY "Service role full access" ON public.subscribers
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');