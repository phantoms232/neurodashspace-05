import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, UserPlus, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReactionDuel } from '@/hooks/useReactionDuel';
import { useAuth } from '@/hooks/useAuth';

export const MultiplayerSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { leaderboard } = useReactionDuel();

  const handleCreateGame = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/create');
  };

  const handleJoinGame = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/join');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient">
          Reaction Duel
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Challenge friends to real-time reaction speed battles
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Multiplayer Actions */}
        <Card className="card-neural">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Multiplayer Challenge
            </CardTitle>
            <CardDescription>
              Test your reflexes against real opponents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleCreateGame}
              className="w-full"
              variant="neural"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start New Game
            </Button>
            
            <Button
              onClick={handleJoinGame}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Join Game
            </Button>

            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Create a room or join with a 6-character code
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="card-neural">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5" />
              Top Players
            </CardTitle>
            <CardDescription>
              Fastest average reaction times
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div
                    key={player.user_id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-amber-600 text-black' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium">
                        {player.username || player.full_name || 'Anonymous'}
                      </span>
                    </div>
                    <span className="text-sm font-mono text-primary">
                      {player.average_reaction_time}ms
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No leaderboard data yet</p>
                <p className="text-sm">Be the first to play!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="card-neural">
        <CardHeader>
          <CardTitle>How to Play Reaction Duel</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">1</span>
              <p>Create a new game or join with a room code</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">2</span>
              <p>Wait for your opponent to join the room</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">3</span>
              <p>Both players click "Ready" to start</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">4</span>
              <p>Wait for the screen to turn green (2-5 seconds)</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">5</span>
              <p>Click as fast as possible when green appears</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">6</span>
              <p>Fastest reaction time wins! Challenge again.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};