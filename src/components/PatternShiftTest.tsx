import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shuffle, RotateCcw, Play } from "lucide-react";
import { TestShareContainer } from "@/components/TestShareContainer";

type TestPhase = "waiting" | "active" | "finished";
type Pattern = "color" | "shape" | "size" | "position";

interface GridItem {
  id: number;
  color: string;
  shape: string;
  size: string;
  isAnomaly: boolean;
}

export const PatternShiftTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentPattern, setCurrentPattern] = useState<Pattern>("color");
  const [feedback, setFeedback] = useState("");
  const [gridSize] = useState(4);

  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];
  const shapes = ["circle", "square", "triangle", "diamond"];
  const sizes = ["small", "medium", "large"];

  const generateGrid = () => {
    const patterns: Pattern[] = ["color", "shape", "size"];
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    setCurrentPattern(selectedPattern);

    const items: GridItem[] = [];
    const anomalyIndex = Math.floor(Math.random() * 16);
    
    // Make pattern more challenging by using more similar variations
    const mainColorIndex = Math.floor(Math.random() * colors.length);
    const anomalyColorIndex = (mainColorIndex + 1) % colors.length;
    const mainShapeIndex = Math.floor(Math.random() * shapes.length);
    const anomalyShapeIndex = (mainShapeIndex + 1) % shapes.length;

    for (let i = 0; i < 16; i++) {
      let color, shape, size;
      
      if (selectedPattern === "color") {
        color = i === anomalyIndex ? colors[anomalyColorIndex] : colors[mainColorIndex];
        shape = shapes[mainShapeIndex];
        size = sizes[1];
      } else if (selectedPattern === "shape") {
        color = colors[mainColorIndex];
        shape = i === anomalyIndex ? shapes[anomalyShapeIndex] : shapes[mainShapeIndex];
        size = sizes[1];
      } else { // size pattern
        color = colors[mainColorIndex];
        shape = shapes[mainShapeIndex];
        size = i === anomalyIndex ? sizes[2] : sizes[0];
      }

      items.push({
        id: i,
        color,
        shape,
        size,
        isAnomaly: i === anomalyIndex
      });
    }

    setGrid(items);
  };

  const startTest = () => {
    setPhase("active");
    setScore(0);
    setTimeLeft(60);
    setFeedback("");
    generateGrid();

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPhase("finished");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleItemClick = (item: GridItem) => {
    if (phase !== "active") return;

    if (item.isAnomaly) {
      setScore(prev => prev + 1);
      setFeedback("✅ Correct! Found the anomaly!");
      
      // Generate new grid after short delay
      setTimeout(() => {
        generateGrid();
        setFeedback("");
      }, 1000);
    } else {
      setFeedback("❌ Wrong! That's part of the pattern.");
      setTimeout(() => setFeedback(""), 1000);
    }
  };

  const reset = () => {
    setPhase("waiting");
    setGrid([]);
    setScore(0);
    setTimeLeft(60);
    setFeedback("");
  };

  const getShapeClass = (shape: string, size: string) => {
    const baseSize = size === "small" ? "w-4 h-4" : size === "large" ? "w-8 h-8" : "w-6 h-6";
    
    switch (shape) {
      case "circle":
        return `${baseSize} rounded-full`;
      case "square":
        return `${baseSize} rounded-sm`;
      case "triangle":
        return `${baseSize} rounded-sm transform rotate-45`;
      case "diamond":
        return `${baseSize} rounded-sm transform rotate-45`;
      default:
        return `${baseSize} rounded-full`;
    }
  };

  const getPatternDescription = () => {
    switch (currentPattern) {
      case "color":
        return "One item has a different color";
      case "shape":
        return "One item has a different shape";
      case "size":
        return "One item has a different size";
      default:
        return "Find the anomaly";
    }
  };

  const getScoreRating = () => {
    if (score >= 40) return "🎯 Pattern Master! Incredible focus!";
    if (score >= 25) return "🌟 Excellent pattern recognition!";
    if (score >= 15) return "👍 Good attention to detail!";
    if (score >= 8) return "📈 Decent observation skills!";
    return "🔍 Keep practicing your pattern skills!";
  };

  return (
    <TestShareContainer 
      testName="Pattern Shift"
      description="How keen is your eye for detail? I just tested my pattern recognition on NeuroDash - can you spot anomalies faster? 👁️🔍"
    >
      {phase === "waiting" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <Shuffle className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Ready to test your pattern recognition?</h3>
          <p className="text-muted-foreground">
            You'll see grids with patterns. One item will be different - find it as quickly as possible! 
            You have 60 seconds to find as many anomalies as you can.
          </p>
          <Button variant="neural" size="lg" onClick={startTest}>
            <Play className="w-5 h-5" />
            Start Test
          </Button>
        </Card>
      )}

      {phase === "active" && (
        <Card className="space-y-4 p-8 bg-black">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-success">Score: {score}</span>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">{getPatternDescription()}</div>
            </div>
            <div className="text-lg font-bold text-warning">
              {timeLeft}s
            </div>
          </div>

          {feedback && (
            <div className="text-center text-lg font-semibold">
              {feedback}
            </div>
          )}

          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
            {grid.map((item) => (
              <button
                key={item.id}
                className={`
                  aspect-square flex items-center justify-center border border-border rounded-lg
                  hover:border-primary/50 transition-all duration-200 hover:scale-105
                  ${feedback.includes("Correct") && item.isAnomaly ? "border-success bg-black" : ""}
                `}
                onClick={() => handleItemClick(item)}
              >
                <div className={`${item.color} ${getShapeClass(item.shape, item.size)}`} />
              </button>
            ))}
          </div>
        </Card>
      )}

      {phase === "finished" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <h3 className="text-2xl font-bold text-gradient">Test Complete!</h3>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">{score}</div>
            <div className="text-lg text-muted-foreground">Anomalies Found</div>
            <div className="text-sm text-muted-foreground">{getScoreRating()}</div>
          </div>

          <div className="text-sm text-muted-foreground">
            Pattern recognition is crucial for detecting changes and maintaining situational awareness.
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="neural" onClick={startTest}>
              <Shuffle className="w-5 h-5" />
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
        <h2 className="text-2xl font-bold text-gradient mb-2">Pattern Shift</h2>
        <p className="text-muted-foreground mb-3">
          Spot the anomaly in the pattern as fast as you can
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Test your pattern recognition and attention to detail by identifying anomalies in visual grids. This evaluates your ability to detect inconsistencies, recognize patterns, and maintain focus under time pressure - valuable for quality control, data analysis, and spotting errors or unusual patterns.
        </p>
      </div>
    </TestShareContainer>
  );
};