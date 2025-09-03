-- Create a webhook handler function for Stripe events
CREATE OR REPLACE FUNCTION public.handle_stripe_webhook(
  event_type TEXT,
  customer_id TEXT,
  subscription_data JSONB DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  customer_email TEXT;
  subscription_status TEXT;
  subscription_end_timestamp BIGINT;
  subscription_tier TEXT;
BEGIN
  -- Only process subscription events
  IF event_type NOT LIKE 'customer.subscription.%' THEN
    RETURN;
  END IF;

  -- Get customer email from Stripe customer ID
  SELECT email INTO customer_email 
  FROM subscribers 
  WHERE stripe_customer_id = customer_id;
  
  IF customer_email IS NULL THEN
    -- Log that we couldn't find the customer
    INSERT INTO security_logs (event_type, details) 
    VALUES ('stripe_webhook_unknown_customer', jsonb_build_object('customer_id', customer_id));
    RETURN;
  END IF;

  -- Extract subscription details
  subscription_status := subscription_data->>'status';
  subscription_end_timestamp := (subscription_data->>'current_period_end')::BIGINT;
  
  -- Determine subscription tier based on amount
  IF (subscription_data->'items'->'data'->0->'price'->>'unit_amount')::INTEGER <= 999 THEN
    subscription_tier := 'Basic';
  ELSIF (subscription_data->'items'->'data'->0->'price'->>'unit_amount')::INTEGER <= 1999 THEN
    subscription_tier := 'Premium';
  ELSE
    subscription_tier := 'Enterprise';
  END IF;

  -- Update subscriber status
  UPDATE subscribers 
  SET 
    subscribed = (subscription_status = 'active'),
    subscription_tier = CASE WHEN subscription_status = 'active' THEN subscription_tier ELSE NULL END,
    subscription_end = CASE WHEN subscription_status = 'active' THEN to_timestamp(subscription_end_timestamp) ELSE NULL END,
    updated_at = now()
  WHERE email = customer_email;

  -- Log the webhook processing
  INSERT INTO security_logs (event_type, details) 
  VALUES ('stripe_webhook_processed', jsonb_build_object(
    'customer_id', customer_id,
    'email', customer_email,
    'event_type', event_type,
    'subscription_status', subscription_status
  ));
END;
$$;