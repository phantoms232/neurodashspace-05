import { useAudioPool } from "@/hooks/useAudioPool";

interface GridCellProps {
  id: number;
  isActive: boolean;
  isClicked: boolean;
  phase: "memorize" | "input";
  onClick: (cellId: number) => void;
  isMuted?: boolean;
}

export const GridCell = ({ id, isActive, isClicked, phase, onClick, isMuted = false }: GridCellProps) => {
  const { playClick } = useAudioPool(isMuted);

  const handleClick = () => {
    if (phase === "input") {
      playClick();
      onClick(id);
    }
  };

  // Emoji list for visual memory
  const EMOJI_LIST = ["🎯", "🚀", "🧠", "🔥", "⭐", "💎", "🌟", "⚡", "🎪", "🎨", "🎭", "🎪", "🚁", "🛸", "🌈", "🦄", "🎸", "🎺", "🎹", "🎵", "🎶", "🎤", "🎧", "🎬", "📱", "💻", "⌚", "📷", "🎮", "🕹️", "🎲", "🃏", "🎊", "🎉"];

  return (
    <button
      className={`
        rounded-lg transition-all duration-200 transform-gpu
        shadow-lg flex items-center justify-center text-lg font-bold
        ${isActive && phase === "memorize" 
          ? "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 scale-95 translate-y-1 shadow-md border-2 border-yellow-400 text-white" 
          : isClicked 
            ? "bg-gradient-to-br from-blue-200 to-blue-400 scale-95 translate-y-1 shadow-md border-2 border-blue-600" 
            : "bg-gradient-to-br from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500"
        }
        ${phase === "input" ? "hover:scale-105 hover:shadow-xl active:scale-95 active:translate-y-1 active:shadow-md" : ""}
        border border-gray-300
      `}
      style={{
        minWidth: '60px',
        minHeight: '60px',
        maxWidth: '60px',
        maxHeight: '60px',
        padding: '0',
        margin: '0',
        boxSizing: 'border-box',
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
      onClick={handleClick}
      disabled={phase !== "input"}
    >
      <span className="drop-shadow-sm">{EMOJI_LIST[id % EMOJI_LIST.length]}</span>
    </button>
  );
};