import React, { useRef, useEffect } from 'react';
import Square from './Square';
import { WINNING_COMBINATIONS } from '../constants';
import type { SquareValue, Player, Winner } from '../types';

interface BoardProps {
  board: SquareValue[];
  onSquareClick: (index: number) => void;
  winningLine: number[] | null;
  isAiThinking: boolean;
  currentPlayer: Player;
  winner: Winner;
  playerAvatars: { X: string; O: string };
}

const findWinningCombinationIndex = (line: number[] | null): number => {
    if (!line) return -1;
    const lineStr = JSON.stringify([...line].sort());
    return WINNING_COMBINATIONS.findIndex(c => JSON.stringify(c) === lineStr);
};

const WINNING_LINE_STYLES: React.CSSProperties[] = [
    // Horizontal lines
    { top: '16.66%', left: '5%', width: '90%', height: '6px' },
    { top: '50%', left: '5%', width: '90%', height: '6px', transform: 'translateY(-50%)' },
    { top: '83.33%', left: '5%', width: '90%', height: '6px' },
    // Vertical lines
    { left: '16.66%', top: '5%', height: '90%', width: '6px' },
    { left: '50%', top: '5%', height: '90%', width: '6px', transform: 'translateX(-50%)' },
    { left: '83.33%', top: '5%', height: '90%', width: '6px' },
    // Diagonal lines
    { top: '50%', left: '50%', width: '120%', height: '6px', transform: 'translate(-50%, -50%) rotate(45deg)' },
    { top: '50%', left: '50%', width: '120%', height: '6px', transform: 'translate(-50%, -50%) rotate(-45deg)' },
];

const WinningLine: React.FC<{ winningLine: number[] | null }> = ({ winningLine }) => {
    const winningComboIndex = findWinningCombinationIndex(winningLine);
    if (winningComboIndex < 0) return null;

    const style = WINNING_LINE_STYLES[winningComboIndex];

    return (
        <div 
            className="absolute bg-[var(--accent-color)] rounded-full animate-draw-line"
            style={style}
        >
            <style>{`
                @keyframes draw-line {
                    from { transform: ${style.transform || 'none'} scaleX(0); }
                    to { transform: ${style.transform || 'none'} scaleX(1); }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 15px var(--accent-color), 0 0 25px var(--accent-color); }
                    50% { box-shadow: 0 0 25px var(--accent-shadow), 0 0 40px var(--accent-shadow); }
                }
                .animate-draw-line {
                    animation: draw-line 0.5s ease-out forwards, pulse-glow 1.5s infinite 0.5s;
                }
            `}</style>
        </div>
    );
};


const Board: React.FC<BoardProps> = ({ board, onSquareClick, winningLine, isAiThinking, currentPlayer, winner, playerAvatars }) => {
  const isGameActive = !winner;
  const cursorClass = isAiThinking ? 'cursor-wait' : (isGameActive ? '' : 'cursor-not-allowed');
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const boardEl = boardRef.current;
    if (!boardEl || !isGameActive || isAiThinking) return;

    const handleMouseMove = (e: MouseEvent) => {
        const rect = boardEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        boardEl.style.setProperty('--mouse-x', `${x}px`);
        boardEl.style.setProperty('--mouse-y', `${y}px`);
    };

    boardEl.addEventListener('mousemove', handleMouseMove);
    return () => boardEl.removeEventListener('mousemove', handleMouseMove);
  }, [isGameActive, isAiThinking]);

  return (
    <div 
        ref={boardRef}
        className={`relative grid grid-cols-3 gap-3 p-3 bg-[var(--card-bg)] rounded-2xl shadow-2xl backdrop-blur-lg border border-[var(--card-border)] ${cursorClass} group/board`}
    >
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover/board:opacity-100"
        style={{
            background: `radial-gradient(400px at var(--mouse-x) var(--mouse-y), rgba(252, 176, 69, 0.15), transparent 80%)`
        }}
      />
      {board.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isWinning={winningLine?.includes(index) ?? false}
          isHoverable={isGameActive && !isAiThinking}
          currentPlayer={currentPlayer}
          playerAvatars={playerAvatars}
        />
      ))}
      <WinningLine winningLine={winningLine} />
       {isAiThinking && (
         <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl z-20">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-[var(--accent-color)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="mt-2 text-sm font-semibold text-white/80">AI is thinking...</span>
            </div>
         </div>
       )}
    </div>
  );
};

export default Board;
