import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Timer, Zap, RotateCcw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTestResults } from "@/hooks/useTestResults";
import { ShareButtons } from "@/components/ShareButtons";
import { PWAInstallButton } from "@/components/PWAInstallButton";
type TestPhase = "waiting" | "ready" | "click" | "result" | "early";
export const ReactionTimeTest = () => {
  const {
    user
  } = useAuth();
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {
    submitTestResult
  } = useTestResults();
  const saveTestResult = async (reactionTime: number) => {
    await submitTestResult({
      test_type: 'reaction-time',
      reaction_time: reactionTime,
      score: Math.max(0, 1000 - reactionTime) // Higher score for faster reaction
    });
  };
  const startTest = () => {
    setPhase("ready");
    setReactionTime(null);

    // Random delay between 2-5 seconds
    const delay = Math.random() * 3000 + 2000;
    timeoutRef.current = setTimeout(() => {
      setPhase("click");
      setStartTime(performance.now());
    }, delay);
  };
  const handleClick = () => {
    if (phase === "ready") {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setPhase("early");
      return;
    }
    if (phase === "click" && startTime) {
      const reaction = Math.max(1, Math.round(performance.now() - startTime));
      setReactionTime(reaction);
      setPhase("result");

      // Save the test result
      saveTestResult(reaction);
    }
  };
  const reset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setPhase("waiting");
    setReactionTime(null);
    setStartTime(null);
  };
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  const getPhaseContent = () => {
    switch (phase) {
      case "waiting":
        return {
          title: "Reaction Time Test",
          description: "Ready to challenge your brain? Test your lightning-fast reflexes - how quick are your reactions?",
          bgColor: "bg-black",
          action: <Button variant="neural" size="lg" onClick={startTest}>
              <Timer className="w-5 h-5" />
              Start Test
            </Button>
        };
      case "ready":
        return {
          title: "Get Ready...",
          description: "Wait for the green signal, then click as fast as you can!",
          bgColor: "bg-warning/30",
          action: null
        };
      case "click":
        return {
          title: "CLICK NOW!",
          description: "⚡ Click as fast as you can! ⚡",
          bgColor: "bg-success/40 animate-pulse",
          action: null
        };
      case "early":
        return {
          title: "Too Early!",
          description: "You clicked before the green signal. Try again!",
          bgColor: "bg-black",
          action: <Button variant="brain" onClick={reset}>
              <RotateCcw className="w-5 h-5" />
              Try Again
            </Button>
        };
      case "result":
        return {
          title: `${reactionTime}ms`,
          description: getReactionRating(reactionTime || 0),
          bgColor: "bg-black",
          action: <div className="space-x-3">
              <Button variant="neural" onClick={startTest}>
                <Zap className="w-5 h-5" />
                Test Again
              </Button>
              <Button variant="brain" onClick={reset}>
                Back to Menu
              </Button>
            </div>
        };
    }
  };
  const getReactionRating = (time: number) => {
    if (time < 200) return "🚀 Lightning Fast! Elite reaction time!";
    if (time < 250) return "⚡ Excellent! Very fast reactions!";
    if (time < 300) return "✨ Great! Above average reactions!";
    if (time < 400) return "👍 Good! Average reaction time!";
    return "🐌 Slow but steady! Practice makes perfect!";
  };
  const content = getPhaseContent();
  return <div className="space-y-6">
      <div 
        className={`
          relative overflow-hidden rounded-2xl min-h-[400px] cursor-pointer 
          transition-all duration-500 ease-out transform hover:scale-[1.02]
          ${phase === "waiting" ? "bg-gradient-to-br from-slate-900/80 via-purple-900/40 to-indigo-900/60 shadow-2xl border border-purple-500/20" : ""}
          ${phase === "ready" ? "bg-gradient-to-br from-amber-900/60 via-orange-900/40 to-yellow-900/60 shadow-2xl shadow-amber-500/20" : ""}
          ${phase === "click" ? "bg-gradient-to-br from-emerald-500/80 via-green-400/60 to-lime-400/80 shadow-2xl shadow-green-500/40 animate-pulse" : ""}
          ${phase === "early" ? "bg-gradient-to-br from-red-900/80 via-pink-900/60 to-red-800/80 shadow-2xl shadow-red-500/30" : ""}
          ${phase === "result" ? "bg-gradient-to-br from-blue-900/60 via-indigo-900/40 to-purple-900/60 shadow-2xl border border-blue-500/30" : ""}
        `}
        onClick={handleClick}
        onTouchStart={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute inset-0 ${phase === "click" ? "animate-ping" : ""}`}>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-primary to-accent opacity-30 blur-xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-accent to-primary opacity-40 blur-lg"></div>
          </div>
        </div>
        
        {/* Main content */}
        <div className={`
          relative z-10 h-full flex items-center justify-center p-8
          ${(phase === "ready" || phase === "click") ? "pointer-events-none" : ""}
        `}>
          <div className="text-center space-y-6 max-w-md mx-auto">
            {/* Title with enhanced styling */}
            <div className="space-y-2">
              <h3 className={`
                font-bold transition-all duration-300
                ${phase === "waiting" ? "text-4xl text-white drop-shadow-lg" : ""}
                ${phase === "ready" ? "text-5xl text-yellow-100 drop-shadow-2xl animate-fade-in" : ""}
                ${phase === "click" ? "text-6xl text-white drop-shadow-2xl animate-scale-in font-black" : ""}
                ${phase === "early" ? "text-4xl text-red-100 drop-shadow-lg" : ""}
                ${phase === "result" ? "text-5xl text-gradient drop-shadow-xl font-black" : ""}
              `}>
                {content.title}
              </h3>
            </div>
            
            {/* Description with better typography */}
            <p className={`
              max-w-sm mx-auto transition-all duration-300
              ${phase === "waiting" ? "text-lg text-slate-300 leading-relaxed" : ""}
              ${phase === "ready" ? "text-xl text-amber-100 leading-relaxed font-medium animate-fade-in" : ""}
              ${phase === "click" ? "text-2xl text-white leading-relaxed font-semibold animate-bounce" : ""}
              ${phase === "early" ? "text-lg text-red-200 leading-relaxed" : ""}
              ${phase === "result" ? "text-xl text-slate-200 leading-relaxed font-medium" : ""}
            `}>
              {content.description}
            </p>
            
            {/* Action buttons with enhanced styling */}
            {content.action && (
              <div className="pt-6 pointer-events-auto animate-fade-in">
                <div className="flex justify-center gap-3">
                  {content.action}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {phase === "result" && <div className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Average human reaction time: 200-300ms
            </p>
            <div className="flex justify-center gap-4 text-sm bg-[#4b0008]/0">
              <span className="text-success text-xl">Elite: &lt;200ms</span>
              <span className="text-warning text-xl">Good: 200-300ms</span>
              <span className="text-muted-foreground text-xl">Average: 300-400ms</span>
            </div>
          </div>
          
          
        </div>}

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">Reaction Time Test</h2>
        <p className="text-muted-foreground mb-3">
          Test your reflexes and reaction speed
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Measure how quickly you can respond to visual stimuli. Click start, wait for the screen to turn green, then click as fast as possible. Good reaction times are crucial for gaming, sports, and everyday activities requiring quick responses.
        </p>
        {/* PWA Install Reminder */}
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10 mt-4 bg-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-primary">⚡</div>
              <div>
                <h4 className="text-sm font-medium">Install NeuroDash App</h4>
                <p className="text-xs text-muted-foreground">Get faster access to reaction time tests</p>
              </div>
            </div>
            <PWAInstallButton />
          </div>
        </Card>
        
        <div className="mt-4">
          <ShareButtons title="Test Your Lightning Reflexes!" description="Think you have fast reactions? I just tested my reflexes on NeuroDash - can you beat my time? ⚡🎯" showTestIcons variant="full" />
        </div>
      </div>
    </div>;
};