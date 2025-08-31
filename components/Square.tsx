import React from 'react';
import type { Player, SquareValue } from '../types';

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isWinning: boolean;
  isHoverable: boolean;
  currentPlayer: Player;
  playerAvatars: { X: string; O: string };
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinning, isHoverable, currentPlayer, playerAvatars }) => {
  const baseStyle = "w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-5xl md:text-6xl font-bold rounded-lg transition-all duration-300 ease-in-out shadow-inner relative";
  const emptyStyle = "bg-black/20";
  const hoverStyle = isHoverable && !value ? `hover:bg-black/40 ${currentPlayer === 'X' ? 'hover:shadow-cyan-400/20' : 'hover:shadow-purple-400/20'} hover:shadow-lg cursor-pointer` : "";
  const filledStyle = "bg-black/30 cursor-not-allowed";
  
  let specificStyle = value ? filledStyle : emptyStyle;

  const isDisabled = !!value || !isHoverable;

  const Mark = value === 'X' ? playerAvatars.X : playerAvatars.O;
  const HoverMark = currentPlayer === 'X' ? playerAvatars.X : playerAvatars.O;

  return (
    <button onClick={onClick} className={`${baseStyle} ${specificStyle} ${hoverStyle} group`} disabled={isDisabled}>
       {isHoverable && !value && (
        <span className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl font-bold opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none">
          {HoverMark}
        </span>
      )}
      {value && (
        <div className="absolute inset-0 flex items-center justify-center animate-bounce-pop">
          <div className={`mark-container ${isWinning ? 'animate-bounce-win' : ''}`}>{Mark}</div>
        </div>
      )}
      <style>{`
        @keyframes bounce-pop {
          0% { transform: scale(0.5); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-bounce-pop {
          animation: bounce-pop 0.4s ease-out forwards;
        }
        .mark-container {
          text-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        @keyframes bounce-win {
          0%, 100% { 
            transform: translateY(0) scale(1.1);
            text-shadow: 0 0 15px var(--accent-color), 0 0 25px var(--accent-color);
          }
          50% { 
            transform: translateY(-10px) scale(1.2);
            text-shadow: 0 0 25px var(--accent-shadow), 0 0 40px var(--accent-shadow);
          }
        }
        .animate-bounce-win {
          animation: bounce-win 0.6s ease-in-out infinite;
        }
      `}</style>
    </button>
  );
};

export default Square;
