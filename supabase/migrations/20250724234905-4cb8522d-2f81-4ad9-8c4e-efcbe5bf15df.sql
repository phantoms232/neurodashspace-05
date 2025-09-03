-- Create security_logs table for tracking security events
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security_logs table
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to restrict access to security logs (only service role)
CREATE POLICY "Only service role can access security logs" 
ON public.security_logs 
FOR ALL 
USING (false);

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  details JSONB DEFAULT '{}',
  target_user_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.security_logs (user_id, event_type, details)
  VALUES (COALESCE(target_user_id, auth.uid()), event_type, details);
END;
$$;