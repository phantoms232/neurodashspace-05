import { GridCell } from "./GridCell";

interface GridCellData {
  id: number;
  isActive: boolean;
  isClicked: boolean;
}

interface GameGridProps {
  grid: GridCellData[];
  gridSize: number;
  phase: "memorize" | "input";
  onCellClick: (cellId: number) => void;
  isMuted?: boolean;
}

export const GameGrid = ({ grid, gridSize, phase, onCellClick, isMuted = false }: GameGridProps) => {
  const gridPixelSize = gridSize * 60 + (gridSize - 1) * 8; // cells + gaps
  
  return (
    <div className="flex justify-center items-center w-full">
      <div 
        className="grid"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 60px)`,
          gridTemplateRows: `repeat(${gridSize}, 60px)`,
          gap: '8px',
          width: `${gridPixelSize}px`,
          height: `${gridPixelSize}px`,
          position: 'relative'
        }}
      >
        {grid.map((cell) => (
          <GridCell
            key={cell.id}
            id={cell.id}
            isActive={cell.isActive}
            isClicked={cell.isClicked}
            phase={phase}
            onClick={onCellClick}
            isMuted={isMuted}
          />
        ))}
      </div>
    </div>
  );
};