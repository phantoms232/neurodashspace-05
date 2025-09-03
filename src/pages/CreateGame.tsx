import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Users, ArrowLeft } from 'lucide-react';
import { useReactionDuel } from '@/hooks/useReactionDuel';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { SEOHead } from '@/components/SEOHead';
const CreateGame = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    currentGame,
    opponent,
    loading,
    createGame
  } = useReactionDuel();
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Create game on mount if we don't have one
    if (!currentGame) {
      createGame();
    }
  }, [user, currentGame, createGame, navigate]);

  // Navigate to game when opponent joins
  useEffect(() => {
    if (currentGame && currentGame.status === 'ready') {
      navigate(`/game/${currentGame.room_code}`);
    }
  }, [currentGame, navigate]);
  const copyRoomCode = () => {
    if (currentGame?.room_code) {
      navigator.clipboard.writeText(currentGame.room_code);
      toast.success('Room code copied to clipboard!');
    }
  };
  const shareGame = () => {
    if (currentGame?.room_code) {
      const url = `${window.location.origin}/join?code=${currentGame.room_code}`;
      if (navigator.share) {
        navigator.share({
          title: 'Join my Reaction Duel!',
          text: `Join my reaction time challenge with code: ${currentGame.room_code}`,
          url: url
        });
      } else {
        navigator.clipboard.writeText(url);
        toast.success('Game link copied to clipboard!');
      }
    }
  };
  if (loading) {
    return <div className="min-h-screen neural-grid bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Creating game...</p>
        </div>
      </div>;
  }
  if (!currentGame) {
    return <div className="min-h-screen neural-grid bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Failed to create game</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>;
  }
  return <>
      <SEOHead title="Create Multiplayer Game - Reaction Duel | NeuroDash" description="Create a multiplayer reaction time challenge and compete with friends. Test who has the fastest reflexes in real-time battles." canonical="https://neurodash.space/create" keywords="multiplayer brain game, reaction time duel, compete with friends, online brain training, multiplayer cognitive test" schemaData={{
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Reaction Duel - Create Game",
      "description": "Create multiplayer reaction time challenges and compete with friends",
      "url": "https://neurodash.space/create",
      "applicationCategory": "GameApplication",
      "operatingSystem": "Web Browser"
    }} />
      <div className="min-h-screen neural-grid p-4 bg-[#222222]">
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">
            Reaction Duel
          </h1>
          <p className="text-lg text-muted-foreground">
            Waiting for an opponent to join...
          </p>
        </div>

        <Card className="card-neural">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Room Code
            </CardTitle>
            <CardDescription>
              Share this code with your opponent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 bg-muted/20 rounded-lg p-6">
                <span className="text-4xl font-mono font-bold text-gradient tracking-wider">
                  {currentGame.room_code}
                </span>
                <Button variant="outline" size="sm" onClick={copyRoomCode} className="flex-shrink-0">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={shareGame} className="flex-1" variant="neural">
                Share Game Link
              </Button>
              <Button onClick={copyRoomCode} variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Game Status: Waiting for opponent</p>
              {opponent && <p className="mt-2 text-primary">
                  {opponent.username || opponent.full_name} joined!
                </p>}
            </div>
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
      </div>
      </div>
    </>;
};
export default CreateGame;