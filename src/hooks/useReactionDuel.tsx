import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type GameStatus = 'waiting' | 'ready' | 'started' | 'finished';

interface Game {
  id: string;
  room_code: string;
  player1_id: string;
  player2_id?: string;
  player1_ready: boolean;
  player2_ready: boolean;
  player1_reaction_time?: number;
  player2_reaction_time?: number;
  status: GameStatus;
  start_timestamp?: string;
  winner_id?: string;
  created_at: string;
  updated_at: string;
}

interface PlayerProfile {
  user_id: string;
  username?: string;
  full_name?: string;
  average_reaction_time?: number;
}

export const useReactionDuel = () => {
  const { user } = useAuth();
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [opponent, setOpponent] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<PlayerProfile[]>([]);

  // Load leaderboard
  useEffect(() => {
    loadLeaderboard();
  }, []);

  // Set up realtime subscription for current game
  useEffect(() => {
    if (!currentGame?.id) return;

    const channel = supabase
      .channel(`game-${currentGame.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${currentGame.id}`,
        },
        (payload) => {
          console.log('Game updated:', payload);
          if (payload.new) {
            const updatedGame = payload.new as any;
            setCurrentGame({
              ...updatedGame,
              status: updatedGame.status as GameStatus
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentGame?.id]);

  // Load opponent profile when game updates
  useEffect(() => {
    if (currentGame && user) {
      const opponentId = currentGame.player1_id === user.id 
        ? currentGame.player2_id 
        : currentGame.player1_id;
      
      if (opponentId) {
        loadOpponentProfile(opponentId);
      }
    }
  }, [currentGame, user]);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, username, full_name, average_reaction_time')
        .not('average_reaction_time', 'is', null)
        .order('average_reaction_time', { ascending: true })
        .limit(5);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const loadOpponentProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, username, full_name, average_reaction_time')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setOpponent(data);
    } catch (error) {
      console.error('Error loading opponent profile:', error);
    }
  };

  const createGame = async () => {
    if (!user) {
      toast.error('Please sign in to create a game');
      return null;
    }

    setLoading(true);
    try {
      // Generate room code
      const { data: roomCode, error: codeError } = await supabase
        .rpc('generate_room_code');

      if (codeError) throw codeError;

      // Create game
      const { data, error } = await supabase
        .from('games')
        .insert({
          room_code: roomCode,
          player1_id: user.id,
          status: 'waiting'
        })
        .select()
        .single();

      if (error) throw error;

      const gameData = { ...data, status: data.status as GameStatus };
      setCurrentGame(gameData);
      toast.success('Game created! Share the room code with your opponent.');
      return gameData;
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error('Failed to create game');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinGame = async (roomCode: string) => {
    if (!user) {
      toast.error('Please sign in to join a game');
      return null;
    }

    setLoading(true);
    try {
      // Find game by room code
      const { data: games, error: findError } = await supabase
        .from('games')
        .select('*')
        .eq('room_code', roomCode.toUpperCase())
        .eq('status', 'waiting');

      if (findError) throw findError;
      if (!games || games.length === 0) {
        toast.error('Game not found or already started');
        return null;
      }

      const game = games[0];
      if (game.player1_id === user.id) {
        toast.error('You cannot join your own game');
        return null;
      }

      // Join game
      const { data, error } = await supabase
        .from('games')
        .update({ 
          player2_id: user.id,
          status: 'ready'
        })
        .eq('id', game.id)
        .select()
        .single();

      if (error) throw error;

      const gameData = { ...data, status: data.status as GameStatus };
      setCurrentGame(gameData);
      toast.success('Joined game successfully!');
      return gameData;
    } catch (error) {
      console.error('Error joining game:', error);
      toast.error('Failed to join game');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const setReady = async () => {
    if (!currentGame || !user) return;

    try {
      const isPlayer1 = currentGame.player1_id === user.id;
      const updateField = isPlayer1 ? 'player1_ready' : 'player2_ready';

      const { error } = await supabase
        .from('games')
        .update({ [updateField]: true })
        .eq('id', currentGame.id);

      if (error) throw error;

      // Check if both players are ready
      const otherPlayerReady = isPlayer1 ? currentGame.player2_ready : currentGame.player1_ready;
      if (otherPlayerReady) {
        // Start game countdown
        setTimeout(() => startGame(), 2000 + Math.random() * 3000); // 2-5 second delay
      }
    } catch (error) {
      console.error('Error setting ready:', error);
      toast.error('Failed to set ready status');
    }
  };

  const startGame = async () => {
    if (!currentGame) return;

    try {
      const startTime = Date.now();
      setGameStartTime(startTime);

      const { error } = await supabase
        .from('games')
        .update({ 
          status: 'started',
          start_timestamp: new Date().toISOString()
        })
        .eq('id', currentGame.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const recordReactionTime = async (reactionTime: number) => {
    if (!currentGame || !user) return;

    try {
      const isPlayer1 = currentGame.player1_id === user.id;
      const updateField = isPlayer1 ? 'player1_reaction_time' : 'player2_reaction_time';

      const { data, error } = await supabase
        .from('games')
        .update({ [updateField]: reactionTime })
        .eq('id', currentGame.id)
        .select()
        .single();

      if (error) throw error;

      // Check if both players have recorded times
      const updatedGame = data as Game;
      if (updatedGame.player1_reaction_time && updatedGame.player2_reaction_time) {
        // Determine winner and finish game
        const winnerId = updatedGame.player1_reaction_time < updatedGame.player2_reaction_time
          ? updatedGame.player1_id
          : updatedGame.player2_id;

        await supabase
          .from('games')
          .update({ 
            status: 'finished',
            winner_id: winnerId
          })
          .eq('id', currentGame.id);
      }
    } catch (error) {
      console.error('Error recording reaction time:', error);
      toast.error('Failed to record reaction time');
    }
  };

  const leaveGame = () => {
    setCurrentGame(null);
    setOpponent(null);
    setGameStartTime(null);
  };

  const rematch = async () => {
    if (!currentGame || !user) return;

    try {
      const { error } = await supabase
        .from('games')
        .update({
          player1_ready: false,
          player2_ready: false,
          player1_reaction_time: null,
          player2_reaction_time: null,
          status: 'ready',
          start_timestamp: null,
          winner_id: null
        })
        .eq('id', currentGame.id);

      if (error) throw error;
      
      setGameStartTime(null);
      toast.success('Rematch initiated!');
    } catch (error) {
      console.error('Error starting rematch:', error);
      toast.error('Failed to start rematch');
    }
  };

  return {
    currentGame,
    opponent,
    loading,
    gameStartTime,
    leaderboard,
    createGame,
    joinGame,
    setReady,
    recordReactionTime,
    leaveGame,
    rematch,
    loadLeaderboard
  };
};