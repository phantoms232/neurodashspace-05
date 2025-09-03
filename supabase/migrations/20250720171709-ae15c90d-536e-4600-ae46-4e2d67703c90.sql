-- Fix Function Search Path Mutable security warning
-- This sets a secure search_path for all database functions

-- Fix generate_game_code function
CREATE OR REPLACE FUNCTION public.generate_game_code()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 6-character alphanumeric code
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.multiplayer_games WHERE game_code = code) INTO exists_check;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Fix generate_referral_code function
CREATE OR REPLACE FUNCTION public.generate_referral_code(user_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || user_id::TEXT) FROM 1 FOR 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.referrals WHERE referral_code = code) INTO exists_check;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  -- Insert the referral code
  INSERT INTO public.referrals (referrer_user_id, referral_code)
  VALUES (user_id, code);
  
  RETURN code;
END;
$$;

-- Fix grant_free_trial function
CREATE OR REPLACE FUNCTION public.grant_free_trial(user_email text, referral_code_used text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $$
DECLARE
  user_record RECORD;
  referral_record RECORD;
  trial_end TIMESTAMPTZ;
BEGIN
  -- Get user by email
  SELECT id INTO user_record FROM auth.users WHERE email = user_email;
  IF user_record IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get referral record
  SELECT * INTO referral_record FROM public.referrals WHERE referral_code = referral_code_used AND used_by_user_id IS NULL;
  IF referral_record IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate trial end (1 week from now)
  trial_end := now() + INTERVAL '7 days';
  
  -- Update subscribers table with free trial
  INSERT INTO public.subscribers (
    user_id, 
    email, 
    subscribed, 
    subscription_tier, 
    subscription_end,
    free_trial_end,
    updated_at
  ) VALUES (
    user_record.id,
    user_email,
    TRUE,
    'Premium Trial',
    trial_end,
    trial_end,
    now()
  ) 
  ON CONFLICT (email) 
  DO UPDATE SET
    subscribed = TRUE,
    subscription_tier = 'Premium Trial',
    subscription_end = trial_end,
    free_trial_end = trial_end,
    updated_at = now();
  
  -- Mark referral as used
  UPDATE public.referrals 
  SET 
    used_by_user_id = user_record.id,
    free_trial_granted = TRUE,
    used_at = now()
  WHERE referral_code = referral_code_used;
  
  RETURN TRUE;
END;
$$;