
import React, { useState, useEffect } from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [title, setTitle] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullTitle = "Welcome to Tic Tac Toe Arena";

  useEffect(() => {
    setTitle(''); // Reset on mount
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullTitle.length) {
        setTitle(prev => prev + fullTitle.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        // Make cursor stop blinking after typing is done
        setTimeout(() => setShowCursor(false), 2000); 
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center w-full min-h-[300px]">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 relative type-container h-20 sm:h-24 flex items-center">
          <span>{title}</span>
          {showCursor && <span className="blinking-cursor">|</span>}
      </h1>
      <p className="text-lg text-gray-300 h-8 transition-opacity duration-500 animate-fade-in-delayed">
          Play. Compete. Conquer.
      </p>
      <button
          onClick={onStart}
          className="mt-8 bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-white font-bold py-3 px-10 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl hover:shadow-[var(--accent-shadow)] animate-fade-in-delayed"
      >
          Start Game
      </button>
      <style>{`
          .type-container {
              display: inline-block;
          }
          @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
          }
          .blinking-cursor {
              animation: blink 1s step-end infinite;
              font-weight: 300;
              margin-left: 0.25rem;
          }
          @keyframes fade-in-delayed {
              0% { opacity: 0; transform: translateY(10px); }
              70% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-delayed {
              animation: fade-in-delayed 4s ease-out forwards;
          }
      `}</style>
    </div>
  );
};

export default StartScreen;
