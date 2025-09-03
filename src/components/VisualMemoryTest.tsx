import { useState, useEffect } from "react";
import { WaitingPhase } from "./visual-memory/WaitingPhase";
import { ActivePhase } from "./visual-memory/ActivePhase";
import { ResultPhase } from "./visual-memory/ResultPhase";
import { generateGrid, GridCell } from "./visual-memory/gridUtils";
import { TestShareContainer } from "@/components/TestShareContainer";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { useAudioPool } from "@/hooks/useAudioPool";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
type TestPhase = "waiting" | "memorize" | "input" | "result";
export const VisualMemoryTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [gridSize, setGridSize] = useState(3);
  const [activeSquares, setActiveSquares] = useState<number[]>([]);
  const [clickedSquares, setClickedSquares] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showTime] = useState(3000);
  const [isMuted, setIsMuted] = useState(false);
  const {
    playTone
  } = useAudioPool(isMuted);
  const {
    user
  } = useAuth();
  const saveTestResult = async (level: number, isCorrect: boolean) => {
    if (!user) return;
    try {
      await supabase.from('test_results').insert({
        user_id: user.id,
        test_type: 'visual-memory',
        level_reached: level,
        score: isCorrect ? level * 100 : (level - 1) * 100
      });
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };
  const playCubeSound = (index: number) => {
    // Different frequencies for each cube
    const frequencies = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25, 783.99, 880.00, 1046.50]; // C4 to C6 scale
    playTone(frequencies[index % frequencies.length], 0.3);
  };

  // Play sounds for active squares during memorize phase
  useEffect(() => {
    if (phase === "memorize" && activeSquares.length > 0) {
      // Play sounds for all active squares with slight delays
      activeSquares.forEach((squareId, index) => {
        setTimeout(() => {
          playCubeSound(squareId);
        }, index * 200); // 200ms delay between each sound
      });
    }
  }, [phase, activeSquares, isMuted]);
  const startLevel = () => {
    const size = Math.min(3 + Math.floor(level / 3), 6); // Increase grid size every 3 levels
    const numActive = Math.min(3 + level - 1, 12); // Start with 3, max 12

    const {
      cells,
      activeIndices
    } = generateGrid(size, numActive);
    setGridSize(size);
    setGrid(cells);
    setActiveSquares(activeIndices);
    setClickedSquares([]);
    setPhase("memorize");
    setIsCorrect(null);
    setTimeout(() => {
      setPhase("input");
      setGrid(cells.map(cell => ({
        ...cell,
        isActive: false
      })));
    }, showTime);
  };
  const handleCellClick = (cellId: number) => {
    if (phase !== "input") return;
    playCubeSound(cellId);
    const newClickedSquares = [...clickedSquares];
    const clickIndex = newClickedSquares.indexOf(cellId);
    if (clickIndex > -1) {
      newClickedSquares.splice(clickIndex, 1);
    } else {
      newClickedSquares.push(cellId);
    }
    setClickedSquares(newClickedSquares);
    setGrid(prev => prev.map(cell => cell.id === cellId ? {
      ...cell,
      isClicked: !cell.isClicked
    } : cell));

    // Auto-check when user has selected the right number of squares
    if (newClickedSquares.length === activeSquares.length) {
      setTimeout(() => {
        checkAnswer(newClickedSquares);
      }, 500); // Small delay to show the selection
    }
  };
  const checkAnswer = (userSquares: number[] = clickedSquares) => {
    const correct = activeSquares.length === userSquares.length && activeSquares.every(id => userSquares.includes(id));
    setIsCorrect(correct);
    setPhase("result");

    // Save result
    saveTestResult(level, correct);
    if (correct) {
      setLevel(prev => prev + 1);
    } else {
      setLives(prev => prev - 1);
    }
  };
  const reset = () => {
    setPhase("waiting");
    setLevel(1);
    setLives(3);
    setGridSize(3);
    setGrid([]);
    setActiveSquares([]);
    setClickedSquares([]);
    setIsCorrect(null);
  };
  return <TestShareContainer testName="Visual Memory" description="Can you memorize visual patterns? I just challenged my spatial memory on NeuroDash - think you can remember better? 👁️🧠">
      {phase === "waiting" && <WaitingPhase onStart={startLevel} />}

      {(phase === "memorize" || phase === "input") && <ActivePhase phase={phase} level={level} lives={lives} grid={grid} gridSize={gridSize} clickedSquares={clickedSquares} activeSquares={activeSquares} onCellClick={handleCellClick} isMuted={isMuted} setIsMuted={setIsMuted} />}

      {phase === "result" && isCorrect !== null && <ResultPhase isCorrect={isCorrect} level={level} lives={lives} clickedSquares={clickedSquares} activeSquares={activeSquares} onNextLevel={startLevel} onRestart={reset} />}

      {/* PWA Install Reminder */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10 bg-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 bg-[#000a00]">
            <Eye className="w-5 h-5 text-primary" />
            <div>
              <h4 className="text-sm font-medium">Install NeuroDash App</h4>
              <p className="text-xs text-muted-foreground">Get faster access to visual memory tests</p>
            </div>
          </div>
          <PWAInstallButton />
        </div>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">Visual Memory</h2>
        <p className="text-muted-foreground mb-3">
          Remember the pattern and recreate it
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Challenge your visual memory by memorizing and recreating patterns of highlighted squares on a grid. This test evaluates your ability to encode, store, and recall visual-spatial information - crucial for navigation, design work, and remembering visual layouts and configurations.
        </p>
      </div>
    </TestShareContainer>;
};