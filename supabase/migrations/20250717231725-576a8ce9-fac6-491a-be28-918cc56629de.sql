-- Fix function search path security issues

-- Update update_user_stats_after_test function to set search_path
CREATE OR REPLACE FUNCTION public.update_user_stats_after_test()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  current_stats RECORD;
  streak_days INTEGER;
BEGIN
  -- Get current stats or create new record
  SELECT * INTO current_stats 
  FROM public.user_stats 
  WHERE user_id = NEW.user_id;
  
  IF current_stats IS NULL THEN
    -- Create new stats record
    INSERT INTO public.user_stats (
      user_id, 
      total_tests, 
      current_streak, 
      best_reaction_time,
      brain_age,
      last_test_date
    ) VALUES (
      NEW.user_id,
      1,
      1,
      COALESCE(NEW.reaction_time, 999),
      CASE 
        WHEN NEW.reaction_time IS NOT NULL THEN 
          GREATEST(18, LEAST(80, 30 + (NEW.reaction_time - 200) / 10))
        ELSE 25
      END,
      CURRENT_DATE
    );
  ELSE
    -- Calculate streak
    IF current_stats.last_test_date = CURRENT_DATE THEN
      streak_days := current_stats.current_streak;
    ELSIF current_stats.last_test_date = CURRENT_DATE - INTERVAL '1 day' THEN
      streak_days := current_stats.current_streak + 1;
    ELSE
      streak_days := 1;
    END IF;
    
    -- Update existing stats
    UPDATE public.user_stats SET
      total_tests = current_stats.total_tests + 1,
      current_streak = streak_days,
      best_reaction_time = CASE 
        WHEN NEW.reaction_time IS NOT NULL AND NEW.reaction_time < COALESCE(current_stats.best_reaction_time, 999)
        THEN NEW.reaction_time
        ELSE current_stats.best_reaction_time
      END,
      brain_age = CASE 
        WHEN NEW.reaction_time IS NOT NULL THEN 
          GREATEST(18, LEAST(80, 25 + (NEW.reaction_time - 180) / 8))
        ELSE current_stats.brain_age
      END,
      last_test_date = CURRENT_DATE,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update update_updated_at_column function to set search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update handle_new_user function to set search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'username'
  );
  RETURN NEW;
END;
$function$;