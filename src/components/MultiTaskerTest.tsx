import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, RotateCcw, Timer } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";

type TestPhase = "waiting" | "active" | "result";

interface Task {
  id: string;
  type: "click" | "math" | "memory";
  question: string;
  answer?: string | number;
  options?: string[];
  position?: { x: number; y: number };
  completed: boolean;
}

export const MultiTaskerTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [level, setLevel] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (phase === "active" && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPhase("result");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, timeLeft]);

  const generateTasks = () => {
    const newTasks: Task[] = [];
    const taskCount = Math.min(2 + level, 4);

    for (let i = 0; i < taskCount; i++) {
      const taskType = ["click", "math", "memory"][Math.floor(Math.random() * 3)] as Task["type"];
      
      if (taskType === "click") {
        newTasks.push({
          id: `click-${i}`,
          type: "click",
          question: "Click me!",
          position: {
            x: Math.random() * 70 + 10,
            y: Math.random() * 50 + 10
          },
          completed: false
        });
      } else if (taskType === "math") {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const operation = Math.random() > 0.5 ? "+" : "-";
        const answer = operation === "+" ? a + b : a - b;
        
        newTasks.push({
          id: `math-${i}`,
          type: "math",
          question: `${a} ${operation} ${b} = ?`,
          answer: answer,
          completed: false
        });
      } else {
        const colors = ["red", "blue", "green", "yellow", "purple"];
        const correctColor = colors[Math.floor(Math.random() * colors.length)];
        
        newTasks.push({
          id: `memory-${i}`,
          type: "memory",
          question: `Remember: ${correctColor}`,
          answer: correctColor,
          options: colors,
          completed: false
        });
      }
    }

    setTasks(newTasks);
  };

  const startTest = () => {
    setPhase("active");
    setScore(0);
    setTimeLeft(30);
    setLevel(1);
    generateTasks();
  };

  const handleTaskComplete = (taskId: string, userAnswer?: string | number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const isCorrect = task.type === "click" || 
          (task.type === "math" && userAnswer === task.answer) ||
          (task.type === "memory" && userAnswer === task.answer);
        
        if (isCorrect) {
          setScore(s => s + 1);
        }
        
        return { ...task, completed: true };
      }
      return task;
    }));

    // Check if all tasks completed
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    
    if (updatedTasks.every(task => task.completed)) {
      setTimeout(() => {
        setLevel(prev => prev + 1);
        generateTasks();
      }, 500);
    }
  };

  const reset = () => {
    setPhase("waiting");
    setTasks([]);
    setScore(0);
    setTimeLeft(30);
    setLevel(1);
  };

  const getPerformanceMessage = () => {
    if (score >= 15) return "🚀 Multitasking Master! Incredible focus!";
    if (score >= 10) return "⚡ Excellent! Great multitasking skills!";
    if (score >= 6) return "👍 Good! Above average multitasking!";
    return "🧠 Keep practicing! Multitasking improves with training!";
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {phase === "waiting" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <Zap className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Ready to challenge your brain?</h3>
          <p className="text-muted-foreground">
            Test your multitasking abilities - can you handle multiple tasks at once?
          </p>
          <Button variant="neural" size="lg" onClick={startTest}>
            <Timer className="w-5 h-5" />
            Start Multitasking
          </Button>
        </Card>
      )}

      {phase === "active" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Score: {score} | Level: {level}
            </div>
            <div className="text-sm text-muted-foreground">
              Time: {timeLeft}s
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <Card 
                key={task.id} 
                className={`p-4 space-y-3 transition-all ${
                  task.completed ? 'opacity-50 bg-black' : 'bg-card'
                }`}
              >
                {task.type === "click" && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">{task.question}</p>
                    <Button 
                      variant="neural"
                      onClick={() => handleTaskComplete(task.id)}
                      disabled={task.completed}
                    >
                      Click Me!
                    </Button>
                  </div>
                )}

                {task.type === "math" && (
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-2">{task.question}</p>
                    <div className="flex gap-2 justify-center">
                      {[-2, -1, 0, 1, 2].map(offset => {
                        const value = (task.answer as number) + offset;
                        return (
                          <Button 
                            key={value}
                            variant="outline"
                            size="sm"
                            onClick={() => handleTaskComplete(task.id, value)}
                            disabled={task.completed}
                          >
                            {value}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {task.type === "memory" && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">{task.question}</p>
                    <div className="grid grid-cols-2 gap-1">
                      {task.options?.map(color => (
                        <Button 
                          key={color}
                          variant="outline"
                          size="sm"
                          onClick={() => handleTaskComplete(task.id, color)}
                          disabled={task.completed}
                          className="capitalize"
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>
        </div>
      )}

      {phase === "result" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <Zap className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-2xl font-bold text-primary">
            {getPerformanceMessage()}
          </h3>
          <div className="space-y-2">
            <p className="text-lg">Final Score: <span className="font-bold text-primary">{score}</span></p>
            <p className="text-muted-foreground">Tasks completed | Level reached: {level}</p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button variant="neural" onClick={startTest}>
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
        <h2 className="text-2xl font-bold text-gradient mb-2">Multi-Tasker</h2>
        <p className="text-muted-foreground mb-3">
          Handle multiple tasks simultaneously - test your attention span
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Challenge your ability to juggle multiple cognitive tasks at once. Switch between clicking targets, solving math problems, and remembering information while maintaining accuracy across all tasks. This tests divided attention, cognitive flexibility, and executive function - crucial for modern work environments.
        </p>
        <div className="mt-4">
          <ShareButtons 
            title="Test Your Multitasking Powers!"
            description="Can you juggle multiple tasks simultaneously without losing focus? I just challenged my multitasking skills on NeuroDash - can you handle the chaos? 🤹‍♂️💪"
            showTestIcons
            variant="full"
          />
        </div>
      </div>
    </div>
  );
};