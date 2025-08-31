import React, { useState } from 'react';
import type { Winner } from '../types';

interface GameOverModalProps {
  winner: Winner;
  message: string;
  onPlayAgain: () => void;
  playerNames: { X: string; O: string };
  playerAvatars: { X: string; O: string };
}

const ChampionBadge: React.FC = () => (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold px-4 py-1 rounded-full text-sm shadow-lg animate-fade-in-down">
        CHAMPION
        <style>{`
            @keyframes fade-in-down {
                from { opacity: 0; transform: translate(-50%, -20px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
            .animate-fade-in-down { animation: fade-in-down 0.5s 0.2s ease-out backwards; }
        `}</style>
    </div>
);

const RematchAnimation: React.FC<{ avatars: { X: string, O: string } }> = ({ avatars }) => (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="relative w-40 h-20">
            <div className="absolute text-6xl animate-rematch-left">{avatars.X}</div>
            <div className="absolute text-6xl animate-rematch-right">{avatars.O}</div>
        </div>
        <style>{`
            @keyframes rematch-left {
                0% { left: -50px; opacity: 0; transform: rotate(-30deg); }
                40% { left: 30px; opacity: 1; transform: rotate(15deg); }
                60% { left: 20px; transform: rotate(-5deg); }
                80% { left: 30px; transform: rotate(5deg); }
                100% { left: -100px; opacity: 0; }
            }
            @keyframes rematch-right {
                0% { right: -50px; opacity: 0; transform: rotate(30deg); }
                40% { right: 30px; opacity: 1; transform: rotate(-15deg); }
                60% { right: 20px; transform: rotate(5deg); }
                80% { right: 30px; transform: rotate(-5deg); }
                100% { right: -100px; opacity: 0; }
            }
            .animate-rematch-left { animation: rematch-left 1.5s ease-in-out forwards; }
            .animate-rematch-right { animation: rematch-right 1.5s ease-in-out forwards; }
        `}</style>
    </div>
);

const GameOverModal: React.FC<GameOverModalProps> = ({ winner, message, onPlayAgain, playerNames, playerAvatars }) => {
  const [isRematching, setIsRematching] = useState(false);
  
  if (!winner) return null;

  const handleRematchClick = () => {
    setIsRematching(true);
    setTimeout(() => {
        onPlayAgain();
    }, 1500);
  };

  const winnerName = winner === 'X' ? playerNames.X : playerNames.O;
  const title = winner === 'draw' ? "It's a Draw!" : `${winnerName} Wins!`;
  const titleColor = winner === 'draw' ? 'text-yellow-400' : 'text-[var(--accent-color)]';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-[var(--card-bg)] rounded-2xl p-8 text-center shadow-2xl border border-[var(--card-border)] transform transition-all animate-fade-in-up w-11/12 max-w-sm overflow-hidden">
        {isRematching && <RematchAnimation avatars={playerAvatars} />}
        {winner !== 'draw' && <ChampionBadge />}
        <h2 className={`text-4xl font-bold mb-2 ${titleColor}`}>
          {title}
        </h2>
        <p className="text-[var(--text-secondary)] mb-6 text-sm italic">"{message}"</p>
        <button
          onClick={handleRematchClick}
          disabled={isRematching}
          className="bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl hover:shadow-[var(--accent-shadow)] disabled:bg-gray-500 disabled:scale-100 disabled:cursor-not-allowed"
        >
          <span className={`inline-block mr-2 ${!isRematching ? 'animate-shake-emoji' : ''}`}>🤝</span>
          Rematch
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes shake-emoji {
            0%, 100% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(-15deg) scale(1.1); }
            75% { transform: rotate(15deg) scale(1.1); }
        }
        .animate-shake-emoji {
            animation: shake-emoji 0.6s ease-in-out;
            animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default GameOverModal;
