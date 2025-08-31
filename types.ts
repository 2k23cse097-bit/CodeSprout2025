export type Player = 'X' | 'O';
export type SquareValue = Player | null;
export type Winner = Player | 'draw' | null;

export interface Scores {
  X: number;
  O: number;
  draws: number;
}

export type GameMode = 'PVP' | 'PVA' | null;

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface MatchHistoryEntry {
    winner: string;
    loser: string;
    isDraw: boolean;
    date: number;
}

export type Theme = 'purple' | 'neon' | 'sunset';