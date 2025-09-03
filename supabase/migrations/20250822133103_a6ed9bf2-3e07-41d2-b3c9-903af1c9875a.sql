-- Fix overly permissive insert policy on subscribers table
-- Only allow authenticated users to create their own subscription records

DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

CREATE POLICY "Users can insert their own subscription records" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);