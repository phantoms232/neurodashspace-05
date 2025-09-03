import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Clock, RotateCcw } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";

type TestPhase = "waiting" | "active" | "result";

interface LogicPuzzle {
  question: string;
  answer: boolean;
  explanation: string;
}

const puzzles: LogicPuzzle[] = [
  {
    question: "All cats are animals. Some animals are dogs. Therefore, some cats are dogs.",
    answer: false,
    explanation: "The logic is invalid - just because cats and dogs are both animals doesn't mean some cats are dogs."
  },
  {
    question: "If it's raining, then the ground is wet. The ground is not wet. Therefore, it's not raining.",
    answer: true,
    explanation: "This is valid modus tollens logic - if P then Q, not Q, therefore not P."
  },
  {
    question: "Either John is tall or John is short. John is not tall. Therefore, John is short.",
    answer: true,
    explanation: "This is valid disjunctive syllogism - either A or B, not A, therefore B."
  },
  {
    question: "All birds can fly. Penguins are birds. Therefore, penguins can fly.",
    answer: false,
    explanation: "The major premise is false - not all birds can fly (penguins, ostriches, etc.)."
  },
  {
    question: "If you study hard, you will pass. You passed. Therefore, you studied hard.",
    answer: false,
    explanation: "This is the logical fallacy of affirming the consequent - there could be other reasons for passing."
  },
  {
    question: "All roses are flowers. All flowers need water. Therefore, all roses need water.",
    answer: true,
    explanation: "This is valid categorical syllogism - if all A are B, and all B are C, then all A are C."
  },
  {
    question: "If Maria exercises, she feels energetic. Maria feels energetic. Therefore, Maria exercised.",
    answer: false,
    explanation: "This commits the fallacy of affirming the consequent - there could be other reasons for feeling energetic."
  },
  {
    question: "No reptiles are mammals. All snakes are reptiles. Therefore, no snakes are mammals.",
    answer: true,
    explanation: "Valid categorical syllogism - if no A are B, and all C are A, then no C are B."
  },
  {
    question: "Some students are athletes. All athletes are disciplined. Therefore, some students are disciplined.",
    answer: true,
    explanation: "Valid partial syllogism - if some A are B, and all B are C, then some A are C."
  },
  {
    question: "If Tom is late, he misses breakfast. Tom is not late. Therefore, Tom doesn't miss breakfast.",
    answer: false,
    explanation: "This is the fallacy of denying the antecedent - Tom could miss breakfast for other reasons."
  },
  {
    question: "All squares are rectangles. All rectangles have four sides. Therefore, all squares have four sides.",
    answer: true,
    explanation: "Valid chain of reasoning - if all A are B, and all B have property C, then all A have property C."
  },
  {
    question: "Either it's Monday or Tuesday. It's not Monday. Therefore, it's Tuesday.",
    answer: true,
    explanation: "Valid disjunctive syllogism - in an exclusive either/or, if one is false, the other must be true."
  },
  {
    question: "Some politicians are honest. All honest people tell the truth. Therefore, some politicians tell the truth.",
    answer: true,
    explanation: "Valid reasoning - if some A are B, and all B have property C, then some A have property C."
  },
  {
    question: "If Sarah studies medicine, she will become a doctor. Sarah didn't become a doctor. Therefore, Sarah didn't study medicine.",
    answer: true,
    explanation: "Valid modus tollens - if P then Q, not Q, therefore not P."
  },
  {
    question: "All cats have whiskers. Fluffy has whiskers. Therefore, Fluffy is a cat.",
    answer: false,
    explanation: "This commits the fallacy of affirming the consequent - other animals also have whiskers."
  },
  {
    question: "No vegetarians eat meat. Alice is a vegetarian. Therefore, Alice doesn't eat meat.",
    answer: true,
    explanation: "Valid categorical reasoning - if no A do B, and C is A, then C doesn't do B."
  },
  {
    question: "If the store is closed, then no customers can enter. Some customers entered. Therefore, the store is not closed.",
    answer: true,
    explanation: "Valid modus tollens - if P then Q, not Q (customers entered), therefore not P (store not closed)."
  },
  {
    question: "All teachers are educators. Some educators work at universities. Therefore, some teachers work at universities.",
    answer: false,
    explanation: "Invalid reasoning - we don't know if the educators at universities are specifically teachers."
  },
  {
    question: "Either the lights are on or off. The lights are not off. Therefore, the lights are on.",
    answer: true,
    explanation: "Valid disjunctive syllogism - in a true dichotomy, if one option is false, the other must be true."
  },
  {
    question: "If computers malfunction, work stops. Work didn't stop. Therefore, computers didn't malfunction.",
    answer: true,
    explanation: "Valid modus tollens - if P then Q, not Q, therefore not P."
  },
  {
    question: "All diamonds are valuable. This ring has a diamond. Therefore, this ring is valuable.",
    answer: true,
    explanation: "Valid reasoning - if all A are B, and C contains A, then C has property B."
  },
  {
    question: "Some books are fiction. All fiction contains imagination. Therefore, all books contain imagination.",
    answer: false,
    explanation: "Invalid - we only know some books are fiction, not all books."
  },
  {
    question: "If it snows, schools close. It didn't snow. Therefore, schools didn't close.",
    answer: false,
    explanation: "Fallacy of denying the antecedent - schools could close for other reasons besides snow."
  },
  {
    question: "No fish can survive without water. Goldfish are fish. Therefore, goldfish cannot survive without water.",
    answer: true,
    explanation: "Valid categorical syllogism - if no A can do B, and C are A, then C cannot do B."
  },
  {
    question: "All prime numbers greater than 2 are odd. 17 is a prime number greater than 2. Therefore, 17 is odd.",
    answer: true,
    explanation: "Valid deductive reasoning - if all A have property B, and C is A, then C has property B."
  },
  {
    question: "If Anna speaks French, she can work in Paris. Anna cannot work in Paris. Therefore, Anna doesn't speak French.",
    answer: true,
    explanation: "Valid modus tollens - if P then Q, not Q, therefore not P."
  },
  {
    question: "All mathematicians are logical. Some logical people are professors. Therefore, some mathematicians are professors.",
    answer: false,
    explanation: "Invalid - we don't know if the logical professors are specifically mathematicians."
  },
  {
    question: "No insects are mammals. All bees are insects. Therefore, no bees are mammals.",
    answer: true,
    explanation: "Valid categorical syllogism - if no A are B, and all C are A, then no C are B."
  },
  {
    question: "Either the door is locked or unlocked. The door is locked. Therefore, the door is not unlocked.",
    answer: true,
    explanation: "Valid reasoning - in a true dichotomy, if one is true, the other must be false."
  },
  {
    question: "If David jogs daily, he stays fit. David stays fit. Therefore, David jogs daily.",
    answer: false,
    explanation: "Fallacy of affirming the consequent - David could stay fit through other activities."
  },
  {
    question: "All metals conduct electricity. Copper is a metal. Therefore, copper conducts electricity.",
    answer: true,
    explanation: "Valid deductive reasoning - if all A have property B, and C is A, then C has property B."
  },
  {
    question: "Some cars are electric. All electric vehicles are eco-friendly. Therefore, some cars are eco-friendly.",
    answer: true,
    explanation: "Valid reasoning - if some A are B, and all B are C, then some A are C."
  },
  {
    question: "If the internet is down, emails won't send. Emails are sending. Therefore, the internet is not down.",
    answer: true,
    explanation: "Valid modus tollens - if P then Q, not Q, therefore not P."
  },
  {
    question: "All philosophers think deeply. Socrates thinks deeply. Therefore, Socrates is a philosopher.",
    answer: false,
    explanation: "Fallacy of affirming the consequent - non-philosophers can also think deeply."
  },
  {
    question: "No reptiles are warm-blooded. All lizards are reptiles. Therefore, no lizards are warm-blooded.",
    answer: true,
    explanation: "Valid categorical syllogism - if no A are B, and all C are A, then no C are B."
  },
  {
    question: "Either today is Saturday or Sunday. Today is not Saturday. Therefore, today is Sunday.",
    answer: true,
    explanation: "Valid disjunctive syllogism - either A or B, not A, therefore B."
  },
  {
    question: "If Lisa practices piano, she improves. Lisa doesn't practice piano. Therefore, Lisa doesn't improve.",
    answer: false,
    explanation: "Fallacy of denying the antecedent - Lisa could improve through other means."
  },
  {
    question: "All oceans contain salt water. The Pacific is an ocean. Therefore, the Pacific contains salt water.",
    answer: true,
    explanation: "Valid deductive reasoning - if all A have property B, and C is A, then C has property B."
  },
  {
    question: "Some flowers are roses. All roses have thorns. Therefore, some flowers have thorns.",
    answer: true,
    explanation: "Valid reasoning - if some A are B, and all B have property C, then some A have property C."
  },
  {
    question: "If the battery is dead, the car won't start. The car started. Therefore, the battery is not dead.",
    answer: true,
    explanation: "Valid modus tollens - if P then Q, not Q, therefore not P."
  },
  {
    question: "All triangles have three sides. This shape has three sides. Therefore, this shape is a triangle.",
    answer: false,
    explanation: "Invalid reasoning - other shapes can also have three sides but not be triangles."
  },
  {
    question: "No nocturnal animals are active during the day. Owls are nocturnal animals. Therefore, owls are not active during the day.",
    answer: true,
    explanation: "Valid categorical syllogism - if no A are B, and C are A, then C are not B."
  },
  {
    question: "Either the package arrived or it's delayed. The package didn't arrive. Therefore, it's delayed.",
    answer: true,
    explanation: "Valid disjunctive syllogism - either A or B, not A, therefore B."
  },
  {
    question: "If Mark exercises regularly, he loses weight. Mark doesn't lose weight. Therefore, Mark doesn't exercise regularly.",
    answer: true,
    explanation: "Valid modus tollens - if P then Q, not Q, therefore not P."
  },
  {
    question: "All planets orbit stars. Earth orbits a star. Therefore, Earth is a planet.",
    answer: false,
    explanation: "Fallacy of affirming the consequent - other celestial bodies also orbit stars."
  },
  {
    question: "Some students study hard. All hard-working people succeed. Therefore, some students succeed.",
    answer: false,
    explanation: "Invalid - we don't know if the hard-studying students are the same as hard-working people in general."
  },
  {
    question: "If the alarm rings, everyone evacuates. No one evacuated. Therefore, the alarm didn't ring.",
    answer: true,
    explanation: "Valid modus tollens - if P then Q, not Q, therefore not P."
  },
  {
    question: "All mammals have lungs. Whales have lungs. Therefore, whales are mammals.",
    answer: false,
    explanation: "Fallacy of affirming the consequent - other animals also have lungs."
  },
  {
    question: "No vegetables are meat. Carrots are vegetables. Therefore, carrots are not meat.",
    answer: true,
    explanation: "Valid categorical syllogism - if no A are B, and C are A, then C are not B."
  },
  {
    question: "Either the meeting is today or tomorrow. The meeting is not today. Therefore, the meeting is tomorrow.",
    answer: true,
    explanation: "Valid disjunctive syllogism - either A or B, not A, therefore B."
  },
  {
    question: "If Sarah sleeps 8 hours, she feels rested. Sarah doesn't sleep 8 hours. Therefore, Sarah doesn't feel rested.",
    answer: false,
    explanation: "Fallacy of denying the antecedent - Sarah could feel rested with different amounts of sleep."
  },
  {
    question: "All circles are round. This coin is round. Therefore, this coin is a circle.",
    answer: false,
    explanation: "Fallacy of affirming the consequent - other shapes can also be round."
  }
];

