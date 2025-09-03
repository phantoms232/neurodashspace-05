-- Add RLS policy to allow users to view games with codes that are waiting for players
CREATE POLICY "Users can view waiting games with codes" 
ON public.multiplayer_games 
FOR SELECT 
USING (game_code IS NOT NULL AND state = 'waiting');