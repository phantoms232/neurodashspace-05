import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, RotateCcw, Play } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";

type TestPhase = "waiting" | "active" | "finished";
type Emotion = "happy" | "sad" | "angry" | "surprised" | "fearful" | "disgusted" | "neutral" | "excited" | "confused" | "bored" | "embarrassed" | "proud" | "jealous" | "anxious" | "disappointed" | "content" | "frustrated" | "grateful" | "curious";

interface EmotionQuestion {
  id: number;
  emotion: Emotion;
  description: string;
  options: Emotion[];
}

const emotionDescriptions = {
  happy: "😊",
  sad: "😢", 
  angry: "😠",
  surprised: "😲",
  fearful: "😨",
  disgusted: "🤢",
  neutral: "😐",
  excited: "🤩",
  confused: "😕",
  bored: "😴",
  embarrassed: "😳",
  proud: "😤",
  jealous: "😒",
  anxious: "😰",
  disappointed: "😞",
  content: "😌",
  frustrated: "😤",
  grateful: "🙏",
  curious: "🤔"
};

const emotionLabels = {
  happy: "Happy",
  sad: "Sad", 
  angry: "Angry",
  surprised: "Surprised",
  fearful: "Fearful", 
  disgusted: "Disgusted",
  neutral: "Neutral",
  excited: "Excited",
  confused: "Confused",
  bored: "Bored",
  embarrassed: "Embarrassed",
  proud: "Proud",
  jealous: "Jealous",
  anxious: "Anxious",
  disappointed: "Disappointed",
  content: "Content",
  frustrated: "Frustrated",
  grateful: "Grateful",
  curious: "Curious"
};

