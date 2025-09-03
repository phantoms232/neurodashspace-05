import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Zap, RotateCcw, Play } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";

type TestPhase = "waiting" | "active" | "finished";

interface MathProblem {
  num1: number;
  num2: number;
  operator: string;
  answer: number;
}

interface Distraction {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
}

export const DistractionControlTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [distractions, setDistractions] = useState<Distraction[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const distractionTimer = useRef<NodeJS.Timeout | null>(null);

  const distractionTexts = [
    "LOOK HERE!", "CLICK ME!", "URGENT!", "SALE!", "WARNING!", "HEY!", "NOTICE!",
    "IMPORTANT!", "ALERT!", "FREE!", "WIN!", "BONUS!", "SPECIAL!", "LIMITED!",
    "🎯", "⚡", "🔥", "💥", "⭐", "🚨", "📢", "🎉", "💰", "🎁"
  ];

  const colors = ["text-red-500", "text-yellow-500", "text-green-500", "text-blue-500", "text-purple-500"];

  const generateProblem = (): MathProblem => {
    const operators = ["+", "-", "×"];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let num1, num2, answer;
    
    if (operator === "+") {
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      answer = num1 + num2;
    } else if (operator === "-") {
      num1 = Math.floor(Math.random() * 50) + 25;
      num2 = Math.floor(Math.random() * 25) + 1;
      answer = num1 - num2;
    } else { // multiplication
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 * num2;
    }

    return { num1, num2, operator, answer };
  };

  const generateDistraction = (): Distraction => {
    return {
      id: Math.random(),
      x: Math.random() * 80 + 10, // 10% to 90% of container width
      y: Math.random() * 70 + 15, // 15% to 85% of container height
      text: distractionTexts[Math.floor(Math.random() * distractionTexts.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 20 + 10 // 10px to 30px
    };
  };

  const startDistractions = () => {
    distractionTimer.current = setInterval(() => {
      setDistractions(prev => {
        const newDistractions = [...prev, generateDistraction()];
        // Keep only last 8 distractions to avoid cluttering
        return newDistractions.slice(-8);
      });
    }, 2000); // New distraction every 2 seconds
  };

  const startTest = () => {
    setPhase("active");
    setScore(0);
    setTimeLeft(90);
    setQuestionCount(0);
    setDistractions([]);
    setUserAnswer("");
    setCurrentProblem(generateProblem());
    
    startDistractions();
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPhase("finished");
          if (distractionTimer.current) clearInterval(distractionTimer.current);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProblem || !userAnswer.trim()) return;

    const userNum = parseInt(userAnswer);
    if (userNum === currentProblem.answer) {
      setScore(prev => prev + 1);
    }

    setQuestionCount(prev => prev + 1);
    setUserAnswer("");
    setCurrentProblem(generateProblem());
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleDistractionClick = (distractionId: number) => {
    // Remove clicked distraction but add penalty to score
    setDistractions(prev => prev.filter(d => d.id !== distractionId));
    setScore(prev => Math.max(0, prev - 1)); // Penalty for clicking distractions
  };

  const reset = () => {
    if (distractionTimer.current) clearInterval(distractionTimer.current);
    setPhase("waiting");
    setCurrentProblem(null);
    setUserAnswer("");
    setScore(0);
    setTimeLeft(90);
    setDistractions([]);
    setQuestionCount(0);
  };

  const getAccuracy = () => {
    return questionCount > 0 ? Math.round((score / questionCount) * 100) : 0;
  };

  const getScoreRating = () => {
    const accuracy = getAccuracy();
    if (score >= 30 && accuracy >= 90) return "🧠 Distraction Master! Incredible focus!";
    if (score >= 20 && accuracy >= 80) return "⚡ Excellent concentration!";
    if (score >= 15 && accuracy >= 70) return "🎯 Good focus under pressure!";
    if (score >= 10) return "📈 Decent multitasking ability!";
    return "🎪 Those distractions got you! Keep practicing!";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {phase === "waiting" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <Zap className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Ready to challenge your brain?</h3>
          <p className="text-muted-foreground">
            Test your focus and concentration - can you ignore distractions while solving problems?
          </p>
          <Button variant="neural" size="lg" onClick={startTest}>
            <Play className="w-5 h-5" />
            Start Test
          </Button>
        </Card>
      )}

      {phase === "active" && currentProblem && (
        <div className="relative">
          <Card className="text-center space-y-6 p-8 relative z-10 bg-black">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="text-success">Correct: {score}</span>
                <span className="text-muted-foreground"> / </span>
                <span className="text-muted-foreground">Total: {questionCount}</span>
              </div>
              <div className="text-lg font-bold text-warning">
                {timeLeft}s
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold text-primary">
                {currentProblem.num1} {currentProblem.operator} {currentProblem.num2} = ?
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  ref={inputRef}
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer..."
                  className="text-center text-lg max-w-xs mx-auto"
                  autoComplete="off"
                />
                <Button type="submit" variant="neural" disabled={!userAnswer.trim()}>
                  Submit
                </Button>
              </form>
            </div>
          </Card>

          {/* Distractions */}
          <div className="absolute inset-0 pointer-events-none">
            {distractions.map((distraction) => (
              <button
                key={distraction.id}
                className={`
                  absolute pointer-events-auto font-bold animate-pulse cursor-pointer
                  hover:scale-110 transition-transform duration-200 z-20
                  ${distraction.color}
                `}
                style={{
                  left: `${distraction.x}%`,
                  top: `${distraction.y}%`,
                  fontSize: `${distraction.size}px`
                }}
                onClick={() => handleDistractionClick(distraction.id)}
              >
                {distraction.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "finished" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <h3 className="text-2xl font-bold text-gradient">Test Complete!</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-success">{score}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{getAccuracy()}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning">{questionCount}</div>
              <div className="text-sm text-muted-foreground">Total Problems</div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {getScoreRating()}
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="neural" onClick={startTest}>
              <Zap className="w-5 h-5" />
              Try Again
            </Button>
            <Button variant="brain" onClick={reset}>
              <RotateCcw className="w-5 h-5" />
              Back to Menu
            </Button>
          </div>
        </Card>
      )}

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">Distraction Control</h2>
        <p className="text-muted-foreground mb-3">
          Solve math problems while ignoring distractions
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Measure your ability to maintain focus while distracting elements compete for your attention. This test evaluates selective attention, cognitive control, and resistance to interference - essential skills for productive work in noisy environments and multitasking scenarios.
        </p>
        <div className="mt-4">
          <ShareButtons 
            title="Test Your Focus Power!"
            description="Can you stay focused while distractions try to break your concentration? I just tested my mental focus on NeuroDash - can you beat my score? 🎯🧠"
            showTestIcons
            variant="full"
          />
        </div>
      </div>
    </div>
  );
};
