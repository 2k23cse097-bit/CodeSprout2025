import React, { useState, useEffect, useRef } from 'react';
import type { Scores, Player } from '../types';

interface ScoreboardProps {
  scores: Scores;
  currentPlayer: Player;
  playerNames: { X: string; O: string };
  playerAvatars: { X: string; O: string };
}

const useCountUp = (target: number, duration = 500) => {
  const [count, setCount] = useState(target);
  const frameRef = useRef<number | null>(null);
  const startValueRef = useRef(target);

  useEffect(() => {
    startValueRef.current = count;
    let startTimestamp: number | null = null;
    const end = target;
    const startValue = startValueRef.current;

    const animate = (timestamp: number) => {
      if (startTimestamp === null) startTimestamp = timestamp;
      const progress = timestamp - startTimestamp;
      const percentage = Math.min(progress / duration, 1);
      
      const currentVal = Math.floor(startValue + (end - startValue) * percentage);
      setCount(currentVal);

      if (progress < duration) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if(frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration]);

  return count;
};


const ScoreCard: React.FC<{ label: string; score: number; isActive: boolean; color: string; shadowColor: string; ringColor: string; avatar: string; }> = ({ label, score, isActive, shadowColor, ringColor, avatar }) => {
  const displayedScore = useCountUp(score);
  const [bounce, setBounce] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score > prevScore.current) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 300);
      return () => clearTimeout(timer);
    }
    prevScore.current = score;
  }, [score]);

  const activeClass = isActive
    ? `shadow-lg ${shadowColor} ring-2 ring-offset-2 ring-offset-[var(--background-end)] ${ringColor}`
    : 'bg-[var(--card-bg)] border border-[var(--card-border)]';
  
  return (
    <div className={`flex flex-col items-center justify-between p-2 rounded-lg w-32 h-28 transition-all duration-300 backdrop-blur-sm ${activeClass}`}>
      <div className="flex items-center gap-2 w-full">
        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-lg">{avatar}</div>
        <div className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-[var(--text-secondary)]'}`}>{label}</div>
      </div>
      <div className={`text-4xl font-bold ${bounce ? 'animate-bounce-score' : ''}`}>{displayedScore}</div>
       <style>{`
        @keyframes bounce-score {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-score {
          animation: bounce-score 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

const Scoreboard: React.FC<ScoreboardProps> = ({ scores, currentPlayer, playerNames, playerAvatars }) => {
  return (
    <div className="flex justify-center items-center gap-2 md:gap-4 my-6 w-full">
      <ScoreCard label={playerNames.X} score={scores.X} isActive={currentPlayer === 'X'} color="bg-blue-500/50" shadowColor="shadow-cyan-400/30" ringColor="ring-cyan-300" avatar={playerAvatars.X} />
      <div className="flex flex-col items-center justify-center p-3 rounded-lg w-24 h-20 bg-black/20">
          <div className="text-sm font-semibold text-gray-400">Draws</div>
          <div className="text-3xl font-bold">{scores.draws}</div>
      </div>
      <ScoreCard label={playerNames.O} score={scores.O} isActive={currentPlayer === 'O'} color="bg-purple-500/50" shadowColor="shadow-pink-400/30" ringColor="ring-pink-400" avatar={playerAvatars.O}/>
    </div>
  );
};

export default Scoreboard;