export const EmotionRecognitionTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [currentQuestion, setCurrentQuestion] = useState<EmotionQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [totalQuestions] = useState(15);
  const [feedback, setFeedback] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<Emotion | null>(null);
  const [usedEmotions, setUsedEmotions] = useState<Emotion[]>([]);

  const playButtonSound = (isCorrect?: boolean) => {
    const audio = new Audio();
    if (isCorrect === true) {
      // Success sound - higher pitch
      audio.src = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuEzO/PhzwKJIPM7eGUQwMZf9v+53M0EQtClOjgqmIKDlms3OOjOjAHeLy9+6N5NAAKjOj58lwnECyJGfzfp1QcFliH/8iWwAcyUw8nkyXFD2wWnCDGjUZZFKU9dLXCKYNXBF7b/H8+WdFTZZMm1DnlAUkUnrAHUc5hEzOHbPWpJJvOjr6+vMLFuJWFsDFQE8QLtjP0N3U9ZK/Q2YU7dGdU7VEuAmSlIqiAWoAFzHt9r4w8Y3Nul4LsZV+8K/NM3wNcv7/1nq3LW5MRLdkqP4vj++PrR7QZ0QZrPfSbh+/mxfAhfODzEp5/QVfOzAF8w3RfSH6uuU5Y7I8O4p+Z4VWFYkGk4ftKyXBWQdA+iqhXTQS7L/RAZCiUIXy7vMrH/D1OGBU9HxzjhJM8Y/n+gLpccJdKDRpQ4DzNw4sQZrPQ4M6LdE7A5mBNqE3tOhEONm3JzPiOV4ZgLQJKUAZe8ykKQRZL3fz1uj+dOwPYcjDPz8cU7B6EKiWLiR3PzOA6iZO5FKGd+zAC2Z1SZl5+8fkdWLK2m8kZgXHLb4QFeLOKkCxsJLwFNr8r+Rvfb5X7LvPGVYzf7Z7/J+X+X3o0CfX7zKFt3YRqI5rq5R6g3LaNhEQ4I+mLfXB7WDFY6H7xnwhJCxCRX/9uHZQ3qmQl9TFcQF2A=`;
      audio.volume = 0.4;
    } else if (isCorrect === false) {
      // Error sound - lower pitch
      audio.src = `data:audio/wav;base64,UklGRlQBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTABAAAAAAEBAAIBAAMBAAQBAAUBAAYBAAcBAAcBAAYBAAQBAAEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE=`;
      audio.volume = 0.3;
    } else {
      // Regular click sound
      audio.src = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuEzO/PhzwKJIPM7eGUQwMZf9v+53M0EQtClOjgqmIKDlms3OOjOjAHeLy9+6N5NAAKjOj58lwnECyJGfzfp1QcFliH/8iWwAcyUw8nkyXFD2wWnCDGjUZZFKU9dLXCKYNXBF7b/H8+WdFTZZMm1DnlAUkUnrAHUc5hEzOHbPWpJJvOjr6+vMLFuJWFsDFQE8QLtjP0N3U9ZK/Q2YU7dGdU7VEuAmSlIqiAWoAFzHt9r4w8Y3Nul4LsZV+8K/NM3wNcv7/1nq3LW5MRLdkqP4vj++PrR7QZ0QZrPfSbh+/mxfAhfODzEp5/QVfOzAF8w3RfSH6uuU5Y7I8O4p+Z4VWFYkGk4ftKyXBWQdA+iqhXTQS7L/RAZCiUIXy7vMrH/D1OGBU9HxzjhJM8Y/n+gLpccJdKDRpQ4DzNw4sQZrPQ4M6LdE7A5mBNqE3tOhEONm3JzPiOV4ZgLQJKUAZe8ykKQRZL3fz1uj+dOwPYcjDPz8cU7B6EKiWLiR3PzOA6iZO5FKGd+zAC2Z1SZl5+8fkdWLK2m8kZgXHLb4QFeLOKkCxsJLwFNr8r+Rvfb5X7LvPGVYzf7Z7/J+X+X3o0CfX7zKFt3YRqI5rq5R6g3LaNhEQ4I+mLfXB7WDFY6H7xnwhJCxCRX/9uHZQ3qmQl9TFcQF2A=`;
      audio.volume = 0.2;
    }
    audio.play().catch(() => {});
  };

  const emotions: Emotion[] = [
    "happy", "sad", "angry", "surprised", "fearful", "disgusted", "neutral",
    "excited", "confused", "bored", "embarrassed", "proud", "jealous", 
    "anxious", "disappointed", "content", "frustrated", "grateful", "curious"
  ];

  const generateQuestion = (): EmotionQuestion => {
    // Get emotions that haven't been used yet, or reset if all used
    const availableEmotions = emotions.filter(e => !usedEmotions.includes(e));
    const emotionsToUse = availableEmotions.length > 0 ? availableEmotions : emotions;
    
    const correctEmotion = emotionsToUse[Math.floor(Math.random() * emotionsToUse.length)];
    
    // Create wrong options from all emotions except the correct one
    const wrongOptions = emotions.filter(e => e !== correctEmotion);
    const shuffledWrong = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 3);
    
    // Combine and shuffle all options
    const allOptions = [correctEmotion, ...shuffledWrong].sort(() => Math.random() - 0.5);
    
    return {
      id: questionNumber,
      emotion: correctEmotion,
      description: emotionDescriptions[correctEmotion],
      options: allOptions
    };
  };

  const startTest = () => {
    setPhase("active");
    setScore(0);
    setQuestionNumber(1);
    setFeedback("");
    setSelectedAnswer(null);
    setUsedEmotions([]);
    setCurrentQuestion(generateQuestion());
  };

  const handleAnswer = (selectedEmotion: Emotion) => {
    if (!currentQuestion) return;
    
    setSelectedAnswer(selectedEmotion);
    const isCorrect = selectedEmotion === currentQuestion.emotion;
    
    // Play sound based on correctness
    playButtonSound(isCorrect);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong! The correct answer was ${emotionLabels[currentQuestion.emotion]}`);
    }

    // Track the used emotion
    setUsedEmotions(prev => [...prev, currentQuestion.emotion]);

    setTimeout(() => {
      if (questionNumber >= totalQuestions) {
        setPhase("finished");
      } else {
        setQuestionNumber(prev => prev + 1);
        setCurrentQuestion(generateQuestion());
        setFeedback("");
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const reset = () => {
    setPhase("waiting");
    setCurrentQuestion(null);
    setQuestionNumber(1);
    setScore(0);
    setFeedback("");
    setSelectedAnswer(null);
    setUsedEmotions([]);
  };

  const getScoreRating = () => {
    const percentage = Math.round((score / totalQuestions) * 100);
    if (percentage >= 90) return "🎭 Emotion Expert! Outstanding empathy!";
    if (percentage >= 80) return "🌟 Excellent emotional intelligence!";
    if (percentage >= 70) return "👍 Good emotional awareness!";
    if (percentage >= 60) return "📈 Decent emotional recognition!";
    return "🎯 Keep practicing your emotional skills!";
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {phase === "waiting" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <Heart className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Ready to challenge your brain?</h3>
          <p className="text-muted-foreground">
            Test your emotional intelligence - how well can you read emotions?
          </p>
          <Button variant="neural" size="lg" onClick={() => { playButtonSound(); startTest(); }}>
            <Play className="w-5 h-5" />
            Start Test
          </Button>
        </Card>
      )}

      {phase === "active" && currentQuestion && (
        <Card className="space-y-6 p-8 bg-black">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              Question {questionNumber} of {totalQuestions}
            </div>
            <div className="text-sm text-success">Score: {score}</div>
          </div>

          <div className="text-center space-y-4">
            <div className="text-lg font-semibold text-primary">
              What emotion does this facial expression show?
            </div>
            
            <div className="text-8xl p-4 bg-muted/20 rounded-lg">
              {currentQuestion.description}
            </div>

            {feedback && (
              <div className="text-lg font-semibold">
                {feedback}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((emotion) => (
              <Button
                key={emotion}
                variant={selectedAnswer === emotion ? "neural" : "brain"}
                onClick={() => handleAnswer(emotion)}
                disabled={feedback !== ""}
                className="p-4 h-auto"
              >
                {emotionLabels[emotion]}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {phase === "finished" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <h3 className="text-2xl font-bold text-gradient">Test Complete!</h3>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">
              {score}/{totalQuestions}
            </div>
            <div className="text-lg text-muted-foreground">
              {Math.round((score / totalQuestions) * 100)}% Accuracy
            </div>
            <div className="text-sm text-muted-foreground">{getScoreRating()}</div>
          </div>

          <div className="text-sm text-muted-foreground">
            Emotional intelligence is key to understanding others and building strong relationships.
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="neural" onClick={() => { playButtonSound(); startTest(); }}>
              <Heart className="w-5 h-5" />
              Try Again
            </Button>
            <Button variant="brain" onClick={() => { playButtonSound(); reset(); }}>
              <RotateCcw className="w-5 h-5" />
              Back to Menu
            </Button>
          </div>
        </Card>
      )}

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">Emotion Recognition</h2>
        <p className="text-muted-foreground mb-3">
          Identify emotions from facial descriptions
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Assess your emotional intelligence by correctly identifying emotions from facial expressions. This test measures your ability to read social cues, understand non-verbal communication, and empathize with others - fundamental skills for relationship building and social interaction.
        </p>
        <div className="mt-4">
          <ShareButtons 
            title="Test Your Emotional Intelligence!"
            description="How well can you read emotions in faces? I just tested my EQ on NeuroDash - think you're more emotionally intelligent? 😊💭"
            showTestIcons
            variant="full"
          />
        </div>
      </div>
    </div>
  );
};