import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, RotateCcw, Zap, Star, Crown } from "lucide-react";
import { TestShareContainer } from "@/components/TestShareContainer";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type TestPhase = "waiting" | "active" | "finished";

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'normal' | 'bonus' | 'speed' | 'mega';
  points: number;
  animationClass?: string;
  spawnTime: number; // Add spawn time for speed bonus calculation
}

interface HitEffect {
  id: number;
  x: number;
  y: number;
  points: number;
  type: string;
  text?: string; // Add optional text field for custom effect messages
}

export const AimTrainerTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [targets, setTargets] = useState<Target[]>([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isTimerRunningRef = useRef<boolean>(false);
  const { user } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const saveTestResult = async (hits: number, accuracy: number, finalScore: number) => {
    if (!user) return;
    
    try {
      await supabase.from('test_results').insert({
        user_id: user.id,
        test_type: 'aim-trainer',
        score: finalScore,
        accuracy: accuracy,
        duration: duration * 1000,
      });
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };

  const getTargetTypeConfig = () => {
    const rand = Math.random();
    if (rand < 0.05) return { type: 'mega' as const, points: 50, size: 30, color: 'from-yellow-400 to-orange-500', glow: 'shadow-yellow-400/50', icon: '👑' };
    if (rand < 0.15) return { type: 'bonus' as const, points: 20, size: 35, color: 'from-purple-500 to-pink-500', glow: 'shadow-purple-400/50', icon: '⭐' };
    if (rand < 0.25) return { type: 'speed' as const, points: 15, size: 25, color: 'from-cyan-400 to-blue-500', glow: 'shadow-cyan-400/50', icon: '⚡' };
    return { type: 'normal' as const, points: 10, size: 40, color: 'from-red-500 to-red-600', glow: 'shadow-red-400/50', icon: '🎯' };
  };

  const generateTarget = (): Target => {
    if (!containerRef.current) return { 
      id: Date.now() + Math.random(), 
      x: 0, 
      y: 0, 
      size: 50, 
      type: 'normal', 
      points: 10,
      spawnTime: Date.now()
    };
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const config = getTargetTypeConfig();
    const maxX = Math.max(0, containerRect.width - config.size);
    const maxY = Math.max(0, containerRect.height - config.size);
    
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      size: config.size,
      type: config.type,
      points: config.points,
      animationClass: config.type === 'speed' ? 'animate-ping' : config.type === 'mega' ? 'animate-pulse' : '',
      spawnTime: Date.now()
    };
  };

  const startTest = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Prevent multiple timers from starting
    if (isTimerRunningRef.current) {
      return;
    }
    
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setPhase("active");
    setHits(0);
    setMisses(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHitEffects([]);
    setTimeLeft(duration);
    setStartTime(Date.now());
    
    // Generate first target
    setTargets([generateTarget()]);
    
    // Mark timer as running
    isTimerRunningRef.current = true;
    
    // Start countdown timer with robust management
    const startTimerTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTimerTime) / 1000);
      const remainingTime = Math.max(0, duration - elapsedSeconds);
      
      setTimeLeft(remainingTime);
      
      if (remainingTime <= 0) {
        // Clear timer and finish test
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        isTimerRunningRef.current = false;
        setPhase("finished");
        setTargets([]);
        
        // Save results when test finishes
        setTimeout(() => {
          setHits(currentHits => {
            setMisses(currentMisses => {
              setScore(currentScore => {
                const finalAccuracy = currentHits + currentMisses > 0 ? Math.round((currentHits / (currentHits + currentMisses)) * 100) : 0;
                saveTestResult(currentHits, finalAccuracy, currentScore);
                return currentScore;
              });
              return currentMisses;
            });
            return currentHits;
          });
        }, 100);
      }
    }, 1000);
  };

  const createHitEffect = (x: number, y: number, points: number, type: string, text?: string) => {
    const effect: HitEffect = {
      id: Date.now() + Math.random(),
      x: x + 20,
      y: y + 10,
      points,
      type,
      text
    };
    setHitEffects(prev => [...prev, effect]);
    
    // Remove effect after animation
    setTimeout(() => {
      setHitEffects(prev => prev.filter(e => e.id !== effect.id));
    }, 1000);
  };

  const handleTargetHit = (target: Target) => {
    const clickTime = Date.now();
    const reactionTime = clickTime - target.spawnTime;
    
    setHits(prev => prev + 1);
    
    // Update combo (must use current combo value, not state)
    const newCombo = combo + 1;
    setCombo(newCombo);
    setMaxCombo(current => Math.max(current, newCombo));
    
    // Calculate speed bonus (faster = more points)
    let speedBonus = 0;
    if (reactionTime < 300) speedBonus = 15; // Lightning fast
    else if (reactionTime < 500) speedBonus = 10; // Very fast  
    else if (reactionTime < 700) speedBonus = 5; // Fast
    // No bonus for >700ms
    
    // Calculate score with combo multiplier
    const comboMultiplier = Math.min(Math.floor(newCombo / 5) + 1, 3);
    const basePoints = target.points + speedBonus;
    const earnedPoints = basePoints * comboMultiplier;
    
    setScore(prev => prev + earnedPoints);
    
    // Create enhanced hit effect showing speed bonus
    const effectText = speedBonus > 0 ? `+${earnedPoints} (⚡${speedBonus})` : `+${earnedPoints}`;
    createHitEffect(target.x, target.y, earnedPoints, target.type, effectText);
    
    setTargets(prev => prev.filter(t => t.id !== target.id));
    
    // Generate new target with shorter delay for speed targets
    const delay = target.type === 'speed' ? 50 : 100;
    setTimeout(() => {
      if (phase === "active") {
        setTargets([generateTarget()]);
      }
    }, delay);
  };

  const handleMiss = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setMisses(prev => prev + 1);
      setCombo(0); // Reset combo on miss
      
      // Visual feedback for miss
      createHitEffect(
        (e.nativeEvent as MouseEvent).offsetX, 
        (e.nativeEvent as MouseEvent).offsetY, 
        0, 
        'miss', 
        'MISS!'
      );
    }
  };

  const reset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    isTimerRunningRef.current = false;
    setPhase("waiting");
    setTargets([]);
    setHits(0);
    setMisses(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHitEffects([]);
    setTimeLeft(duration);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;
  const targetsPerMinute = startTime ? Math.round((hits / ((Date.now() - startTime) / 60000))) : 0;

  // Debug logging for accuracy calculation
  useEffect(() => {
    console.log(`Accuracy update: hits=${hits}, misses=${misses}, accuracy=${accuracy}%`);
  }, [hits, misses]);

  return (
    <TestShareContainer 
      testName="Aim Trainer Pro"
      description="Test your precision with multi-target challenges! I just scored {score} points on NeuroDash Aim Trainer - think you can beat my aim? 🎯🔥"
    >
      {phase === "waiting" && (
        <Card className="text-center space-y-6 p-8 bg-gradient-to-br from-slate-900/80 to-indigo-900/40 border-2 border-primary/30">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl"></div>
            <Target className="w-16 h-16 mx-auto text-primary relative z-10 animate-pulse" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gradient">🎯 Aim Trainer Pro</h3>
            <p className="text-muted-foreground text-lg">
              Ready for the ultimate aim challenge? Hit different target types for bonus points!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto text-sm">
              <div className="bg-gradient-to-br from-red-900/30 to-red-600/20 rounded-lg p-3 border border-red-500/40">
                <div className="text-2xl">🎯</div>
                <div className="text-red-300 font-medium">Normal</div>
                <div className="text-red-200 text-xs">10 pts</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-600/20 rounded-lg p-3 border border-cyan-500/40">
                <div className="text-2xl">⚡</div>
                <div className="text-cyan-300 font-medium">Speed</div>
                <div className="text-cyan-200 text-xs">15 pts</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-600/20 rounded-lg p-3 border border-purple-500/40">
                <div className="text-2xl">⭐</div>
                <div className="text-purple-300 font-medium">Bonus</div>
                <div className="text-purple-200 text-xs">20 pts</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-600/20 rounded-lg p-3 border border-yellow-500/40">
                <div className="text-2xl">👑</div>
                <div className="text-yellow-300 font-medium">Mega</div>
                <div className="text-yellow-200 text-xs">50 pts</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Build combos for score multipliers! Miss and lose your streak.</div>
              <div className="text-cyan-300">⚡ Speed Bonus: Click faster for up to +15 extra points!</div>
            </div>
          </div>
          <Button variant="neural" size="lg" onClick={startTest} className="hover:scale-105 transform transition-all">
            <Target className="w-5 h-5" />
            Start Aim Challenge
          </Button>
        </Card>
      )}

      {phase === "active" && (
        <div className="space-y-4">
          {/* Enhanced stats display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gradient-to-br from-green-900/20 to-green-600/20 rounded-lg p-3 border border-green-500/30">
              <div className="text-lg font-bold text-green-400">{score}</div>
              <div className="text-xs text-green-300">Score</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-600/20 rounded-lg p-3 border border-purple-500/30">
              <div className="text-lg font-bold text-purple-400">{combo}x</div>
              <div className="text-xs text-purple-300">Combo</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-600/20 rounded-lg p-3 border border-blue-500/30">
              <div className="text-lg font-bold text-blue-400">{accuracy}%</div>
              <div className="text-xs text-blue-300">Accuracy</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/20 to-orange-600/20 rounded-lg p-3 border border-orange-500/30">
              <div className="text-lg font-bold text-orange-400">{timeLeft}s</div>
              <div className="text-xs text-orange-300">Time Left</div>
            </div>
          </div>
          
          <Card 
            ref={containerRef}
            className="relative w-full h-96 bg-gradient-to-br from-slate-900/40 to-indigo-900/20 cursor-crosshair overflow-hidden border-2 border-primary/20"
            onClick={handleMiss}
          >
            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="w-full h-full pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                backgroundSize: '30px 30px'
              }}></div>
            </div>
            
            {/* Targets */}
            {targets.map(target => {
              const config = getTargetTypeConfig();
              const targetConfig = target.type === 'mega' ? { color: 'from-yellow-400 to-orange-500', glow: 'shadow-yellow-400/50', icon: '👑' } :
                                   target.type === 'bonus' ? { color: 'from-purple-500 to-pink-500', glow: 'shadow-purple-400/50', icon: '⭐' } :
                                   target.type === 'speed' ? { color: 'from-cyan-400 to-blue-500', glow: 'shadow-cyan-400/50', icon: '⚡' } :
                                   { color: 'from-red-500 to-red-600', glow: 'shadow-red-400/50', icon: '🎯' };
              
              return (
                <button
                  key={target.id}
                  className={`
                    absolute rounded-full transition-all duration-200 hover:scale-110 
                    bg-gradient-to-br ${targetConfig.color} shadow-lg ${targetConfig.glow} 
                    flex items-center justify-center text-white font-bold border-2 border-white/20
                    ${target.animationClass} hover:shadow-2xl transform-gpu
                  `}
                  style={{
                    left: target.x,
                    top: target.y,
                    width: target.size,
                    height: target.size,
                    fontSize: target.size * 0.3
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTargetHit(target);
                  }}
                >
                  {targetConfig.icon}
                </button>
              );
            })}
            
            {/* Hit effects */}
            {hitEffects.map(effect => (
              <div
                key={effect.id}
                className={`
                  absolute pointer-events-none animate-bounce z-50 font-bold text-lg
                  ${effect.type === 'mega' ? 'text-yellow-400' : 
                    effect.type === 'bonus' ? 'text-purple-400' : 
                    effect.type === 'speed' ? 'text-cyan-400' : 
                    effect.type === 'miss' ? 'text-red-500' : 'text-green-400'}
                `}
                style={{
                  left: effect.x,
                  top: effect.y,
                  animation: 'bounce 0.6s ease-out, fadeOut 1s ease-out forwards'
                }}
              >
                {effect.text || `+${effect.points}`}
                {effect.type !== 'normal' && effect.type !== 'miss' && <span className="text-xs ml-1">✨</span>}
              </div>
            ))}
            
            {/* Combo indicator */}
            {combo > 4 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 animate-pulse">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-full border-2 border-white/30 shadow-lg">
                  <span className="text-white font-bold text-lg">🔥 {combo}x COMBO!</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {phase === "finished" && (
        <Card className="text-center space-y-6 p-8 bg-gradient-to-br from-slate-900/80 to-indigo-900/40 border-2 border-primary/30">
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-gradient">🎯 Test Complete!</h3>
            <div className="text-lg text-muted-foreground">Amazing aim training session!</div>
          </div>
          
          {/* Enhanced results grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-green-900/30 to-green-600/20 rounded-xl p-4 border border-green-500/40">
              <div className="text-3xl font-black text-green-400">{score}</div>
              <div className="text-sm text-green-300 font-medium">Final Score</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-600/20 rounded-xl p-4 border border-purple-500/40">
              <div className="text-3xl font-black text-purple-400">{maxCombo}x</div>
              <div className="text-sm text-purple-300 font-medium">Max Combo</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-600/20 rounded-xl p-4 border border-blue-500/40">
              <div className="text-3xl font-black text-blue-400">{accuracy}%</div>
              <div className="text-sm text-blue-300 font-medium">Accuracy</div>
            </div>
            <div className="bg-gradient-to-br from-red-900/30 to-red-600/20 rounded-xl p-4 border border-red-500/40">
              <div className="text-3xl font-black text-red-400">{hits}</div>
              <div className="text-sm text-red-300 font-medium">Targets Hit</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/30 to-gray-600/20 rounded-xl p-4 border border-gray-500/40">
              <div className="text-3xl font-black text-gray-400">{misses}</div>
              <div className="text-sm text-gray-300 font-medium">Missed</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-orange-600/20 rounded-xl p-4 border border-orange-500/40">
              <div className="text-3xl font-black text-orange-400">{targetsPerMinute}</div>
              <div className="text-sm text-orange-300 font-medium">Targets/min</div>
            </div>
          </div>
          
          {/* Performance rating */}
          <div className="space-y-2">
            {score >= 800 && <div className="text-2xl">🏆 <span className="text-yellow-400 font-bold">LEGENDARY AIM!</span></div>}
            {score >= 600 && score < 800 && <div className="text-2xl">⭐ <span className="text-purple-400 font-bold">EXPERT MARKSMAN!</span></div>}
            {score >= 400 && score < 600 && <div className="text-2xl">🎯 <span className="text-blue-400 font-bold">SHARPSHOOTER!</span></div>}
            {score >= 200 && score < 400 && <div className="text-2xl">🔥 <span className="text-green-400 font-bold">GOOD AIM!</span></div>}
            {score < 200 && <div className="text-2xl">💪 <span className="text-gray-400 font-bold">KEEP PRACTICING!</span></div>}
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button variant="neural" size="lg" onClick={startTest} className="hover:scale-105 transform transition-all">
              <Target className="w-5 h-5" />
              Challenge Again
            </Button>
            <Button variant="brain" size="lg" onClick={reset} className="hover:scale-105 transform transition-all">
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
            <Target className="w-5 h-5 text-primary" />
            <div>
              <h4 className="text-sm font-medium">Install NeuroDash App</h4>
              <p className="text-xs text-muted-foreground">Get faster access to aim training tests</p>
            </div>
          </div>
          <PWAInstallButton />
        </div>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">🎯 Aim Trainer Pro</h2>
        <p className="text-muted-foreground mb-3">
          Master precision shooting with multiple target types and combo scoring!
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Experience the most entertaining aim trainer with 4 unique target types, combo multipliers, and stunning visual effects. Hit normal targets (🎯 10pts), speed targets (⚡ 15pts), bonus targets (⭐ 20pts), and rare mega targets (👑 50pts). Build consecutive hit streaks for score multipliers up to 3x! Perfect for gamers, designers, and anyone wanting to improve mouse precision and hand-eye coordination.
        </p>
      </div>
    </TestShareContainer>
  );
};
