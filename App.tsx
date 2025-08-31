
import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import Scoreboard from './components/Scoreboard';
import GameOverModal from './components/GameOverModal';
import ConfirmationModal from './components/ConfirmationModal';
import Confetti from './components/Confetti';
import LikeButton from './components/LikeButton';
import StartScreen from './components/StartScreen';
import NameInputScreen from './components/NameInputScreen';
import OpponentSelectScreen from './components/OpponentSelectScreen';
import StatsModal from './components/StatsModal';
import ParticleBackground from './components/ParticleBackground';
import DrawAnimation from './components/DrawAnimation';
import SettingsPanel from './components/SettingsPanel';
import { getAIMove } from './services/aiService';
import { audioService } from './services/audioService';
import { statsService } from './services/statsService';
import type { GameMode, Player, Scores, SquareValue, Winner, AIDifficulty, MatchHistoryEntry, Theme } from './types';
import { WINNING_COMBINATIONS, WIN_QUOTES, DRAW_QUOTES } from './constants';


type GameState = 'start' | 'names' | 'opponent' | 'game';

const App: React.FC = () => {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Winner>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scores, setScores] = useState<Scores>({ X: 0, O: 0, draws: 0 });
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [gameOverMessage, setGameOverMessage] = useState<string>('');
  // FIX: Changed from a method call to property access to resolve "not callable" and private access errors.
  const [isSfxMuted, setIsSfxMuted] = useState(audioService.isSfxMuted);
  // FIX: Changed from a method call to property access to resolve "not callable" and private access errors.
  const [isMusicMuted, setIsMusicMuted] = useState(audioService.isMusicMuted);
  const [playerNames, setPlayerNames] = useState({ X: 'Player 1', O: 'Player 2' });
  const [playerAvatars, setPlayerAvatars] = useState({ X: '😀', O: '😎' });
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDrawAnimation, setShowDrawAnimation] = useState(false);
  const [difficulty, setDifficulty] = useState<AIDifficulty>('hard');
  const [gameState, setGameState] = useState<GameState>('start');
  const [matchHistory, setMatchHistory] = useState<MatchHistoryEntry[]>([]);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('purple');

  useEffect(() => {
    setMatchHistory(statsService.getMatchHistory());
    const storedTheme = localStorage.getItem('tictactoe-theme') as Theme | null;
    if(storedTheme) setTheme(storedTheme);
    // FIX: Changed from a method call to property access.
    if (!audioService.isMusicMuted) {
      audioService.playMusic();
    }
  }, []);
  
  useEffect(() => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('tictactoe-theme', theme);
  }, [theme]);

  const checkWinner = useCallback((currentBoard: SquareValue[]): { winner: Player; line: number[] } | null => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a] as Player, line: combination };
      }
    }
    return null;
  }, []);

  const handleSquareClick = (index: number) => {
    if (board[index] || winner || isAiThinking || !gameMode) {
      return;
    }
    
    audioService.playPlayerMoveSound();

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const resetGame = (isFullReset = false) => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setGameOverMessage('');
    setShowConfetti(false);
    setShowDrawAnimation(false);
    if(isFullReset){
      setScores({ X: 0, O: 0, draws: 0 });
      setGameState('start');
    }
  };

  const requestRestart = () => setIsRestartModalOpen(true);
  
  const handleConfirmRestart = () => {
    resetGame(true);
    setPlayerNames({ X: 'Player 1', O: 'Player 2' });
    setPlayerAvatars({ X: '😀', O: '😎' });
    setIsRestartModalOpen(false);
  };

  const handleCancelRestart = () => setIsRestartModalOpen(false);
  
  const handleNamesSet = (names: {X: string, O: string}, avatars: {X: string, O: string}) => {
    setPlayerNames(names);
    setPlayerAvatars(avatars);
    setGameState('opponent');
  }

  const handleOpponentSelect = (mode: GameMode, newDifficulty?: AIDifficulty) => {
    resetGame(true);
    setScores({ X: 0, O: 0, draws: 0 });
    setGameMode(mode);
    if (mode === 'PVA' && newDifficulty) {
      const aiName = `${newDifficulty.charAt(0).toUpperCase() + newDifficulty.slice(1)} AI`;
      setPlayerNames(prev => ({ ...prev, O: aiName }));
      setPlayerAvatars(prev => ({...prev, O: '🤖'}));
      setDifficulty(newDifficulty);
    }
    setGameState('game');
  }

  const handleSfxMuteToggle = () => setIsSfxMuted(audioService.toggleSfxMute());
  const handleMusicMuteToggle = () => setIsMusicMuted(audioService.toggleMusicMute());

  useEffect(() => {
    const gameResult = checkWinner(board);
    if (gameResult) {
      const winnerName = playerNames[gameResult.winner];
      const loserName = playerNames[gameResult.winner === 'X' ? 'O' : 'X'];
      
      if (winnerName !== 'AI' && loserName !== 'AI') {
          statsService.addMatchResult({
              winner: winnerName,
              loser: loserName,
              isDraw: false,
              date: Date.now()
          });
          setMatchHistory(statsService.getMatchHistory());
      }

      setWinner(gameResult.winner);
      setWinningLine(gameResult.line);
      setScores(prev => ({ ...prev, [gameResult.winner]: prev[gameResult.winner] + 1 }));
      setGameOverMessage(WIN_QUOTES[Math.floor(Math.random() * WIN_QUOTES.length)]);
      setShowConfetti(true);
      audioService.playWinSound();
    } else if (board.every(square => square !== null)) {
      statsService.addMatchResult({
          winner: playerNames.X,
          loser: playerNames.O,
          isDraw: true,
          date: Date.now()
      });
      setMatchHistory(statsService.getMatchHistory());

      setWinner('draw');
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      setGameOverMessage(DRAW_QUOTES[Math.floor(Math.random() * DRAW_QUOTES.length)]);
      setShowDrawAnimation(true);
      audioService.playDrawSound();
    }
  }, [board, checkWinner, playerNames]);

  useEffect(() => {
    if (gameMode === 'PVA' && currentPlayer === 'O' && !winner) {
      const makeAIMove = () => {
        setIsAiThinking(true);
        const aiMove = getAIMove(board, difficulty);

        setTimeout(() => {
          if (board[aiMove] === null) {
            audioService.playAIMoveSound();
            handleSquareClick(aiMove);
          }
          setIsAiThinking(false);
        }, 750); 
      };
      
      const timeoutId = setTimeout(makeAIMove, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [currentPlayer, gameMode, winner, board, difficulty, handleSquareClick]);

  const renderGameState = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={() => setGameState('names')} />;
      case 'names':
        return <NameInputScreen onNamesSet={handleNamesSet} />;
      case 'opponent':
        return <OpponentSelectScreen onOpponentSelect={handleOpponentSelect} />;
      case 'game':
        return (
          <>
            <Scoreboard scores={scores} currentPlayer={currentPlayer} playerNames={playerNames} playerAvatars={playerAvatars} />
            <Board 
              board={board} 
              onSquareClick={handleSquareClick} 
              winningLine={winningLine} 
              isAiThinking={isAiThinking}
              currentPlayer={currentPlayer}
              winner={winner}
              playerAvatars={playerAvatars}
            />
            <div className="mt-6 w-full text-center flex justify-center items-center gap-4">
               <button
                onClick={() => setIsStatsModalOpen(true)}
                className="bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl hover:shadow-[var(--accent-shadow)] shadow-[var(--accent-shadow)] backdrop-blur-sm border border-yellow-400/50"
              >
                Stats
              </button>
              <button
                onClick={requestRestart}
                className="bg-red-500/80 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl hover:shadow-red-500/40 shadow-red-500/30 backdrop-blur-sm border border-red-400/50"
              >
                End Game
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 font-poppins relative justify-center">
      <ParticleBackground />
      {showConfetti && winner !== 'draw' && <Confetti />}
      <DrawAnimation isVisible={showDrawAnimation} />
      
      <SettingsPanel 
        theme={theme}
        onThemeChange={setTheme}
        isSfxMuted={isSfxMuted}
        isMusicMuted={isMusicMuted}
        onSfxMuteToggle={handleSfxMuteToggle}
        onMusicMuteToggle={handleMusicMuteToggle}
      />
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-lg mx-auto">
        {renderGameState()}
        {gameState === 'game' && <LikeButton />}
      </div>
      
      {winner && (
        <GameOverModal 
            winner={winner} 
            message={gameOverMessage} 
            onPlayAgain={() => resetGame(false)} 
            playerNames={playerNames}
            playerAvatars={playerAvatars}
        />
      )}
      
      <ConfirmationModal
        isOpen={isRestartModalOpen}
        onConfirm={handleConfirmRestart}
        onCancel={handleCancelRestart}
        title="End Game?"
        message="This will clear your session and return to the main menu. Are you sure?"
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        history={matchHistory}
      />
    </div>
  );
};

export default App;
