import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
interface ResultPhaseProps {
  isCorrect: boolean;
  level: number;
  lives: number;
  clickedSquares: number[];
  activeSquares: number[];
  onNextLevel: () => void;
  onRestart: () => void;
}
export const ResultPhase = ({
  isCorrect,
  level,
  lives,
  clickedSquares,
  activeSquares,
  onNextLevel,
  onRestart
}: ResultPhaseProps) => {
  return <Card className={`text-center space-y-4 p-8 ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
      <div className="text-sm text-muted-foreground">Level {level} • {"❤️".repeat(lives)}{"🤍".repeat(3 - lives)}</div>
      <h3 className={`text-2xl font-bold ${isCorrect ? 'text-success' : 'text-destructive'}`}>
        {isCorrect ? "Perfect! 🎉" : "Not quite 😔"}
      </h3>
      
      <div className="text-lg">
        <span className="text-muted-foreground">
          You found {clickedSquares.filter(id => activeSquares.includes(id)).length} out of {activeSquares.length} squares
        </span>
      </div>

      {isCorrect ? <div className="space-y-2">
          <p className="text-success">Excellent! Moving to level {level + 1}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="neural" onClick={onNextLevel}>
              Next Level
            </Button>
            <Button variant="brain" onClick={onRestart}>
              <RotateCcw className="w-5 h-5" />
              Restart
            </Button>
          </div>
        </div> : <div className="space-y-2">
          <p className="text-muted-foreground">
            {lives <= 0 ? `Game Over! You reached level ${level}` : `You reached level ${level}`}
          </p>
          <div className="flex gap-3 justify-center">
            {lives > 0 ? (
              <Button variant="neural" onClick={onNextLevel}>
                Try Again
              </Button>
            ) : null}
            <Button variant="brain" onClick={onRestart}>
              <RotateCcw className="w-5 h-5" />
              Start Over
            </Button>
          </div>
        </div>}
    </Card>;
};