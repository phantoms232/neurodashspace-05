import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react';
import { useReactionDuel } from '@/hooks/useReactionDuel';
import { useAuth } from '@/hooks/useAuth';

type GamePhase = 'waiting' | 'ready' | 'countdown' | 'active' | 'clicked' | 'results';

const GameRoom = () => {
  const navigate = useNavigate();
  const { roomCode } = useParams<{ roomCode: string }>();
  const { user } = useAuth();
  const { 
    currentGame, 
    opponent, 
    gameStartTime,
    joinGame,
    setReady,
    recordReactionTime,
    leaveGame,
    rematch
  } = useReactionDuel();
  
  const [phase, setPhase] = useState<GamePhase>('waiting');
  const [countdownTime, setCountdownTime] = useState<number | null>(null);
  const [clickTime, setClickTime] = useState<number | null>(null);
  const [falseStart, setFalseStart] = useState(false);

  // Join game if not already in one
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!currentGame && roomCode) {
      joinGame(roomCode);
    }
  }, [user, currentGame, roomCode, joinGame, navigate]);

  // Handle game state changes
  useEffect(() => {
    if (!currentGame) return;

    if (currentGame.status === 'ready' && !gameStartTime) {
      setPhase('ready');
    } else if (currentGame.status === 'started' && gameStartTime) {
      setPhase('countdown');
      // Start countdown
      const delay = 2000 + Math.random() * 3000; // 2-5 seconds
      setTimeout(() => {
        setPhase('active');
        setCountdownTime(Date.now());
      }, delay);
    } else if (currentGame.status === 'finished') {
      setPhase('results');
    }
  }, [currentGame, gameStartTime]);

  const handleClick = () => {
    if (phase === 'countdown') {
      // False start
      setFalseStart(true);
      setPhase('clicked');
      return;
    }

    if (phase === 'active' && countdownTime) {
      const reactionTime = Date.now() - countdownTime;
      setClickTime(reactionTime);
      setPhase('clicked');
      recordReactionTime(reactionTime);
    }
  };

  const handleReady = () => {
    setReady();
  };

  const handleLeaveGame = () => {
    leaveGame();
    navigate('/');
  };

  const handleRematch = () => {
    setPhase('ready');
    setCountdownTime(null);
    setClickTime(null);
    setFalseStart(false);
    rematch();
  };

  const getPhaseContent = () => {
    switch (phase) {
      case 'waiting':
        return {
          title: 'Waiting for opponent...',
          description: 'Share the room code with your opponent',
          bgColor: 'bg-muted/10',
          textColor: 'text-muted-foreground'
        };

      case 'ready':
        const isPlayer1 = currentGame?.player1_id === user?.id;
        const myReady = isPlayer1 ? currentGame?.player1_ready : currentGame?.player2_ready;
        const opponentReady = isPlayer1 ? currentGame?.player2_ready : currentGame?.player1_ready;

        return {
          title: myReady ? 'Waiting for opponent...' : 'Get Ready!',
          description: myReady 
            ? `${opponent?.username || 'Opponent'} needs to get ready` 
            : 'Click ready when you\'re prepared to play',
          bgColor: 'bg-blue-500/20',
          textColor: 'text-blue-300',
          showButton: !myReady,
          buttonText: 'Ready!',
          onButtonClick: handleReady,
          status: `You: ${myReady ? '✓' : '○'} | ${opponent?.username || 'Opponent'}: ${opponentReady ? '✓' : '○'}`
        };

      case 'countdown':
        return {
          title: 'Wait for green...',
          description: 'Get ready to click!',
          bgColor: 'bg-red-500/30',
          textColor: 'text-red-300'
        };

      case 'active':
        return {
          title: 'CLICK NOW!',
          description: 'Click as fast as you can!',
          bgColor: 'bg-green-500/30',
          textColor: 'text-green-300'
        };

      case 'clicked':
        if (falseStart) {
          return {
            title: 'False Start!',
            description: 'You clicked too early. Wait for your opponent...',
            bgColor: 'bg-red-500/20',
            textColor: 'text-red-300'
          };
        }
        return {
          title: `${clickTime}ms`,
          description: 'Waiting for opponent to finish...',
          bgColor: 'bg-yellow-500/20',
          textColor: 'text-yellow-300'
        };

      case 'results':
        const isWinner = currentGame?.winner_id === user?.id;
        const myTime = currentGame?.player1_id === user?.id 
          ? currentGame?.player1_reaction_time 
          : currentGame?.player2_reaction_time;
        const opponentTime = currentGame?.player1_id === user?.id 
          ? currentGame?.player2_reaction_time 
          : currentGame?.player1_reaction_time;

        return {
          title: isWinner ? '🏆 You Win!' : '😔 You Lose',
          description: `Your time: ${myTime}ms | ${opponent?.username || 'Opponent'}: ${opponentTime}ms`,
          bgColor: isWinner ? 'bg-green-500/20' : 'bg-red-500/20',
          textColor: isWinner ? 'text-green-300' : 'text-red-300',
          showButtons: true
        };

      default:
        return {
          title: 'Loading...',
          description: '',
          bgColor: 'bg-muted/10',
          textColor: 'text-muted-foreground'
        };
    }
  };

  if (!currentGame) {
    return (
      <div className="min-h-screen neural-grid bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Game not found</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const content = getPhaseContent();

  return (
    <div className="min-h-screen neural-grid bg-black p-4">
      <div className="max-w-4xl mx-auto py-4 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLeaveGame}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Leave Game
          </Button>
          <div className="text-sm text-muted-foreground">
            Room: {currentGame.room_code}
          </div>
        </div>

        <div 
          className={`min-h-[60vh] flex items-center justify-center cursor-pointer transition-all duration-300 rounded-2xl ${content.bgColor}`}
          onClick={handleClick}
        >
          <Card className="w-full max-w-2xl bg-transparent border-0 shadow-none">
            <CardContent className="text-center space-y-6 p-8">
              <h1 className={`text-4xl md:text-6xl font-bold ${content.textColor}`}>
                {content.title}
              </h1>
              <p className={`text-lg md:text-xl ${content.textColor} opacity-80`}>
                {content.description}
              </p>
              
              {content.status && (
                <p className="text-sm text-muted-foreground">
                  {content.status}
                </p>
              )}

              {content.showButton && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    content.onButtonClick?.();
                  }}
                  variant="neural"
                  size="lg"
                >
                  {content.buttonText}
                </Button>
              )}

              {content.showButtons && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRematch();
                    }}
                    variant="neural"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Rematch
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLeaveGame();
                    }}
                    variant="outline"
                  >
                    Back to Home
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {opponent && (
          <div className="text-center">
            <p className="text-muted-foreground">
              Playing against: <span className="text-primary font-medium">
                {opponent.username || opponent.full_name || 'Anonymous'}
              </span>
              {opponent.average_reaction_time && (
                <span className="text-sm ml-2">
                  (Avg: {opponent.average_reaction_time}ms)
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameRoom;