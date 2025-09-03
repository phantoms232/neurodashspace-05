import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Hash, RotateCcw, Play } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type TestPhase = "waiting" | "memorize" | "input" | "result";

export const NumberMemoryTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [currentNumber, setCurrentNumber] = useState("");
  const [userInput, setUserInput] = useState("");
  const [level, setLevel] = useState(1);
  const [showTime, setShowTime] = useState(3000); // 3 seconds initially
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const saveTestResult = async (level: number, isCorrect: boolean) => {
    if (!user) return;
    
    try {
      await supabase.from('test_results').insert({
        user_id: user.id,
        test_type: 'number-memory',
        level_reached: level,
        score: isCorrect ? level * 200 : (level - 1) * 200,
      });
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };

  const generateNumber = (digits: number): string => {
    let number = "";
    for (let i = 0; i < digits; i++) {
      number += Math.floor(Math.random() * 10).toString();
    }
    return number;
  };

  const startLevel = () => {
    const digits = Math.min(3 + level - 1, 15); // Start with 3 digits, max 15
    const number = generateNumber(digits);
    setCurrentNumber(number);
    setUserInput("");
    setPhase("memorize");
    setIsCorrect(null);
    
    // Show number for a certain time, then hide it
    setTimeout(() => {
      setPhase("input");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }, showTime);
  };

  const checkAnswer = () => {
    const correct = userInput === currentNumber;
    setIsCorrect(correct);
    setPhase("result");
    
    // Save result
    saveTestResult(level, correct);
    
    if (correct) {
      // Increase difficulty
      setLevel(prev => prev + 1);
      // Reduce show time slightly each level (min 1 second)
      setShowTime(prev => Math.max(1000, prev - 100));
    }
  };

  const reset = () => {
    setPhase("waiting");
    setLevel(1);
    setShowTime(3000);
    setCurrentNumber("");
    setUserInput("");
    setIsCorrect(null);
  };

  const nextLevel = () => {
    startLevel();
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      checkAnswer();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {phase === "waiting" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <Hash className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Ready to challenge your brain?</h3>
          <p className="text-muted-foreground">
            Test your number memory skills - how many digits can you remember?
          </p>
          <Button variant="neural" size="lg" onClick={startLevel}>
            <Play className="w-5 h-5" />
            Start Level 1
          </Button>
        </Card>
      )}

      {phase === "memorize" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <div className="text-sm text-muted-foreground">Level {level}</div>
          <div className="text-4xl md:text-6xl font-mono font-bold text-primary tracking-widest">
            {currentNumber}
          </div>
          <div className="text-sm text-muted-foreground">
            Memorize this number...
          </div>
        </Card>
      )}

      {phase === "input" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <div className="text-sm text-muted-foreground">Level {level}</div>
          <h3 className="text-xl font-semibold">What was the number?</h3>
          <form onSubmit={handleInputSubmit} className="space-y-4">
            <Input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter the number..."
              className="text-center text-lg font-mono tracking-widest"
              maxLength={15}
            />
            <Button 
              type="submit" 
              variant="neural"
              disabled={!userInput.trim()}
            >
              Submit Answer
            </Button>
          </form>
        </Card>
      )}

      {phase === "result" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <div className="text-sm text-muted-foreground">Level {level}</div>
          <h3 className={`text-2xl font-bold ${isCorrect ? 'text-success' : 'text-destructive'}`}>
            {isCorrect ? "Correct! 🎉" : "Incorrect 😔"}
          </h3>
          
          <div className="space-y-2">
            <div className="text-lg">
              <span className="text-muted-foreground">Correct answer: </span>
              <span className="font-mono font-bold text-primary">{currentNumber}</span>
            </div>
            <div className="text-lg">
              <span className="text-muted-foreground">Your answer: </span>
              <span className="font-mono font-bold">{userInput}</span>
            </div>
          </div>

          {isCorrect ? (
            <div className="space-y-2">
              <p className="text-success">Great job! Moving to level {level + 1}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="neural" onClick={nextLevel}>
                  Next Level ({Math.min(3 + level, 15)} digits)
                </Button>
                <Button variant="brain" onClick={reset}>
                  <RotateCcw className="w-5 h-5" />
                  Restart
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground">You reached level {level}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="neural" onClick={startLevel}>
                  Try Level {level} Again
                </Button>
                <Button variant="brain" onClick={reset}>
                  <RotateCcw className="w-5 h-5" />
                  Start Over
                </Button>
              </div>
            </div>
          )}
          
        </Card>
      )}

      {level > 1 && phase !== "waiting" && (
        <div className="text-center text-sm text-muted-foreground">
          Current Level: {level} • Digits: {Math.min(3 + level - 1, 15)}
        </div>
      )}

      {/* PWA Install Reminder */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-primary" />
            <div>
              <h4 className="text-sm font-medium">Install NeuroDash App</h4>
              <p className="text-xs text-muted-foreground">Get faster access to brain training tests</p>
            </div>
          </div>
          <PWAInstallButton />
        </div>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">Number Memory</h2>
        <p className="text-muted-foreground mb-3">
          Remember the number sequence and type it back
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Test your numerical working memory by remembering increasingly long sequences of digits. This evaluates your ability to temporarily hold and manipulate numerical information - essential for mental math, following instructions with numbers, and remembering phone numbers or codes.
        </p>
        <div className="mt-4">
          <ShareButtons 
            title="Test Your Number Memory!"
            description="How many digits can you remember? I just challenged my numerical memory on NeuroDash - think you can beat my score? 🧠🔢"
            showTestIcons
            variant="full"
          />
        </div>
      </div>
    </div>
  );
};