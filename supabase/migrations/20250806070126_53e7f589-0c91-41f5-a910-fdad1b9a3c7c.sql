-- Fix critical profile data exposure by restricting the overly permissive RLS policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a more secure policy that only allows users to view their own profiles
-- and profiles of players they're currently in multiplayer games with
CREATE POLICY "Users can view own profile and multiplayer opponents" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.multiplayer_games 
    WHERE (player1_id = auth.uid() AND player2_id = profiles.user_id) 
       OR (player2_id = auth.uid() AND player1_id = profiles.user_id)
  )
);

-- Add comprehensive input validation function for edge functions
CREATE OR REPLACE FUNCTION public.validate_email_format(email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND LENGTH(email) <= 254;
END;
$$;

-- Add function to validate string length and content
CREATE OR REPLACE FUNCTION public.validate_string_input(input_text text, max_length integer DEFAULT 255, allow_empty boolean DEFAULT false)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF input_text IS NULL THEN
    RETURN allow_empty;
  END IF;
  
  RETURN LENGTH(input_text) <= max_length AND LENGTH(TRIM(input_text)) > 0;
END;
$$;

-- Add rate limiting for edge functions
CREATE TABLE IF NOT EXISTS public.edge_function_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- IP address or user ID
  function_name text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, function_name)
);

-- Enable RLS on rate limits table
ALTER TABLE public.edge_function_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can manage rate limits
CREATE POLICY "Service role can manage rate limits" 
ON public.edge_function_rate_limits 
FOR ALL 
USING (auth.role() = 'service_role');

-- Function to check edge function rate limits
CREATE OR REPLACE FUNCTION public.check_edge_function_rate_limit(
  identifier_param text,
  function_name_param text,
  max_requests integer DEFAULT 60,
  window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  current_count integer;
  window_start_time timestamp with time zone;
BEGIN
  window_start_time := now() - (window_minutes || ' minutes')::interval;
  
  -- Clean up old records
  DELETE FROM public.edge_function_rate_limits 
  WHERE window_start < window_start_time;
  
  -- Get current count for this identifier and function
  SELECT request_count INTO current_count
  FROM public.edge_function_rate_limits
  WHERE identifier = identifier_param 
    AND function_name = function_name_param
    AND window_start >= window_start_time;
  
  IF current_count IS NULL THEN
    -- First request in this window
    INSERT INTO public.edge_function_rate_limits (identifier, function_name, request_count)
    VALUES (identifier_param, function_name_param, 1)
    ON CONFLICT (identifier, function_name) 
    DO UPDATE SET request_count = 1, window_start = now();
    RETURN true;
  ELSIF current_count < max_requests THEN
    -- Increment counter
    UPDATE public.edge_function_rate_limits
    SET request_count = request_count + 1
    WHERE identifier = identifier_param AND function_name = function_name_param;
    RETURN true;
  ELSE
    -- Rate limit exceeded
    RETURN false;
  END IF;
END;
$$;