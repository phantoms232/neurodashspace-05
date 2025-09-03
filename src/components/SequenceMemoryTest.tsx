import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, Play, Layers, Volume2, VolumeX } from "lucide-react";
import { TestShareContainer } from "@/components/TestShareContainer";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { useAudioPool } from "@/hooks/useAudioPool";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type TestPhase = "waiting" | "showing" | "input" | "result";

interface SequenceStep {
  id: number;
  position: number;
}

const GRID_SIZE = 9; // 3x3 grid

const EMOJI_LIST = ["🎯", "🚀", "🧠", "🔥", "⭐", "💎", "🌟", "⚡", "🎪"];

export const SequenceMemoryTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [sequence, setSequence] = useState<SequenceStep[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [showingIndex, setShowingIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [lives, setLives] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  const { playTone, playClick } = useAudioPool(isMuted);
  const { user } = useAuth();

  const saveTestResult = async (level: number, isCorrect: boolean) => {
    if (!user) return;
    
    try {
      await supabase.from('test_results').insert({
        user_id: user.id,
        test_type: 'sequence-memory',
        level_reached: level,
        score: isCorrect ? level * 100 : (level - 1) * 100,
      });
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };

  const playCubeSound = (index: number) => {
    // Different frequencies for each cube
    const frequencies = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25, 783.99, 880.00, 1046.50]; // C4 to C6 scale
    playTone(frequencies[index], 0.3);
  };

  const generateSequence = (length: number) => {
    const newSequence: SequenceStep[] = [];
    for (let i = 0; i < length; i++) {
      newSequence.push({
        id: i,
        position: Math.floor(Math.random() * GRID_SIZE)
      });
    }
    return newSequence;
  };

  const startLevel = () => {
    const sequenceLength = Math.min(level, 12);
    const newSequence = generateSequence(sequenceLength);
    
    setSequence(newSequence);
    setUserSequence([]);
    setShowingIndex(0);
    setPhase("showing");
    setIsCorrect(null);

    showSequence(newSequence);
  };

  const showSequence = (seq: SequenceStep[]) => {
    let index = 0;
    const interval = setInterval(() => {
      setShowingIndex(index);
      playCubeSound(seq[index].position);
      
      setTimeout(() => {
        setShowingIndex(-1); // Turn off the current cube
        
        // Brief pause before showing next cube (especially important if same cube repeats)
        setTimeout(() => {
          index++;
          if (index >= seq.length) {
            clearInterval(interval);
            setTimeout(() => {
              setPhase("input");
              setShowingIndex(-1);
            }, 500);
          }
        }, 150); // Brief pause between cubes
      }, 300); // Show each cube for 300ms
      
    }, 600);
  };

  const handleGridClick = (position: number) => {
    if (phase !== "input") return;

    playCubeSound(position);
    const newUserSequence = [...userSequence, position];
    setUserSequence(newUserSequence);

    const expectedPosition = sequence[userSequence.length].position;
    
    if (position !== expectedPosition) {
      // Wrong position
      setIsCorrect(false);
      setPhase("result");
      saveTestResult(level, false);
      setLives(prev => prev - 1);
    } else if (newUserSequence.length === sequence.length) {
      // Completed successfully
      setIsCorrect(true);
      setPhase("result");
      saveTestResult(level, true);
      setLevel(prev => prev + 1);
    }
  };

  const reset = () => {
    setPhase("waiting");
    setLevel(1);
    setSequence([]);
    setUserSequence([]);
    setShowingIndex(-1);
    setIsCorrect(null);
    setLives(3);
  };

  const nextLevel = () => {
    if (lives <= 0) {
      reset();
    } else {
      startLevel();
    }
  };

  const getPerformanceMessage = () => {
    if (isCorrect) {
      if (level <= 3) return "🎯 Great start! Your memory is working!";
      if (level <= 6) return "🧠 Impressive! You're getting better!";
      if (level <= 9) return "🚀 Amazing! Your sequence memory is sharp!";
      return "👑 Legendary! Perfect sequence memory!";
    } else {
      return `❌ Wrong position! Lives remaining: ${lives}`;
    }
  };

  return (
    <TestShareContainer 
      testName="Sequence Memory"
      description="Can you memorize visual sequences? I just challenged my spatial memory on NeuroDash - think you can remember longer patterns? 🔲✨"
    >
      {phase === "waiting" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <Layers className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Test Your Sequence Memory</h3>
          <p className="text-muted-foreground">
            Grid squares will flash in sequence. Watch carefully, then click them back in the same order.
            You have 3 lives - make them count!
          </p>
          <Button variant="neural" size="lg" onClick={startLevel}>
            <Play className="w-5 h-5" />
            Start Level 1
          </Button>
        </Card>
      )}

      {(phase === "showing" || phase === "input") && (
        <Card className="space-y-6 p-8 bg-black">
          <div className="text-center">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">Level {level}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="p-2"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
            <h3 className="text-lg font-semibold">
              {phase === "showing" 
                ? `Showing sequence... (${showingIndex + 1}/${sequence.length})`
                : `Repeat the sequence (${userSequence.length}/${sequence.length})`
              }
            </h3>
            <div className="text-sm text-muted-foreground mt-2">
              {"❤️".repeat(lives)}{"🤍".repeat(3 - lives)}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 w-60 h-60 mx-auto">
            {Array.from({ length: GRID_SIZE }, (_, index) => (
              <button
                key={index}
                className={`
                  w-full h-full rounded-lg transition-all duration-200 transform-gpu
                  shadow-lg flex items-center justify-center text-2xl
                  ${phase === "showing" && showingIndex !== -1 && sequence[showingIndex]?.position === index
                    ? "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 scale-95 translate-y-1 shadow-md border-2 border-yellow-400 text-white" 
                    : "bg-gradient-to-br from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500"
                  }
                  ${phase === "input" ? "hover:scale-105 hover:shadow-xl active:scale-95 active:translate-y-1 active:shadow-md" : ""}
                  border border-gray-300
                `}
                style={{
                  perspective: "1000px",
                  transformStyle: "preserve-3d"
                }}
                onClick={() => handleGridClick(index)}
                disabled={phase !== "input"}
              >
                <span className="drop-shadow-sm">{EMOJI_LIST[index]}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {phase === "result" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <div className="text-sm text-muted-foreground">Level {level}</div>
          <h3 className={`text-2xl font-bold ${isCorrect ? 'text-success' : 'text-destructive'}`}>
            {getPerformanceMessage()}
          </h3>
          
          {lives <= 0 ? (
            <div className="space-y-2">
              <p className="text-destructive">Game Over! You reached level {level}</p>
              <Button variant="neural" onClick={reset}>
                <RotateCcw className="w-5 h-5" />
                Start Over
              </Button>
            </div>
          ) : (
            <div className="flex gap-3 justify-center">
              <Button variant="neural" onClick={nextLevel}>
                {isCorrect ? `Next Level (${Math.min(level + 1, 12)} squares)` : "Try Again"}
              </Button>
              <Button variant="brain" onClick={reset}>
                <RotateCcw className="w-5 h-5" />
                Start Over
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* PWA Install Reminder */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎯</div>
          <div>
            <h4 className="text-sm font-medium">Install NeuroDash App</h4>
            <p className="text-xs text-muted-foreground">Get faster access to sequence memory tests</p>
          </div>
          <PWAInstallButton />
        </div>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">Sequence Memory</h2>
        <p className="text-muted-foreground mb-3">
          Watch the sequence of squares, then repeat it back
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Test your visual sequential memory by watching patterns of flashing squares and reproducing them in the correct order. This evaluates your ability to encode, store, and recall spatial sequences - important for learning procedures, remembering routes, and following multi-step instructions.
        </p>
      </div>
    </TestShareContainer>
  );
};