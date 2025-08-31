import type { SquareValue, Player, AIDifficulty } from '../types';
import { WINNING_COMBINATIONS } from '../constants';

const AI_PLAYER: Player = 'O';
const HUMAN_PLAYER: Player = 'X';

const checkWinner = (board: SquareValue[], player: Player): boolean => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }
  return false;
};

const isBoardFull = (board: SquareValue[]): boolean => {
  return board.every(square => square !== null);
};

// --- Minimax for Hard Difficulty ---
const minimax = (board: SquareValue[], isMaximizing: boolean): number => {
  if (checkWinner(board, AI_PLAYER)) return 10;
  if (checkWinner(board, HUMAN_PLAYER)) return -10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = AI_PLAYER;
        const score = minimax(board, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = HUMAN_PLAYER;
        const score = minimax(board, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const getHardMove = (board: SquareValue[]): number => {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = AI_PLAYER;
      const score = minimax([...board], false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
};

// --- Logic for Easy Difficulty ---
const getEasyMove = (board: SquareValue[]): number => {
  const emptySquares = board.map((sq, i) => (sq === null ? i : null)).filter(i => i !== null);
  if (emptySquares.length > 0) {
    return emptySquares[Math.floor(Math.random() * emptySquares.length)] as number;
  }
  return -1;
};

// --- Logic for Medium Difficulty ---
const getMediumMove = (board: SquareValue[]): number => {
    const emptySquares = board.map((sq, i) => sq === null ? i : -1).filter(i => i !== -1);
    
    // 1. Check if AI can win
    for (const move of emptySquares) {
        const nextBoard = [...board];
        nextBoard[move] = AI_PLAYER;
        if (checkWinner(nextBoard, AI_PLAYER)) {
            return move;
        }
    }

    // 2. Check if player can win and block
    for (const move of emptySquares) {
        const nextBoard = [...board];
        nextBoard[move] = HUMAN_PLAYER;
        if (checkWinner(nextBoard, HUMAN_PLAYER)) {
            return move;
        }
    }

    // 3. Take a random available spot
    return getEasyMove(board);
};


export const getAIMove = (board: SquareValue[], difficulty: AIDifficulty): number => {
  switch(difficulty) {
    case 'hard':
        return getHardMove(board);
    case 'medium':
        return getMediumMove(board);
    case 'easy':
    default:
        return getEasyMove(board);
  }
};