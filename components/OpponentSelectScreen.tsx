import React from 'react';
import type { GameMode, AIDifficulty } from '../types';

interface OpponentSelectScreenProps {
  onOpponentSelect: (mode: GameMode, difficulty?: AIDifficulty) => void;
}

const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="animate-fade-in-up w-full max-w-lg">
        {children}
    </div>
);

const OpponentCard: React.FC<{ title: string, description: string, icon: React.ReactNode, onClick: () => void, delay: number, tooltip?: string }> = 
({ title, description, icon, onClick, delay, tooltip }) => (
    <div className="relative group">
        <button
            onClick={onClick}
            style={{ animationDelay: `${delay}ms` }}
            className="w-full bg-[var(--card-bg)] p-4 rounded-lg flex items-center gap-4 transition-all duration-300 transform hover:scale-105 hover:bg-white/20 hover:shadow-2xl border border-[var(--card-border)] animate-fade-up-staggered"
        >
            <div className="text-[var(--accent-color)] p-3 bg-black/20 rounded-lg">{icon}</div>
            <div className="text-left">
                <h3 className="font-bold text-lg text-white">{title}</h3>
                <p className="text-sm text-gray-300">{description}</p>
            </div>
        </button>
        {tooltip && <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{tooltip}</div>}
    </div>
);

const OpponentSelectScreen: React.FC<OpponentSelectScreenProps> = ({ onOpponentSelect }) => {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center bg-[var(--card-bg)] backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-[var(--card-border)] w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Choose Your Opponent</h2>
        <div className="flex flex-col gap-4 w-full">
          <OpponentCard
            title="Player vs Player"
            description="Challenge a friend on the same device."
            icon={<UserGroupIcon />}
            onClick={() => onOpponentSelect('PVP')}
            delay={100}
          />
          <OpponentCard
            title="AI (Easy)"
            description="A casual match, perfect for warming up."
            icon={<CpuChipIcon />}
            onClick={() => onOpponentSelect('PVA', 'easy')}
            delay={200}
            tooltip="It's trying its best, okay?"
          />
          <OpponentCard
            title="AI (Medium)"
            description="A balanced opponent that will put up a fight."
            icon={<CpuChipIcon />}
            onClick={() => onOpponentSelect('PVA', 'medium')}
            delay={300}
            tooltip="Knows a trick or two. Watch out!"
          />
          <OpponentCard
            title="AI (Hard)"
            description="An unbeatable AI. Can you force a draw?"
            icon={<CpuChipIcon />}
            onClick={() => onOpponentSelect('PVA', 'hard')}
            delay={400}
            tooltip="Basically a Tic Tac Toe grandmaster."
          />
        </div>
      </div>
      <style>{`
        @keyframes fade-up-staggered {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up-staggered {
            animation: fade-up-staggered 0.5s ease-out forwards;
            opacity: 0; /* Start hidden */
        }
      `}</style>
    </PageContainer>
  );
};

// SVG Icons
const UserGroupIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
const CpuChipIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M8 8l-2-2m10 10 2 2m-2-10-2 2m2 10-2-2M9 9h6v6H9V9z" /></svg>);

export default OpponentSelectScreen;