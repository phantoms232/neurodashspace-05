-- Create games table for Reaction Duel multiplayer
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT UNIQUE NOT NULL,
  player1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  player2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  player1_ready BOOLEAN DEFAULT false,
  player2_ready BOOLEAN DEFAULT false,  
  player1_reaction_time INTEGER,
  player2_reaction_time INTEGER,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'ready', 'started', 'finished')),
  start_timestamp TIMESTAMP WITH TIME ZONE,
  winner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- RLS Policies for games table
CREATE POLICY "Players can view their own games" 
ON public.games 
FOR SELECT 
USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE POLICY "Players can create games" 
ON public.games 
FOR INSERT 
WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "Players can update their own game data" 
ON public.games 
FOR UPDATE 
USING (auth.uid() = player1_id OR auth.uid() = player2_id)
WITH CHECK (
  -- Player 1 can only update their own fields
  CASE WHEN auth.uid() = player1_id THEN 
    (OLD.player2_id IS NULL OR NEW.player2_id = OLD.player2_id) AND 
    (OLD.player2_ready IS NULL OR NEW.player2_ready = OLD.player2_ready) AND
    (OLD.player2_reaction_time IS NULL OR NEW.player2_reaction_time = OLD.player2_reaction_time)
  -- Player 2 can only update their own fields  
  WHEN auth.uid() = player2_id THEN
    (NEW.player1_id = OLD.player1_id) AND
    (OLD.player1_ready IS NULL OR NEW.player1_ready = OLD.player1_ready) AND  
    (OLD.player1_reaction_time IS NULL OR NEW.player1_reaction_time = OLD.player1_reaction_time)
  ELSE false END
);

CREATE POLICY "Anyone can view waiting games by room code" 
ON public.games 
FOR SELECT 
USING (status = 'waiting' AND room_code IS NOT NULL);

-- Add average_reaction_time to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS average_reaction_time INTEGER;

-- Function to generate unique room codes
CREATE OR REPLACE FUNCTION public.generate_room_code()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update average reaction time after games
CREATE OR REPLACE FUNCTION public.update_average_reaction_time()
RETURNS TRIGGER AS $$
BEGIN
  -- Update player1's average if they have a reaction time
  IF NEW.player1_reaction_time IS NOT NULL THEN
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
  IF NEW.player2_reaction_time IS NOT NULL THEN
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update averages when game finishes
CREATE TRIGGER update_averages_after_game
  AFTER UPDATE ON public.games
  FOR EACH ROW
  WHEN (NEW.status = 'finished')
  EXECUTE FUNCTION public.update_average_reaction_time();

-- Add updated_at trigger
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for games table
ALTER TABLE public.games REPLICA IDENTITY FULL;
SELECT supabase_realtime.check_realtime_connection();
INSERT INTO supabase_realtime.tenants (external_id, name, jwt_secret, max_concurrent_users, max_events_per_second)
VALUES ('default', 'default', 'your-secret', 100, 100)
ON CONFLICT (external_id) DO NOTHING;