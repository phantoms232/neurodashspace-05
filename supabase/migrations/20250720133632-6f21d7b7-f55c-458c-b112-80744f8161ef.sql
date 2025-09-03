-- Create multiplayer game states enum
CREATE TYPE public.game_state AS ENUM ('waiting', 'starting', 'active', 'finished');

-- Create multiplayer games table
CREATE TABLE public.multiplayer_games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_type TEXT NOT NULL DEFAULT 'reaction_time',
  state game_state NOT NULL DEFAULT 'waiting',
  player1_id UUID NOT NULL,
  player2_id UUID,
  winner_id UUID,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  game_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create multiplayer results table
CREATE TABLE public.multiplayer_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.multiplayer_games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_time INTEGER,
  score INTEGER,
  finished_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create multiplayer stats table
CREATE TABLE public.multiplayer_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_games INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  best_reaction_time INTEGER,
  total_reaction_time BIGINT DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.multiplayer_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multiplayer_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multiplayer_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for multiplayer_games
CREATE POLICY "Users can view games they're part of" 
ON public.multiplayer_games 
FOR SELECT 
USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE POLICY "Users can create games" 
ON public.multiplayer_games 
FOR INSERT 
WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "Players can update their games" 
ON public.multiplayer_games 
FOR UPDATE 
USING (auth.uid() = player1_id OR auth.uid() = player2_id);

-- RLS Policies for multiplayer_results
CREATE POLICY "Users can view results from their games" 
ON public.multiplayer_results 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.multiplayer_games 
    WHERE id = game_id AND (player1_id = auth.uid() OR player2_id = auth.uid())
  )
);

CREATE POLICY "Users can insert their own results" 
ON public.multiplayer_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for multiplayer_stats
CREATE POLICY "Users can view all stats" 
ON public.multiplayer_stats 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own stats" 
ON public.multiplayer_stats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
ON public.multiplayer_stats 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_multiplayer_games_updated_at
BEFORE UPDATE ON public.multiplayer_games
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_multiplayer_stats_updated_at
BEFORE UPDATE ON public.multiplayer_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update multiplayer stats
CREATE OR REPLACE FUNCTION public.update_multiplayer_stats_after_game()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  player1_result RECORD;
  player2_result RECORD;
  winner_uid UUID;
  loser_uid UUID;
BEGIN
  -- Only process when game is finished
  IF NEW.state != 'finished' OR NEW.winner_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get results for both players
  SELECT * INTO player1_result FROM public.multiplayer_results 
  WHERE game_id = NEW.id AND user_id = NEW.player1_id;
  
  SELECT * INTO player2_result FROM public.multiplayer_results 
  WHERE game_id = NEW.id AND user_id = NEW.player2_id;
  
  winner_uid := NEW.winner_id;
  loser_uid := CASE WHEN winner_uid = NEW.player1_id THEN NEW.player2_id ELSE NEW.player1_id END;
  
  -- Update winner stats
  INSERT INTO public.multiplayer_stats (user_id, total_games, wins, best_reaction_time, total_reaction_time, current_streak, best_streak)
  VALUES (
    winner_uid, 
    1, 
    1, 
    CASE WHEN winner_uid = NEW.player1_id THEN player1_result.reaction_time ELSE player2_result.reaction_time END,
    CASE WHEN winner_uid = NEW.player1_id THEN player1_result.reaction_time ELSE player2_result.reaction_time END,
    1,
    1
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_games = multiplayer_stats.total_games + 1,
    wins = multiplayer_stats.wins + 1,
    best_reaction_time = LEAST(
      COALESCE(multiplayer_stats.best_reaction_time, 9999),
      CASE WHEN winner_uid = NEW.player1_id THEN player1_result.reaction_time ELSE player2_result.reaction_time END
    ),
    total_reaction_time = multiplayer_stats.total_reaction_time + CASE WHEN winner_uid = NEW.player1_id THEN player1_result.reaction_time ELSE player2_result.reaction_time END,
    current_streak = multiplayer_stats.current_streak + 1,
    best_streak = GREATEST(multiplayer_stats.best_streak, multiplayer_stats.current_streak + 1),
    updated_at = now();
  
  -- Update loser stats
  INSERT INTO public.multiplayer_stats (user_id, total_games, losses, best_reaction_time, total_reaction_time, current_streak)
  VALUES (
    loser_uid, 
    1, 
    1, 
    CASE WHEN loser_uid = NEW.player1_id THEN player1_result.reaction_time ELSE player2_result.reaction_time END,
    CASE WHEN loser_uid = NEW.player1_id THEN player1_result.reaction_time ELSE player2_result.reaction_time END,
    0
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_games = multiplayer_stats.total_games + 1,
    losses = multiplayer_stats.losses + 1,
    best_reaction_time = LEAST(
      COALESCE(multiplayer_stats.best_reaction_time, 9999),
      CASE WHEN loser_uid = NEW.player1_id THEN player1_result.reaction_time ELSE player2_result.reaction_time END
    ),
    total_reaction_time = multiplayer_stats.total_reaction_time + CASE WHEN loser_uid = NEW.player1_id THEN player1_result.reaction_time ELSE player2_result.reaction_time END,
    current_streak = 0,
    updated_at = now();
  
  RETURN NEW;
END;
$function$;

-- Trigger for multiplayer stats
CREATE TRIGGER update_multiplayer_stats_after_game_trigger
AFTER UPDATE ON public.multiplayer_games
FOR EACH ROW
EXECUTE FUNCTION public.update_multiplayer_stats_after_game();

-- Enable realtime
ALTER TABLE public.multiplayer_games REPLICA IDENTITY FULL;
ALTER TABLE public.multiplayer_results REPLICA IDENTITY FULL;
ALTER TABLE public.multiplayer_stats REPLICA IDENTITY FULL;