import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users } from 'lucide-react';
import { useReactionDuel } from '@/hooks/useReactionDuel';
import { useAuth } from '@/hooks/useAuth';
import { SEOHead } from '@/components/SEOHead';

const JoinGame = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { joinGame, loading } = useReactionDuel();
  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Pre-fill room code from URL params
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setRoomCode(codeFromUrl.toUpperCase());
    }
  }, [user, searchParams, navigate]);

  const handleJoinGame = async () => {
    if (!roomCode.trim()) return;

    const game = await joinGame(roomCode.trim());
    if (game) {
      navigate(`/game/${game.room_code}`);
    }
  };

  const handleRoomCodeChange = (value: string) => {
    // Only allow alphanumeric characters and limit to 6 characters
    const cleaned = value.replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setRoomCode(cleaned);
  };

  return (
    <>
      <SEOHead
        title="Join Multiplayer Game - Reaction Duel | NeuroDash"
        description="Join a multiplayer reaction time challenge with friends. Enter a room code to start competing in real-time brain training duels."
        canonical="https://neurodash.space/join"
        keywords="join brain game, multiplayer reaction test, compete online, brain training duel, join game room"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Reaction Duel - Join Game",
          "description": "Join multiplayer reaction time challenges and compete with friends",
          "url": "https://neurodash.space/join",
          "applicationCategory": "GameApplication",
          "operatingSystem": "Web Browser"
        }}
      />
      <div className="min-h-screen neural-grid bg-black p-4">
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">
            Join Reaction Duel
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter the room code to join a game
          </p>
        </div>

        <Card className="card-neural">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Join Game
            </CardTitle>
            <CardDescription>
              Enter the 6-character room code from your opponent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  value={roomCode}
                  onChange={(e) => handleRoomCodeChange(e.target.value.toUpperCase())}
                  placeholder="Enter room code (e.g. ABC123)"
                  className="text-center text-2xl font-mono tracking-wider h-16"
                  maxLength={6}
                  autoFocus
                />
              </div>
              
              <Button
                onClick={handleJoinGame}
                disabled={roomCode.length !== 6 || loading}
                className="w-full"
                variant="neural"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Joining Game...
                  </div>
                ) : (
                  'Join Game'
                )}
              </Button>
            </div>

            {roomCode.length > 0 && roomCode.length < 6 && (
              <p className="text-center text-sm text-muted-foreground">
                Room code must be 6 characters long
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="card-neural">
          <CardHeader>
            <CardTitle>How to Play</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Both players will see "Wait for green..."</p>
            <p>• After a random delay (2-5 seconds), the screen turns green</p>
            <p>• Click as quickly as possible when it turns green</p>
            <p>• Fastest reaction time wins!</p>
            <p>• Don't click early - that's a false start</p>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Don't have a room code?</p>
          <Button
            onClick={() => navigate('/create')}
            variant="outline"
          >
            Create New Game
          </Button>
        </div>
      </div>
      </div>
    </>
  );
};

export default JoinGame;