import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, RotateCcw, TrendingUp } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";

type TestPhase = "waiting" | "active" | "result";

interface Prediction {
  question: string;
  userGuess: number | null;
  actualResult: number;
  correct: boolean;
}

interface PredictionScenario {
  question: string;
  description: string;
  minValue: number;
  maxValue: number;
  generateResult: () => number;
}

const scenarios: PredictionScenario[] = [
  {
    question: "How many people will walk by in the next 30 seconds?",
    description: "Trust your gut feeling about foot traffic",
    minValue: 0,
    maxValue: 20,
    generateResult: () => Math.floor(Math.random() * 15) + 2
  },
  {
    question: "What percentage of the next 10 coin flips will be heads?",
    description: "Predict the outcome of random coin flips",
    minValue: 0,
    maxValue: 100,
    generateResult: () => {
      let heads = 0;
      for (let i = 0; i < 10; i++) {
        if (Math.random() > 0.5) heads++;
      }
      return heads * 10;
    }
  },
  {
    question: "What will be the temperature in your city in 3 hours? (°F)",
    description: "Use your intuition about weather patterns",
    minValue: 32,
    maxValue: 100,
    generateResult: () => Math.floor(Math.random() * 40) + 50
  },
  {
    question: "How many red cars will you see in the next minute?",
    description: "Predict based on your sense of probability",
    minValue: 0,
    maxValue: 10,
    generateResult: () => Math.floor(Math.random() * 5) + 1
  },
  {
    question: "What number between 1-100 is most people thinking of right now?",
    description: "Tap into collective consciousness",
    minValue: 1,
    maxValue: 100,
    generateResult: () => {
      // Common psychological numbers people choose
      const common = [7, 17, 23, 37, 42, 69, 73, 77];
      return Math.random() > 0.3 ? common[Math.floor(Math.random() * common.length)] : Math.floor(Math.random() * 100) + 1;
    }
  }
];

export const IntuitionGuessTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [currentScenario, setCurrentScenario] = useState(0);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [userInput, setUserInput] = useState("");
  const [round, setRound] = useState(1);
  const maxRounds = 5;

  const startTest = () => {
    setPhase("active");
    setPredictions([]);
    setCurrentScenario(0);
    setUserInput("");
    setRound(1);
  };

  const submitPrediction = () => {
    const guess = parseInt(userInput);
    const scenario = scenarios[currentScenario];
    
    if (isNaN(guess) || guess < scenario.minValue || guess > scenario.maxValue) {
      return;
    }

    // Simulate getting the "actual" result
    const actualResult = scenario.generateResult();
    const difference = Math.abs(guess - actualResult);
    const threshold = (scenario.maxValue - scenario.minValue) * 0.2; // 20% tolerance
    const correct = difference <= threshold;

    const newPrediction: Prediction = {
      question: scenario.question,
      userGuess: guess,
      actualResult,
      correct
    };

    setPredictions(prev => [...prev, newPrediction]);

    if (round >= maxRounds) {
      setPhase("result");
    } else {
      setRound(prev => prev + 1);
      setCurrentScenario(prev => (prev + 1) % scenarios.length);
      setUserInput("");
    }
  };

  const reset = () => {
    setPhase("waiting");
    setPredictions([]);
    setCurrentScenario(0);
    setUserInput("");
    setRound(1);
  };

  const getIntuitionScore = () => {
    const correctPredictions = predictions.filter(p => p.correct).length;
    const accuracy = (correctPredictions / predictions.length) * 100;
    return { correct: correctPredictions, total: predictions.length, accuracy };
  };

  const getPerformanceMessage = () => {
    const { accuracy } = getIntuitionScore();
    if (accuracy >= 80) return "🔮 Psychic! Your intuition is extraordinary!";
    if (accuracy >= 60) return "👁️ Sharp Intuition! Well above chance!";
    if (accuracy >= 40) return "🧠 Good Instincts! Decent intuitive sense!";
    return "🎯 Keep practicing! Intuition develops over time!";
  };

  const currentScenarioData = scenarios[currentScenario];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {phase === "waiting" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <Eye className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Ready to challenge your brain?</h3>
          <p className="text-muted-foreground">
            Test your intuitive powers - can you predict uncertain events with your gut feeling?
          </p>
          <Button variant="neural" size="lg" onClick={startTest}>
            <TrendingUp className="w-5 h-5" />
            Start Predicting
          </Button>
        </Card>
      )}

      {phase === "active" && (
        <Card className="space-y-6 p-8 bg-black">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Round {round} of {maxRounds}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {currentScenarioData.question}
            </h3>
            <p className="text-muted-foreground">
              {currentScenarioData.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <label className="block text-sm font-medium mb-2">
                Enter your prediction ({currentScenarioData.minValue} - {currentScenarioData.maxValue})
              </label>
              <input
                type="number"
                min={currentScenarioData.minValue}
                max={currentScenarioData.maxValue}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-32 p-2 text-center text-lg bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="?"
              />
            </div>

            <div className="text-center">
              <Button 
                variant="neural"
                onClick={submitPrediction}
                disabled={!userInput || isNaN(parseInt(userInput))}
              >
                Submit Prediction
              </Button>
            </div>
          </div>

          {predictions.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Previous Results:</h4>
              {predictions.slice(-3).map((pred, idx) => (
                <div 
                  key={idx} 
                  className={`text-sm p-2 rounded ${pred.correct ? 'bg-black' : 'bg-muted/50'}`}
                >
                  Guessed: {pred.userGuess} | Actual: {pred.actualResult} | 
                  <span className={pred.correct ? 'text-success font-semibold' : 'text-muted-foreground'}>
                    {pred.correct ? ' ✓ Close!' : ' ✗ Off'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {phase === "result" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <Eye className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-2xl font-bold text-primary">
            {getPerformanceMessage()}
          </h3>
          <div className="space-y-2">
            <p className="text-lg">
              Accuracy: <span className="font-bold text-primary">{getIntuitionScore().accuracy.toFixed(0)}%</span>
            </p>
            <p className="text-muted-foreground">
              {getIntuitionScore().correct} out of {getIntuitionScore().total} predictions were close
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Your Predictions:</h4>
            <div className="space-y-1 text-sm">
              {predictions.map((pred, idx) => (
                <div 
                  key={idx}
                  className={`p-2 rounded ${pred.correct ? 'bg-black' : 'bg-muted/50'}`}
                >
                  <div className="truncate">{pred.question}</div>
                  <div>You: {pred.userGuess} | Actual: {pred.actualResult} 
                    <span className={pred.correct ? 'text-success' : 'text-muted-foreground'}>
                      {pred.correct ? ' ✓' : ' ✗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button variant="neural" onClick={startTest}>
              Test Again
            </Button>
            <Button variant="brain" onClick={reset}>
              <RotateCcw className="w-5 h-5" />
              Back to Menu
            </Button>
          </div>
        </Card>
      )}

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">Intuition Guess</h2>
        <p className="text-muted-foreground mb-3">
          Trust your gut and make predictions about uncertain events
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Explore your intuitive abilities by making predictions about random or uncertain events. This test examines your unconscious pattern recognition, gut instinct accuracy, and ability to sense outcomes beyond logical analysis - skills valuable for decision-making and creative problem-solving.
        </p>
        <div className="mt-4">
          <ShareButtons 
            title="Test Your Intuition!"
            description="How strong is your gut feeling? I just tested my intuitive powers on NeuroDash - can you trust your instincts better? 🔮✨"
            showTestIcons
            variant="full"
          />
        </div>
      </div>
    </div>
  );
};