export const LogicSprintTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === "active" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPhase("result");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  const startTest = () => {
    setPhase("active");
    setCurrentPuzzle(0);
    setScore(0);
    setTimeLeft(60);
    setStartTime(Date.now());
  };

  const handleAnswer = (answer: boolean) => {
    if (phase !== "active") return;

    const correct = answer === puzzles[currentPuzzle].answer;
    if (correct) {
      setScore(prev => prev + 1);
    }

    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(prev => prev + 1);
    } else {
      // Reset to first puzzle for continuous play
      setCurrentPuzzle(0);
    }
  };

  const reset = () => {
    setPhase("waiting");
    setCurrentPuzzle(0);
    setScore(0);
    setTimeLeft(60);
    setStartTime(null);
  };

  const getPerformanceMessage = () => {
    const accuracy = score / Math.max(1, currentPuzzle + 1) * 100;
    if (score >= 8) return "🧠 Logic Master! Exceptional reasoning!";
    if (score >= 6) return "⚡ Great Logic! Sharp thinking!";
    if (score >= 4) return "👍 Good Logic! Above average!";
    return "🤔 Keep practicing! Logic improves with time!";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {phase === "waiting" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <Brain className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Ready to challenge your brain?</h3>
          <p className="text-muted-foreground">
            Test your logical reasoning skills - how fast can you solve logic puzzles?
          </p>
          <Button variant="neural" size="lg" onClick={startTest}>
            <Clock className="w-5 h-5" />
            Start Logic Sprint
          </Button>
        </Card>
      )}

      {phase === "active" && (
        <Card className="space-y-6 p-8 bg-black">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Score: {score} | Time: {timeLeft}s
            </div>
            <div className="text-sm text-muted-foreground">
              Puzzle {currentPuzzle + 1}
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Is this logic valid?</h3>
              <p className="text-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                {puzzles[currentPuzzle].question}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                variant="neural"
                size="lg"
                onClick={() => handleAnswer(true)}
              >
                ✓ Valid Logic
              </Button>
              <Button 
                variant="brain"
                size="lg"
                onClick={() => handleAnswer(false)}
              >
                ✗ Invalid Logic
              </Button>
            </div>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>
        </Card>
      )}

      {phase === "result" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <Brain className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-2xl font-bold text-primary">
            {getPerformanceMessage()}
          </h3>
          <div className="space-y-2">
            <p className="text-lg">Final Score: <span className="font-bold text-primary">{score}</span></p>
            <p className="text-muted-foreground">Logic puzzles solved in 60 seconds</p>
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
        <h2 className="text-2xl font-bold text-gradient mb-2">Logic Sprint</h2>
        <p className="text-muted-foreground mb-3">
          Solve logical reasoning puzzles as quickly as possible
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Test your logical reasoning speed and accuracy with formal logic puzzles. Evaluate syllogisms, identify fallacies, and determine valid conclusions under time pressure. This challenges your analytical thinking, deductive reasoning, and ability to spot logical errors - essential for critical thinking and problem-solving.
        </p>
        <div className="mt-4">
          <ShareButtons 
            title="Test Your Logic Skills!"
            description="How fast can you solve logic puzzles under pressure? I just sprinted through logical challenges on NeuroDash - think you can think faster? 🧩⚡"
            showTestIcons
            variant="full"
          />
        </div>
      </div>
    </div>
  );
};