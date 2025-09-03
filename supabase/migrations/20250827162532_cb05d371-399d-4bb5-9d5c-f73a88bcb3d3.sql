-- Enable realtime for multiplayer tables
ALTER TABLE public.multiplayer_games REPLICA IDENTITY FULL;
ALTER TABLE public.multiplayer_results REPLICA IDENTITY FULL;
ALTER TABLE public.multiplayer_stats REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.multiplayer_games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.multiplayer_results;
ALTER PUBLICATION supabase_realtime ADD TABLE public.multiplayer_stats;