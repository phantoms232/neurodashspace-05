import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, VolumeX } from "lucide-react";
import { GameGrid } from "./GameGrid";
interface GridCellData {
  id: number;
  isActive: boolean;
  isClicked: boolean;
}
interface ActivePhaseProps {
  phase: "memorize" | "input";
  level: number;
  lives: number;
  grid: GridCellData[];
  gridSize: number;
  clickedSquares: number[];
  activeSquares: number[];
  onCellClick: (cellId: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}
export const ActivePhase = ({
  phase,
  level,
  lives,
  grid,
  gridSize,
  clickedSquares,
  activeSquares,
  onCellClick,
  isMuted,
  setIsMuted
}: ActivePhaseProps) => {
  return <div className="w-full min-h-[500px] test-area rounded-lg flex flex-col items-center justify-center text-white relative">
      {/* Level indicator with mute button */}
      <div className="absolute top-6 flex justify-between items-center w-full px-6">
        <div className="text-sm text-blue-100">
          Level {level} • {"❤️".repeat(lives)}{"🤍".repeat(3 - lives)}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 text-blue-100 hover:text-white hover:bg-white/10"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </div>
      
      {/* Main content area with fixed positioning */}
      <div className="flex flex-col items-center space-y-8">
        {/* Grid container - always same position */}
        <div className="flex justify-center items-center">
          <GameGrid grid={grid} gridSize={gridSize} phase={phase} onCellClick={onCellClick} isMuted={isMuted} />
        </div>
      </div>

      {/* Status text at bottom */}
      {phase === "input" && <div className="absolute bottom-6 text-sm text-blue-100">
          Selected: {clickedSquares.length} / {activeSquares.length}
        </div>}
    </div>;
};