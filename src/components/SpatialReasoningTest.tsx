import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, RotateCcw, Eye, Clock3, SkipForward, Image as ImageIcon, Circle, Square, Triangle, Diamond, Hexagon, Plus, Hash, Target, Heart, type LucideIcon } from "lucide-react";
import { TestShareContainer } from "@/components/TestShareContainer";
import { useTestResults } from "@/hooks/useTestResults";

// Spatial Reasoning & Prediction (memorize then locate)
// Phase 1 (10s): Memorize where each picture is on a 2x3 grid (with Skip option)
// Phase 2: We show numbers 1-6 and a random target picture; user clicks the correct position number
// Scoring: +1 for correct; reaction time captured from question start

type Phase = "waiting" | "memorize" | "question" | "result";
interface Item {
  id: string;
  label: string;
  Icon: LucideIcon;
}
const ALL_ITEMS: Item[] = [{
  id: "circle",
  label: "Circle",
  Icon: Circle
}, {
  id: "square",
  label: "Square",
  Icon: Square
}, {
  id: "triangle",
  label: "Triangle",
  Icon: Triangle
}, {
  id: "diamond",
  label: "Diamond",
  Icon: Diamond
}, {
  id: "hexagon",
  label: "Hexagon",
  Icon: Hexagon
}, {
  id: "plus",
  label: "Plus",
  Icon: Plus
}, {
  id: "hash",
  label: "Hash",
  Icon: Hash
}];
const GRID_POSITIONS = 6; // 2 rows x 3 columns

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const SpatialReasoningTest = () => {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);

  // Grid state
  const [gridItems, setGridItems] = useState<Item[]>([]); // length 6, in position order
  const [targetItem, setTargetItem] = useState<Item | null>(null);
  const [targetPos, setTargetPos] = useState<number | null>(null); // 0..5

  // Timing
  const MEMORIZE_MS_BASE = 10000; // 10s default
  const memorizeMs = useMemo(() => Math.max(3500, MEMORIZE_MS_BASE - (level - 1) * 400), [level]);
  const [timeLeft, setTimeLeft] = useState<number>(memorizeMs);
  const timerRef = useRef<number | null>(null);
  const questionStartRef = useRef<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);

  // Result
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const {
    submitTestResult
  } = useTestResults();
  const formatSeconds = (ms: number) => (ms / 1000).toFixed(2);
  const prepareLevel = () => {
    // pick 6 unique items and randomize their placement
    const choices = shuffle(ALL_ITEMS).slice(0, GRID_POSITIONS);
    const placement = shuffle(choices);
    setGridItems(placement);

    // select the random target from the same set
    const idx = Math.floor(Math.random() * GRID_POSITIONS);
    setTargetItem(placement[idx]);
    setTargetPos(idx);
  };
  const startLevel = () => {
    setIsCorrect(null);
    setReactionTime(null);
    prepareLevel();
    setTimeLeft(memorizeMs);
    setPhase("memorize");
  };

  // Memorize countdown (updates every 50ms for smoothness)
  useEffect(() => {
    if (phase !== "memorize") return;
    const start = performance.now();
    const initial = timeLeft;
    const tick = () => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, initial - elapsed);
      setTimeLeft(remaining);
      if (remaining > 0) {
        timerRef.current = window.setTimeout(tick, 50) as unknown as number;
      } else {
        handleSkipMemorize();
      }
    };
    timerRef.current = window.setTimeout(tick, 50) as unknown as number;
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  const handleSkipMemorize = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPhase("question");
    questionStartRef.current = performance.now();
  };
  const handleAnswer = async (pos: number) => {
    if (phase !== "question" || targetPos == null) return;
    const end = performance.now();
    const rt = Math.round(end - (questionStartRef.current ?? end));
    setReactionTime(rt);
    const correct = pos === targetPos;
    setIsCorrect(correct);
    setPhase("result");
    await submitTestResult({
      test_type: "spatial-reasoning",
      score: correct ? level : Math.max(0, level - 1),
      reaction_time: rt,
      level_reached: level
    });
    if (correct) setLevel(l => l + 1);else setLives(v => v - 1);
  };
  const reset = () => {
    setPhase("waiting");
    setLevel(1);
    setLives(3);
    setGridItems([]);
    setTargetItem(null);
    setTargetPos(null);
    setTimeLeft(memorizeMs);
    setReactionTime(null);
    setIsCorrect(null);
  };
  const next = () => {
    if (lives <= 0) return reset();
    startLevel();
  };
  return <TestShareContainer testName="Spatial Reasoning & Prediction" description="Professional spatial memory assessment with advanced cognitive pattern recognition.">
      <div className="min-h-[600px] flex flex-col items-center justify-center">
        {phase === "waiting" && <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
            <Card className="relative bg-gradient-to-br from-background/95 to-secondary/10 border-primary/20 backdrop-blur-sm">
              <div className="p-12 text-center space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"></div>
                  <div className="relative bg-gradient-to-br from-primary/10 to-purple-500/10 p-6 rounded-2xl border border-primary/20">
                    <Target className="w-16 h-16 mx-auto text-primary animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Spatial Reasoning Assessment
                  </h1>
                  <div className="max-w-md mx-auto space-y-3">
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Professional cognitive evaluation designed to assess spatial memory, pattern recognition, and predictive reasoning abilities.
                    </p>
                    <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-sm text-primary">Assessment Protocol:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Phase 1: Memorize 6 symbol positions (10s)</li>
                        <li>• Phase 2: Identify target symbol location</li>
                        <li>• Measures: Accuracy, reaction time, level progression</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <Button variant="default" size="lg" onClick={startLevel} className="group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Begin Assessment
                </Button>
              </div>
            </Card>
          </div>}

        {phase === "memorize" && <div className="w-full max-w-2xl">
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-background/95 to-secondary/10 border-primary/20 backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 px-4 py-2 rounded-full">
                        <span className="text-sm font-semibold text-primary">Level {level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {Array.from({
                      length: 3
                    }, (_, i) => <Heart key={i} className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-muted-foreground/30'} transition-all duration-300`} />)}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">MEMORIZATION PHASE</div>
                      <div className="text-sm font-medium text-primary">Study the pattern</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 px-4 py-2 rounded-full border border-primary/20">
                      <Clock3 className="w-5 h-5 text-primary inline mr-2" />
                      <span className="text-2xl font-bold tabular-nums text-primary">
                        {formatSeconds(timeLeft)}s
                      </span>
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={handleSkipMemorize} className="border-primary/20 hover:bg-primary/10 group">
                      <SkipForward className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      Skip Phase
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 rounded-2xl blur-sm"></div>
                    <div className="relative grid grid-cols-3 gap-4 max-w-md mx-auto bg-background/50 p-6 rounded-xl border border-primary/10">
                      {gridItems.map((item, idx) => <div key={item.id + idx} className="group relative" style={{
                    animationDelay: `${idx * 100}ms`
                  }}>
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                          <div className="relative bg-gradient-to-br from-secondary/20 to-background/80 border border-primary/10 rounded-xl h-20 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fade-in">
                            <item.Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground/50">
                            {idx + 1}
                          </div>
                        </div>)}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>}

        {phase === "question" && targetItem && <div className="w-full max-w-2xl">
            <Card className="bg-gradient-to-r from-background/95 to-secondary/10 border-primary/20 backdrop-blur-sm">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 px-4 py-2 rounded-full">
                      <span className="text-sm font-semibold text-primary">Level {level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {Array.from({
                    length: 3
                  }, (_, i) => <Heart key={i} className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-muted-foreground/30'} transition-all duration-300`} />)}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">RECALL PHASE</div>
                    <div className="text-sm font-medium text-primary">Select position</div>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 rounded-2xl border border-primary/20 inline-block">
                    <div className="flex items-center justify-center gap-4">
                      <Target className="w-6 h-6 text-primary" />
                      <span className="text-xl font-semibold">Locate this symbol:</span>
                      <div className="bg-background/50 p-3 rounded-xl border border-primary/20">
                        <targetItem.Icon className="w-10 h-10 text-primary animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 blur-sm rounded-none bg-[#130800]"></div>
                  <div className="relative grid grid-cols-3 gap-4 max-w-md mx-auto bg-background/50 p-6 rounded-xl border border-primary/10">
                    {Array.from({
                  length: GRID_POSITIONS
                }, (_, i) => <button key={i} className="group relative h-20 bg-gradient-to-br from-secondary/20 to-background/80 border border-primary/10 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary/30 active:scale-95" onClick={() => handleAnswer(i)} aria-label={`Position ${i + 1}`}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <div className="relative h-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                            {i + 1}
                          </span>
                        </div>
                      </button>)}
                  </div>
                </div>
              </div>
            </Card>
          </div>}

        {phase === "result" && <div className="w-full max-w-lg">
            <Card className="bg-gradient-to-r from-background/95 to-secondary/10 border-primary/20 backdrop-blur-sm">
              <div className="p-8 text-center space-y-6">
                <div className="bg-primary/10 px-4 py-2 rounded-full inline-block">
                  <span className="text-sm font-semibold text-primary">Level {level} Results</span>
                </div>
                
                <div className="space-y-4">
                  <div className={`text-4xl font-bold ${isCorrect ? 'text-emerald-500' : 'text-red-500'} animate-scale-in`}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                    <div className="bg-secondary/20 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Reaction Time</div>
                      <div className="text-lg font-semibold text-primary">{reactionTime ?? "—"} ms</div>
                    </div>
                    <div className="bg-secondary/20 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Lives Remaining</div>
                      <div className="text-lg font-semibold text-primary">{lives}</div>
                    </div>
                  </div>
                  
                  {!isCorrect && lives > 0 && <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        Keep practicing! Spatial memory improves with repetition.
                      </p>
                    </div>}
                </div>
                
                {lives <= 0 ? <div className="space-y-4">
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Assessment Complete</h4>
                      <p className="text-sm text-red-600/80 dark:text-red-400/80">
                        Final Level Reached: <strong>{level}</strong>
                      </p>
                    </div>
                    <Button variant="default" onClick={reset} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 w-full">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      New Assessment
                    </Button>
                  </div> : <div className="flex gap-3 justify-center">
                    <Button variant="default" onClick={next} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 px-6">
                      {isCorrect ? 'Next Level' : 'Retry Level'}
                    </Button>
                    <Button variant="outline" onClick={reset} className="border-primary/20 hover:bg-primary/10">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>}
              </div>
            </Card>
          </div>}
      </div>

      <div className="text-center mt-8 space-y-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Spatial Reasoning & Prediction
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Advanced cognitive assessment measuring spatial working memory, pattern recognition accuracy, and predictive reasoning under time constraints. 
          This professional evaluation tracks reaction times and progressive difficulty adaptation.
        </p>
      </div>
    </TestShareContainer>;
};