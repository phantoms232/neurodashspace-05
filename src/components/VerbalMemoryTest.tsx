import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Type, RotateCcw, Play, Book } from "lucide-react";
import { TestShareContainer } from "@/components/TestShareContainer";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
type TestPhase = "waiting" | "active" | "finished";
const wordBank = ["apple", "banana", "computer", "elephant", "guitar", "happiness", "justice", "keyboard", "mountain", "ocean", "painting", "question", "rainbow", "sunshine", "telescope", "umbrella", "victory", "whisper", "mystery", "freedom", "journey", "courage", "wisdom", "adventure", "friendship", "beautiful", "creative", "diamond", "energy", "fantastic", "growth", "harmony", "inspiration", "knowledge", "laughter", "magnificent", "nature", "opportunity", "peaceful", "quantum", "radiant", "strength", "triumph", "universe", "valuable", "wonderful", "excellence", "zenith", "brilliant", "champion", "discovery", "exceptional", "fabulous", "gorgeous", "incredible", "joyful", "kindness", "luminous", "marvelous", "outstanding", "positive", "quality", "remarkable", "spectacular", "tremendous", "unique", "vibrant", "wonderful", "extraordinary", "amazing", "brilliant"];
export const VerbalMemoryTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [currentWord, setCurrentWord] = useState("");
  const [seenWords, setSeenWords] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wordHistory, setWordHistory] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const usedWords = useRef<Set<string>>(new Set());
  const { user } = useAuth();

  const saveTestResult = async (finalScore: number) => {
    if (!user) return;
    
    try {
      await supabase.from('test_results').insert({
        user_id: user.id,
        test_type: 'verbal-memory',
        score: finalScore,
      });
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };
  const getRandomWord = (): string => {
    const availableWords = wordBank.filter(word => !usedWords.current.has(word));
    if (availableWords.length === 0) {
      // Reset if we've used all words
      usedWords.current.clear();
      return wordBank[Math.floor(Math.random() * wordBank.length)];
    }
    return availableWords[Math.floor(Math.random() * availableWords.length)];
  };
  const getNextWord = (): string => {
    // 30% chance to repeat a word we've seen before
    if (seenWords.size > 0 && Math.random() < 0.3) {
      const seenArray = Array.from(seenWords);
      return seenArray[Math.floor(Math.random() * seenArray.length)];
    }
    // 70% chance to show a new word
    return getRandomWord();
  };
  const startTest = () => {
    setPhase("active");
    setScore(0);
    setLives(3);
    setSeenWords(new Set());
    setWordHistory([]);
    setFeedback("");
    usedWords.current.clear();
    const firstWord = getRandomWord();
    setCurrentWord(firstWord);
    usedWords.current.add(firstWord);
  };
  const handleChoice = (isSeen: boolean) => {
    const wasActuallySeen = seenWords.has(currentWord);
    const isCorrect = isSeen === wasActuallySeen;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback("✅ Correct!");
    } else {
      setLives(prev => prev - 1);
      setFeedback(`❌ Wrong! This word was ${wasActuallySeen ? 'SEEN' : 'NEW'}`);
    }

    // Add current word to seen words if it's new
    if (!wasActuallySeen) {
      setSeenWords(prev => new Set([...prev, currentWord]));
    }
    setWordHistory(prev => [...prev, currentWord]);

    // Check if game should end
    if (!isCorrect && lives <= 1) {
      setPhase("finished");
      saveTestResult(score);
      return;
    }

    // Get next word after a short delay
    setTimeout(() => {
      setFeedback("");
      const nextWord = getNextWord();
      setCurrentWord(nextWord);

      // Add to used words if it's truly new
      if (!seenWords.has(nextWord)) {
        usedWords.current.add(nextWord);
      }
    }, 1000);
  };
  const reset = () => {
    setPhase("waiting");
    setCurrentWord("");
    setSeenWords(new Set());
    setScore(0);
    setLives(3);
    setWordHistory([]);
    setFeedback("");
    usedWords.current.clear();
  };
  const getScoreRating = () => {
    if (lives <= 0) return `💀 Game Over! Final score: ${score}`;
    if (score >= 50) return "🧠 Memory Master! Incredible performance!";
    if (score >= 30) return "🌟 Excellent memory! Well done!";
    if (score >= 20) return "👍 Good memory skills!";
    if (score >= 10) return "📈 Not bad! Keep practicing!";
    return "🎯 Room for improvement! Try again!";
  };
  return <TestShareContainer testName="Verbal Memory" description="How good is your word memory? I just tested my verbal recognition skills on NeuroDash - can you remember words better? 📚🧠">
      {phase === "waiting" && <Card className="text-center space-y-4 p-8 py-[43px] my-[23px] bg-black">
          <Type className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Ready to test your word memory?</h3>
          <p className="text-muted-foreground">
            You'll see words one by one. Click "SEEN" if you've seen the word before in this test, 
            or "NEW" if it's the first time you're seeing it.
          </p>
          <Button variant="neural" size="lg" onClick={startTest}>
            <Play className="w-5 h-5" />
            Start Test
          </Button>
        </Card>}

      {phase === "active" && <Card className="text-center space-y-6 p-8 bg-black">
          <div className="flex justify-between items-center text-sm">
            <span className="text-success">Score: {score}</span>
            <span className="text-destructive">{"❤️".repeat(lives)}{"🤍".repeat(3 - lives)}</span>
          </div>

          <div className="space-y-4">
            <div className="text-4xl font-bold text-primary min-h-[60px] flex items-center justify-center">
              {currentWord}
            </div>
            
            {feedback && <div className="text-lg font-semibold">
                {feedback}
              </div>}
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="destructive" size="lg" onClick={() => handleChoice(true)} disabled={feedback !== ""}>
              SEEN
            </Button>
            <Button variant="neural" size="lg" onClick={() => handleChoice(false)} disabled={feedback !== ""}>
              NEW
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Words shown: {wordHistory.length} • Unique words: {seenWords.size}
          </div>
        </Card>}

      {phase === "finished" && <Card className="text-center space-y-4 p-8 bg-black">
          <h3 className="text-2xl font-bold text-gradient">Test Complete!</h3>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">{score}</div>
            <div className="text-lg text-muted-foreground">Words Remembered</div>
            <div className="text-sm text-muted-foreground">{getScoreRating()}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-sm">
            <div>
              <div className="font-semibold">Total Words</div>
              <div className="text-muted-foreground">{wordHistory.length}</div>
            </div>
            <div>
              <div className="font-semibold">Unique Words</div>
              <div className="text-muted-foreground">{seenWords.size}</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="neural" onClick={startTest}>
              <Type className="w-5 h-5" />
              Try Again
            </Button>
            <Button variant="brain" onClick={reset}>
              <RotateCcw className="w-5 h-5" />
              Back to Menu
          </Button>
          </div>
        </Card>}

      {/* PWA Install Reminder */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="w-5 h-5 text-primary" />
            <div>
              <h4 className="text-sm font-medium">Install NeuroDash App</h4>
              <p className="text-xs text-muted-foreground">Get faster access to verbal memory tests</p>
            </div>
          </div>
          <PWAInstallButton />
        </div>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">Verbal Memory</h2>
        <p className="text-muted-foreground mb-3">
          Identify if you've seen each word before
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Test your verbal recognition memory by identifying whether words have been shown before in the sequence. This evaluates your ability to encode, store, and retrieve verbal information - fundamental for vocabulary learning, reading comprehension, and remembering names and conversations.
        </p>
      </div>
    </TestShareContainer>;
};