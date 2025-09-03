-- Fix security warnings: Update function to have secure search_path

-- Update the log_subscription_access function to have secure search_path
CREATE OR REPLACE FUNCTION public.log_subscription_access()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log access attempts to security_logs
  INSERT INTO public.security_logs (user_id, event_type, details)
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
$$;