import { Play, Pause, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface StaticAudioPlayerProps {
  audioUrl: string;
  title?: string;
  description?: string;
}

export const StaticAudioPlayer = ({ 
  audioUrl, 
  title = "Listen to Article",
  description
}: StaticAudioPlayerProps) => {
  const { 
    isPlaying,
    isLoading,
    currentTime,
    duration,
    playbackRate,
    togglePlayPause,
    stop,
    seek,
    changeSpeed
  } = useAudioPlayer(audioUrl);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleSpeedChange = (value: string) => {
    changeSpeed(parseFloat(value));
  };

  return (
    <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-border">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
            disabled={isLoading || !duration}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={togglePlayPause}
              disabled={isLoading}
              className="w-20"
            >
              {isLoading ? (
                <span className="text-xs">Loading...</span>
              ) : isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  <span className="text-xs">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  <span className="text-xs">Play</span>
                </>
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={stop}
              disabled={isLoading || !isPlaying}
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Speed:</span>
            <Select value={playbackRate.toString()} onValueChange={handleSpeedChange}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="0.75">0.75x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.25">1.25x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};