import React, { useEffect, useRef } from 'react';
import type { MatchHistoryEntry } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: MatchHistoryEntry[];
}

interface PlayerStats {
    [name: string]: { wins: number; losses: number; draws: number };
}

const processHistory = (history: MatchHistoryEntry[]): PlayerStats => {    
    return history.reduce((acc: PlayerStats, match) => {
        const p1 = match.isDraw ? match.winner : match.winner;
        const p2 = match.isDraw ? match.loser : match.loser;

        if (!acc[p1]) acc[p1] = { wins: 0, losses: 0, draws: 0 };
        if (!acc[p2]) acc[p2] = { wins: 0, losses: 0, draws: 0 };

        if (match.isDraw) {
            acc[p1].draws++;
            acc[p2].draws++;
        } else {
            acc[p1].wins++;
            acc[p2].losses++;
        }
        return acc;
    }, {});
};

const drawWinRateChart = (canvas: HTMLCanvasElement, stats: PlayerStats) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const players = Object.entries(stats).sort((a, b) => b[1].wins - a[1].wins).slice(0, 5); // Top 5
    const totalGames = players.reduce((sum, [, data]) => sum + data.wins + data.losses + data.draws, 0) / 2; // Each game has two players

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = 40;
    const spacing = 20;
    const chartHeight = canvas.height - 40;

    players.forEach(([, data], i) => {
        const winPercentage = (data.wins / (data.wins + data.losses + data.draws)) || 0;
        const barHeight = winPercentage * chartHeight;
        const x = i * (barWidth + spacing) + 30;

        // Draw bar
        const gradient = ctx.createLinearGradient(x, canvas.height - barHeight, x, canvas.height);
        gradient.addColorStop(0, '#fcb045');
        gradient.addColorStop(1, '#ff758c');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight - 20, barWidth, barHeight);
        
        // Draw text (name)
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(players[i][0], x + barWidth / 2, canvas.height - 5);
    });
};

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  const playerStats = processHistory(history);
  const totalGames = history.length;
  const sortedPlayers = Object.entries(playerStats).sort((a,b) => b[1].wins - a[1].wins);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
        drawWinRateChart(canvasRef.current, playerStats);
    }
  }, [isOpen, playerStats]);

  const handleShare = () => {
    const canvas = canvasRef.current;
    if(canvas) {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'tic-tac-toe-stats.png';
        link.click();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[var(--card-bg)] rounded-2xl p-6 text-center shadow-2xl border border-[var(--card-border)] transform transition-all animate-fade-in-up w-11/12 max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-pink-500">
          Player Statistics
        </h2>
        
        <div className="bg-black/20 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-lg mb-2 text-center text-gray-300">Win Rate Chart (Top 5)</h3>
            <canvas ref={canvasRef} width="300" height="150" className="mx-auto"></canvas>
        </div>

        <div className="max-h-60 overflow-y-auto pr-2 bg-black/20 p-2 rounded-lg">
            {sortedPlayers.length > 0 ? (
                <ul className="space-y-2 text-left">
                {sortedPlayers.map(([name, stats]) => (
                    <li key={name} className="flex justify-between items-center p-2 rounded-md bg-black/30">
                        <span className="font-semibold text-white">{name}</span>
                        <div className="flex gap-2 text-xs">
                           <span className="font-bold text-green-400">{stats.wins}W</span>
                           <span className="font-bold text-red-400">{stats.losses}L</span>
                           <span className="font-bold text-gray-400">{stats.draws}D</span>
                        </div>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-gray-400 mt-4">No match history yet. Play some games!</p>
            )}
        </div>
        <div className="flex justify-center gap-4 mt-6">
            <button onClick={handleShare} className="bg-blue-500/80 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                Share
            </button>
            <button onClick={onClose} className="bg-gray-600/80 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
            Close
            </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};

export default StatsModal;