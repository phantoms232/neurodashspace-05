import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, RotateCcw, Play, VolumeX } from "lucide-react";
import { TestShareContainer } from "@/components/TestShareContainer";
import { PWAInstallButton } from "@/components/PWAInstallButton";

type TestPhase = "waiting" | "listening" | "input" | "result";
type SoundType = "beep" | "click" | "chime" | "buzz";

interface Sound {
  type: SoundType;
  frequency: number;
  duration: number;
}

export const AudioMemoryTest = () => {
  const [phase, setPhase] = useState<TestPhase>("waiting");
  const [sequence, setSequence] = useState<Sound[]>([]);
  const [userSequence, setUserSequence] = useState<SoundType[]>([]);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(-1);
  const audioContext = useRef<AudioContext | null>(null);

  const soundTypes: SoundType[] = ["beep", "click", "chime", "buzz"];

  const soundConfigs = {
    beep: {
      frequency: 800,
      duration: 200
    },
    click: {
      frequency: 1200,
      duration: 100
    },
    chime: {
      frequency: 600,
      duration: 300
    },
    buzz: {
      frequency: 200,
      duration: 250
    }
  };

  const initAudioContext = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playSound = (soundType: SoundType): Promise<void> => {
    return new Promise(resolve => {
      initAudioContext();
      if (!audioContext.current) {
        resolve();
        return;
      }

      const config = soundConfigs[soundType];
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);

      oscillator.frequency.setValueAtTime(config.frequency, audioContext.current.currentTime);
      oscillator.type = soundType === "buzz" ? "sawtooth" : "sine";

      gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + config.duration / 1000);

      oscillator.start(audioContext.current.currentTime);
      oscillator.stop(audioContext.current.currentTime + config.duration / 1000);

      setTimeout(resolve, config.duration);
    });
  };

  const generateSequence = (length: number): Sound[] => {
    return Array.from({
      length
    }, () => {
      const type = soundTypes[Math.floor(Math.random() * soundTypes.length)];
      return {
        type,
        ...soundConfigs[type]
      };
    });
  };

  const playSequence = async (sounds: Sound[]) => {
    for (let i = 0; i < sounds.length; i++) {
      setCurrentlyPlaying(i);
      await playSound(sounds[i].type);
      await new Promise(resolve => setTimeout(resolve, 300)); // Gap between sounds
    }
    setCurrentlyPlaying(-1);
  };

  const startLevel = async () => {
    const sequenceLength = Math.min(3 + level - 1, 8); // Start with 3, max 8
    const newSequence = generateSequence(sequenceLength);

    setSequence(newSequence);
    setUserSequence([]);
    setPhase("listening");
    setIsCorrect(null);

    await new Promise(resolve => setTimeout(resolve, 500));
    await playSequence(newSequence);
    setPhase("input");
  };

  const handleSoundInput = async (soundType: SoundType) => {
    // Play the sound for feedback
    await playSound(soundType);

    const newUserSequence = [...userSequence, soundType];
    setUserSequence(newUserSequence);
    
    // Don't automatically check - wait for confirm button
  };

  const confirmSequence = () => {
    checkAnswer(userSequence);
  };

  const deleteLastSound = () => {
    setUserSequence(prev => prev.slice(0, -1));
  };

  const checkAnswer = (userSeq: SoundType[]) => {
    const correct = sequence.every((sound, index) => sound.type === userSeq[index]);
    setIsCorrect(correct);
    if (!correct) {
      setLives(prev => prev - 1);
    }
    setPhase("result");
    setIsConfirmed(false);
  };

  const confirmResult = () => {
    if (isCorrect) {
      setLevel(prev => prev + 1);
    }
    setIsConfirmed(true);
  };

  const reset = () => {
    setPhase("waiting");
    setLevel(1);
    setLives(3);
    setSequence([]);
    setUserSequence([]);
    setIsCorrect(null);
    setIsConfirmed(false);
    setCurrentlyPlaying(-1);
  };

  const replaySequence = async () => {
    if (sequence.length > 0) {
      await playSequence(sequence);
    }
  };

  const getSoundIcon = (soundType: SoundType) => {
    switch (soundType) {
      case "beep":
        return "🔊";
      case "click":
        return "🔉";
      case "chime":
        return "🔔";
      case "buzz":
        return "📳";
      default:
        return "🔊";
    }
  };

  const getSoundColor = (soundType: SoundType) => {
    switch (soundType) {
      case "beep":
        return "bg-primary";
      case "click":
        return "bg-success";
      case "chime":
        return "bg-warning";
      case "buzz":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <TestShareContainer 
      testName="Audio Memory"
      description="How sharp is your hearing memory? I just tested my audio recall on NeuroDash - can you remember sound sequences better? 🔊🎵"
    >
      {phase === "waiting" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <Volume2 className="w-12 h-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Ready to test your audio memory?</h3>
          <p className="text-muted-foreground">
            You'll hear a sequence of different sounds. Listen carefully and then repeat the sequence by clicking the sound buttons.
            You have 3 lives - make them count!
          </p>
          <p className="text-sm text-warning">
            🔊 Make sure your sound is on!
          </p>
          <Button variant="neural" size="lg" onClick={startLevel}>
            <Play className="w-5 h-5" />
            Start Level 1
          </Button>
        </Card>
      )}

      {phase === "listening" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <div className="text-sm text-muted-foreground">Level {level} • {"❤️".repeat(lives)}{"🤍".repeat(3 - lives)}</div>
          <h3 className="text-xl font-semibold">Listen carefully...</h3>
          
          <div className="flex justify-center gap-2">
            {sequence.map((sound, index) => (
              <div
                key={index}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-2xl
                  ${index === currentlyPlaying ? `${getSoundColor(sound.type)} animate-pulse scale-110` : "bg-muted/20"}
                  transition-all duration-200
                `}
              >
                {getSoundIcon(sound.type)}
              </div>
            ))}
          </div>
        </Card>
      )}

      {phase === "input" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <div className="text-sm text-muted-foreground">Level {level} • {"❤️".repeat(lives)}{"🤍".repeat(3 - lives)}</div>
          <h3 className="text-lg font-semibold">Repeat the sequence</h3>
          
          <div className="flex justify-center gap-2 mb-4">
            {sequence.map((_, index) => (
              <div
                key={index}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${index < userSequence.length ? `${getSoundColor(userSequence[index])} text-white` : "bg-muted/20"}
                `}
              >
                {index < userSequence.length ? getSoundIcon(userSequence[index]) : "?"}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {soundTypes.map(soundType => (
              <Button
                key={soundType}
                variant="brain"
                onClick={() => handleSoundInput(soundType)}
                className={`p-4 h-auto ${getSoundColor(soundType)} hover:scale-105`}
              >
                <span className="text-2xl mr-2">{getSoundIcon(soundType)}</span>
                {soundType.charAt(0).toUpperCase() + soundType.slice(1)}
              </Button>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="ghost" onClick={replaySequence} size="sm" className="bg-purple-900 hover:bg-purple-800">
              <Volume2 className="w-4 h-4 mr-2" />
              Replay Sequence
            </Button>
            
            {userSequence.length > 0 && (
              <Button variant="destructive" onClick={deleteLastSound} size="sm">
                Delete Last
              </Button>
            )}
            
            {userSequence.length === sequence.length && (
              <Button variant="neural" onClick={confirmSequence} size="sm">
                Confirm
              </Button>
            )}
          </div>
        </Card>
      )}

      {phase === "result" && (
        <Card className="text-center space-y-4 p-8 bg-black">
          <div className="text-sm text-muted-foreground">Level {level} • {"❤️".repeat(lives)}{"🤍".repeat(3 - lives)}</div>
          <h3 className={`text-2xl font-bold ${isCorrect ? 'text-success' : 'text-destructive'}`}>
            {isCorrect ? "Perfect! 🎵" : lives <= 0 ? "Game Over! 🎶" : "Not quite 🎶"}
          </h3>
          
          <div className="space-y-2">
            <div>Correct sequence:</div>
            <div className="flex justify-center gap-1">
              {sequence.map((sound, index) => (
                <span key={index} className="text-lg">
                  {getSoundIcon(sound.type)}
                </span>
              ))}
            </div>
            <div>Your sequence:</div>
            <div className="flex justify-center gap-1">
              {userSequence.map((soundType, index) => (
                <span key={index} className="text-lg">
                  {getSoundIcon(soundType)}
                </span>
              ))}
            </div>
          </div>

          {isCorrect ? (
            <div className="space-y-2">
              {!isConfirmed ? (
                <>
                  <p className="text-success">Great ear!</p>
                  <Button variant="neural" onClick={confirmResult}>
                    Confirm & Continue
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-success">Moving to level {level}</p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="neural" onClick={startLevel}>
                      Next Level ({Math.min(3 + level - 1, 8)} sounds)
                    </Button>
                    <Button variant="brain" onClick={reset}>
                      Restart
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                {lives <= 0 ? `Game Over! You reached level ${level}` : `You reached level ${level}`}
              </p>
              <div className="flex gap-3 justify-center">
                {lives > 0 ? (
                  <Button variant="neural" onClick={startLevel}>
                    Try Level {level} Again
                  </Button>
                ) : null}
                <Button variant="brain" onClick={reset}>
                  <RotateCcw className="w-5 h-5" />
                  Start Over
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* PWA Install Reminder */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-primary" />
            <div>
              <h4 className="text-sm font-medium">Install NeuroDash App</h4>
              <p className="text-xs text-muted-foreground">Get faster access to audio memory tests</p>
            </div>
          </div>
          <PWAInstallButton />
        </div>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">Audio Memory</h2>
        <p className="text-muted-foreground mb-3">
          Listen to the sound sequence and repeat it back
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Challenge your auditory memory by memorizing and reproducing sequences of different sounds. This test evaluates your ability to process, store, and recall audio information - crucial for music, language learning, and following complex verbal instructions.
        </p>
      </div>
    </TestShareContainer>
  );
};