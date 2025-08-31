import type { MatchHistoryEntry } from '../types';

const HISTORY_KEY = 'tictactoe-match-history';

class StatsService {
    
    getMatchHistory(): MatchHistoryEntry[] {
        try {
            const storedHistory = localStorage.getItem(HISTORY_KEY);
            return storedHistory ? JSON.parse(storedHistory) : [];
        } catch (error) {
            console.error("Could not parse match history from localStorage", error);
            return [];
        }
    }

    addMatchResult(result: MatchHistoryEntry) {
        // Don't log matches against AI
        if (result.loser.toLowerCase().includes('ai')) {
            return;
        }

        const history = this.getMatchHistory();
        history.unshift(result); // Add to the beginning
        
        try {
            // Keep history to a reasonable size
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
        } catch (error) {
            console.error("Could not save match history to localStorage", error);
        }
    }
}

export const statsService = new StatsService();