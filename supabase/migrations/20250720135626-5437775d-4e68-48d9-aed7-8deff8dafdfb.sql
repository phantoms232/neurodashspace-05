-- Add game_code column to multiplayer_games table for friend matches
ALTER TABLE public.multiplayer_games 
ADD COLUMN game_code TEXT UNIQUE;

-- Add index for faster lookups by game code
CREATE INDEX idx_multiplayer_games_game_code ON public.multiplayer_games(game_code);

-- Create function to generate unique 6-character game codes
CREATE OR REPLACE FUNCTION generate_game_code()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;