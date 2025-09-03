-- First, drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all stats" ON public.multiplayer_stats;

-- Create a more restrictive policy - users can only view their own stats
CREATE POLICY "Users can view their own stats" 
ON public.multiplayer_stats 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a secure function for leaderboard data that only exposes necessary information
CREATE OR REPLACE FUNCTION public.get_multiplayer_leaderboard()
RETURNS TABLE (
  user_id UUID,
  total_games INTEGER,
  wins INTEGER,
  losses INTEGER,
  best_reaction_time INTEGER,
  current_streak INTEGER,
  best_streak INTEGER,
  win_rate NUMERIC,
  avg_reaction_time NUMERIC,
  username TEXT,
  full_name TEXT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ms.user_id,
    ms.total_games,
    ms.wins,
    ms.losses,
    ms.best_reaction_time,
    ms.current_streak,
    ms.best_streak,
    CASE 
      WHEN ms.total_games > 0 THEN ROUND((ms.wins::NUMERIC / ms.total_games::NUMERIC) * 100, 1)
      ELSE 0
    END as win_rate,
    CASE 
      WHEN ms.total_games > 0 THEN ROUND(ms.total_reaction_time::NUMERIC / ms.total_games::NUMERIC, 0)
      ELSE 0
    END as avg_reaction_time,
    p.username,
    p.full_name
  FROM multiplayer_stats ms
  LEFT JOIN profiles p ON ms.user_id = p.user_id
  WHERE ms.total_games >= 1
  ORDER BY ms.wins DESC, 
           CASE 
             WHEN ms.total_games > 0 THEN (ms.wins::NUMERIC / ms.total_games::NUMERIC)
             ELSE 0
           END DESC
  LIMIT 50;
$$;