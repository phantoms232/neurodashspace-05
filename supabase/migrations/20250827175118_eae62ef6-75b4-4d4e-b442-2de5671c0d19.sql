-- Fix security warnings by setting search_path on functions
CREATE OR REPLACE FUNCTION public.generate_room_code()
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 6-character alphanumeric code
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.games WHERE room_code = code) INTO exists_check;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Fix security warnings by setting search_path on functions
CREATE OR REPLACE FUNCTION public.update_average_reaction_time()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Update player1's average if they have a reaction time
  IF NEW.player1_reaction_time IS NOT NULL AND NEW.status = 'finished' THEN
    UPDATE public.profiles 
    SET average_reaction_time = (
      SELECT AVG(CASE WHEN player1_id = NEW.player1_id THEN player1_reaction_time 
                      WHEN player2_id = NEW.player1_id THEN player2_reaction_time END)::INTEGER
      FROM public.games 
      WHERE (player1_id = NEW.player1_id OR player2_id = NEW.player1_id) 
        AND status = 'finished'
        AND ((player1_id = NEW.player1_id AND player1_reaction_time IS NOT NULL) 
             OR (player2_id = NEW.player1_id AND player2_reaction_time IS NOT NULL))
    )
    WHERE user_id = NEW.player1_id;
  END IF;

  -- Update player2's average if they have a reaction time  
  IF NEW.player2_reaction_time IS NOT NULL AND NEW.status = 'finished' THEN
    UPDATE public.profiles 
    SET average_reaction_time = (
      SELECT AVG(CASE WHEN player1_id = NEW.player2_id THEN player1_reaction_time 
                      WHEN player2_id = NEW.player2_id THEN player2_reaction_time END)::INTEGER
      FROM public.games 
      WHERE (player1_id = NEW.player2_id OR player2_id = NEW.player2_id) 
        AND status = 'finished'
        AND ((player1_id = NEW.player2_id AND player1_reaction_time IS NOT NULL) 
             OR (player2_id = NEW.player2_id AND player2_reaction_time IS NOT NULL))
    )
    WHERE user_id = NEW.player2_id;
  END IF;

  RETURN NEW;
END;
$$;