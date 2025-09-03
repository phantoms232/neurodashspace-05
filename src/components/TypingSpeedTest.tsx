import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Keyboard, RotateCcw, Play } from "lucide-react";
import { TestShareContainer } from "@/components/TestShareContainer";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type TestPhase = "waiting" | "active" | "finished";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once.",
  "Technology has revolutionized the way we communicate, work, and live our daily lives in the modern world.",
  "Artificial intelligence and machine learning are transforming industries and creating new opportunities for innovation.",
  "Climate change represents one of the most significant challenges facing humanity in the twenty-first century.",
  "Space exploration continues to capture our imagination while advancing scientific knowledge and technological capabilities."
];

export const TypingSpeedTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(60); // 60 seconds
  const [timeLeft, setTimeLeft] = useState(60);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  const saveTestResult = async (wpm: number, accuracy: number) => {
    if (!user) return;
    
    try {
      await supabase.from('test_results').insert({
        user_id: user.id,
        test_type: 'typing-speed',
        score: Math.round(wpm),
        accuracy: accuracy,
        duration: duration * 1000, // Convert to milliseconds
      });
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };

  const startTest = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setTargetText(randomText);
    setUserInput("");
    setPhase("active");
    setStartTime(Date.now());
    setEndTime(null);
    setTimeLeft(duration);
    
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finishTest = () => {
    setPhase("finished");
    setEndTime(Date.now());
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Save result when test finishes
    const stats = calculateStats();
    saveTestResult(stats.wpm, stats.accuracy);
  };

  const reset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setPhase("waiting");
    setTargetText("");
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(duration);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserInput(value);
    
    // Check if test is complete
    if (value.length >= targetText.length) {
      finishTest();
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Calculate statistics
  const calculateStats = () => {
    if (!startTime || !endTime) return { wpm: 0, accuracy: 0, cpm: 0 };
    
    const timeElapsed = (endTime - startTime) / 1000 / 60; // minutes
    const wordsTyped = userInput.trim().split(' ').filter(word => word.length > 0).length;
    const charactersTyped = userInput.length;
    
    const wpm = Math.round(wordsTyped / timeElapsed);
    const cpm = Math.round(charactersTyped / timeElapsed);
    
    // Calculate accuracy
    let correctChars = 0;
    const minLength = Math.min(userInput.length, targetText.length);
    for (let i = 0; i < minLength; i++) {
      if (userInput[i] === targetText[i]) {
        correctChars++;
      }
    }
    const accuracy = minLength > 0 ? Math.round((correctChars / minLength) * 100) : 0;
    
    return { wpm, accuracy, cpm };
  };

  const stats = calculateStats();

  const renderText = () => {
    if (phase !== "active") return null;
    
    return (
      <div className="text-lg leading-relaxed font-mono p-4 bg-muted/20 rounded-lg">
        {targetText.split('').map((char, index) => {
          let className = "text-muted-foreground";
          
          if (index < userInput.length) {
            className = userInput[index] === char ? "text-success bg-black" : "text-destructive bg-black";
          } else if (index === userInput.length) {
            className = "text-primary bg-black animate-pulse";
          }
          
          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <TestShareContainer 
      testName="Typing Speed"
      description="How fast can you type? I just tested my keyboard skills on NeuroDash - think you can type faster and more accurately? ⌨️💨"
    >
      {phase === "waiting" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <Keyboard className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Ready to test your typing speed?</h3>
          <p className="text-muted-foreground">
            Type the given text as fast and accurately as you can. You have {duration} seconds!
          </p>
          <Button variant="neural" size="lg" onClick={startTest}>
            <Play className="w-5 h-5" />
            Start Typing Test
          </Button>
        </Card>
      )}

      {phase === "active" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-6 text-sm">
              <span className="text-primary">WPM: {Math.round(userInput.trim().split(' ').length / ((Date.now() - (startTime || Date.now())) / 60000))}</span>
              <span className="text-success">Accuracy: {Math.round((userInput.split('').filter((char, i) => char === targetText[i]).length / Math.max(userInput.length, 1)) * 100)}%</span>
            </div>
            <div className="text-lg font-bold text-warning">
              {timeLeft}s
            </div>
          </div>
          
          {renderText()}
          
          <Textarea
            ref={textareaRef}
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            className="min-h-32 text-lg font-mono resize-none"
            disabled={phase !== "active"}
          />
        </div>
      )}

      {phase === "finished" && (
        <Card className="text-center space-y-6 p-8 bg-black">
          <h3 className="text-2xl font-bold text-gradient">Test Complete!</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.wpm}</div>
              <div className="text-sm text-muted-foreground">Words per Minute</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success">{stats.accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning">{stats.cpm}</div>
              <div className="text-sm text-muted-foreground">Characters per Minute</div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Characters typed: {userInput.length} / {targetText.length}</p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button variant="neural" onClick={startTest}>
              <Keyboard className="w-5 h-5" />
              Try Again
            </Button>
            <Button variant="brain" onClick={reset}>
              <RotateCcw className="w-5 h-5" />
              Back to Menu
            </Button>
          </div>
        </Card>
      )}

      {/* PWA Install Reminder */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="w-5 h-5 text-primary" />
            <div>
              <h4 className="text-sm font-medium">Install NeuroDash App</h4>
              <p className="text-xs text-muted-foreground">Get faster access to typing speed tests</p>
            </div>
          </div>
          <PWAInstallButton />
        </div>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">Typing Speed</h2>
        <p className="text-muted-foreground mb-3">
          Test your words per minute and typing accuracy
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Measure your keyboard proficiency by typing as fast and accurately as possible. This test evaluates your typing speed (WPM), accuracy percentage, and muscle memory. Strong typing skills improve productivity, reduce strain, and are essential for efficient digital communication and content creation.
        </p>
      </div>
    </TestShareContainer>
  );
};