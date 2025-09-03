import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, RotateCcw, Play, Volume2, VolumeX, Hash } from "lucide-react";
import { TestShareContainer } from "@/components/TestShareContainer";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { useAudioPool } from "@/hooks/useAudioPool";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
type TestPhase = "waiting" | "memorize" | "clicking" | "result";
interface NumberButton {
  id: number;
  number: number;
  x: number;
  y: number;
  isVisible: boolean;
  isClicked: boolean;
}
export const ChimpTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [numbers, setNumbers] = useState<NumberButton[]>([]);
  const [level, setLevel] = useState(1);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [strikes, setStrikes] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const maxStrikes = 3;
  const {
    playTone
  } = useAudioPool(isMuted);
  const {
    user
  } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  const saveTestResult = async (level: number, isComplete: boolean) => {
    if (!user) return;
    try {
      await supabase.from('test_results').insert({
        user_id: user.id,
        test_type: 'chimp-test',
        level_reached: level,
        score: isComplete ? level * 150 : (level - 1) * 150
      });
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };
  const generateNumbers = (count: number) => {
    const buttons: NumberButton[] = [];
    const usedPositions: Set<string> = new Set();
    const minDistance = 15; // Minimum distance between buttons

    for (let i = 1; i <= count; i++) {
      let x,
        y,
        attempts = 0;
      let validPosition = false;
      do {
        x = Math.random() * (85 - 15) + 15; // Keep away from edges (15% to 85%)
        y = Math.random() * (85 - 15) + 15;

        // Check distance from all existing buttons
        validPosition = true;
        for (const button of buttons) {
          const distance = Math.sqrt(Math.pow(x - button.x, 2) + Math.pow(y - button.y, 2));
          if (distance < minDistance) {
            validPosition = false;
            break;
          }
        }
        attempts++;
      } while (!validPosition && attempts < 50);
      buttons.push({
        id: i,
        number: i,
        x,
        y,
        isVisible: true,
        isClicked: false
      });
    }
    return buttons;
  };
  const startLevel = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    const count = Math.min(4 + level - 1, 10); // Start with 4 numbers, max 10
    const newNumbers = generateNumbers(count);
    setNumbers(newNumbers);
    setCurrentNumber(1);
    setPhase("memorize");
    setIsCorrect(null);
  };
  const playClickSound = (number: number) => {
    // Different frequencies for different numbers (pentatonic scale)
    const frequencies = [523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319]; // C5 to E6
    const frequency = frequencies[number - 1] || 523;
    playTone(frequency, 0.2);
  };
  const handleNumberClick = (clickedNumber: NumberButton) => {
    // Allow clicking only in clicking phase, or clicking "1" during memorize phase
    if (phase !== "clicking" && !(phase === "memorize" && clickedNumber.number === 1)) return;
    playClickSound(clickedNumber.number);

    // If we're in memorize phase and they clicked "1", switch to clicking phase
    if (phase === "memorize" && clickedNumber.number === 1) {
      setPhase("clicking");
    }
    if (clickedNumber.number === currentNumber) {
      // Correct number clicked - show the number
      setNumbers(prev => prev.map(num => num.id === clickedNumber.id ? {
        ...num,
        isClicked: true
      } : num));
      if (currentNumber === numbers.length) {
        // Level completed successfully
        setIsCorrect(true);
        setPhase("result");
        saveTestResult(level, true);
        setLevel(prev => prev + 1);
        setStrikes(0);
      } else {
        setCurrentNumber(prev => prev + 1);
      }
    } else {
      // Wrong number clicked
      setIsCorrect(false);
      setPhase("result");
      saveTestResult(level, false);
      setStrikes(prev => prev + 1);
    }
  };
  const reset = () => {
    setPhase("waiting");
    setLevel(1);
    setNumbers([]);
    setCurrentNumber(1);
    setIsCorrect(null);
    setStrikes(0);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const nextLevel = () => {
    if (strikes >= maxStrikes) {
      reset();
    } else {
      startLevel();
    }
  };
  const getPerformanceMessage = () => {
    if (isCorrect) {
      if (level <= 3) return "🐵 Good start! Chimps would be proud!";
      if (level <= 6) return "🧠 Impressive! Your memory is sharp!";
      if (level <= 9) return "🚀 Amazing! You're beating most humans!";
      return "👑 Legendary! You have chimp-level memory!";
    } else {
      return `❌ Wrong sequence! Strike ${strikes}/${maxStrikes}`;
    }
  };
  return <TestShareContainer testName="Chimp Test" description="Can you outperform a chimpanzee's memory? I just took on this legendary challenge on NeuroDash - think you're smarter than a chimp? 🐵🧠">
      {phase === "waiting" && <Card className="text-center space-y-4 p-8 bg-black">
          <Users className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Can you beat a chimpanzee?</h3>
          <p className="text-muted-foreground">
            Young chimps can remember number sequences better than most adults. 
            Numbers will appear briefly, then you must click them in order.
          </p>
          <Button variant="neural" size="lg" onClick={startLevel}>
            <Play className="w-5 h-5" />
            Start Level 1
          </Button>
        </Card>}

      {(phase === "memorize" || phase === "clicking") && <Card className="space-y-4 p-8 px-0 py-0 my-[11px] mx-[17px] bg-zinc-950">
          <div className="text-center relative">
            <Button variant="ghost" size="sm" className="absolute top-0 right-4 p-2" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <div className="text-sm text-muted-foreground">Level {level}</div>
            <h3 className="text-lg font-semibold">
              {phase === "memorize" ? "Memorize the positions..." : `Click number ${currentNumber}`}
            </h3>
          </div>
          
          <div className="relative w-full h-96 rounded-lg overflow-hidden bg-black">
            {numbers.map(num => <button key={num.id} className={`
                  absolute w-12 h-12 rounded-lg font-bold text-lg transition-all duration-200
                  ${num.isClicked ? "bg-success text-success-foreground scale-110" : num.number === 1 || phase === "memorize" ? "bg-primary text-primary-foreground hover:scale-110" : "bg-white border border-border text-foreground hover:scale-105"}
                `} style={{
          left: `${num.x}%`,
          top: `${num.y}%`
        }} onClick={() => handleNumberClick(num)} disabled={num.isClicked}>
                {num.number === 1 || phase === "memorize" || num.isClicked ? num.number : ""}
              </button>)}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Strikes: {strikes}/{maxStrikes}
          </div>
        </Card>}

      {phase === "result" && <Card className={`text-center space-y-4 p-8 bg-black ${isCorrect ? 'border-success' : 'border-destructive'}`}>
          <div className="text-sm text-muted-foreground">Level {level}</div>
          <h3 className={`text-2xl font-bold ${isCorrect ? 'text-success' : 'text-destructive'}`}>
            {getPerformanceMessage()}
          </h3>
          
          {strikes >= maxStrikes ? <div className="space-y-2">
              <p className="text-destructive">Game Over! You reached level {level}</p>
              <Button variant="neural" onClick={reset}>
                <RotateCcw className="w-5 h-5" />
                Start Over
              </Button>
            </div> : <div className="flex gap-3 justify-center">
              <Button variant="neural" onClick={nextLevel}>
                {isCorrect ? `Next Level (${Math.min(4 + level, 10)} numbers)` : "Try Again"}
              </Button>
              <Button variant="brain" onClick={reset}>
                <RotateCcw className="w-5 h-5" />
                Start Over
              </Button>
            </div>}
        </Card>}

      {/* PWA Install Reminder */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-primary" />
            <div>
              <h4 className="text-sm font-medium">Install NeuroDash App</h4>
              <p className="text-xs text-muted-foreground">Get faster access to chimp tests</p>
            </div>
          </div>
          <PWAInstallButton />
        </div>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">Chimp Test</h2>
        <p className="text-muted-foreground mb-3">
          Click the numbers in ascending order as fast as possible
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Based on research showing young chimpanzees can outperform humans at this task. Test your working memory and number sequencing abilities by remembering the position of numbers that appear briefly, then clicking them in order. This challenges your photographic memory and spatial recall.
        </p>
      </div>
    </TestShareContainer>;
};