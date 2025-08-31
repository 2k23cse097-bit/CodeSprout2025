import React, { useState, useEffect } from 'react';

interface NameInputScreenProps {
  onNamesSet: (names: { X: string; O: string }, avatars: { X: string; O: string }) => void;
}

const FUN_NICKNAMES = ["Captain Cross", "Sir Circle", "The X-Factor", "Agent Zero", "The Nought", "TicTacPro"];
const EMOJI_CATEGORIES = {
  'Funny Faces': ['😎', '🤩', '🥳', '😜', '🤯', '😍', '🤗', '😂'],
  'Animals': ['🐱', '🦊', '🐸', '🐼', '🦄', '🦁', '🐧', '🐯'],
  'Fantasy': ['👽', '🤖', '👻', '🎃', '🧙', '🧛', '🦸', '👑'],
  'Objects/Games': ['🎮', '🎲', '🎯', '🏆', '🎤', '🎸', '🎧', '🚀']
};
const ALL_EMOJIS = Object.values(EMOJI_CATEGORIES).flat();


const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="animate-fade-in-up w-full max-w-xl">
        {children}
    </div>
);

const EmojiSelectionGrid: React.FC<{ selected: string, onSelect: (emoji: string) => void }> = ({ selected, onSelect }) => {
    return (
        <div className="w-full h-48 bg-black/20 p-2 rounded-lg overflow-y-auto">
            {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                <div key={category} className="mb-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">{category}</h4>
                    <div className="grid grid-cols-8 gap-1">
                        {emojis.map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => onSelect(emoji)}
                                className={`text-3xl rounded-md p-1 aspect-square flex items-center justify-center transition-all duration-200 hover:bg-white/20 transform hover:scale-110 ${selected === emoji ? 'bg-white/30 ring-2 ring-[var(--accent-color)]' : 'bg-white/10'}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const PlayerPreviewCard: React.FC<{ name: string, avatar: string, label: string }> = ({ name, avatar, label }) => (
    <div className="w-1/2 bg-black/20 p-3 rounded-lg flex flex-col items-center">
        <div className="text-4xl mb-2">{avatar || '?'}</div>
        <div className="text-sm font-semibold text-white truncate w-full text-center">{name || label}</div>
    </div>
);


const NameInputScreen: React.FC<NameInputScreenProps> = ({ onNamesSet }) => {
  const [nameX, setNameX] = useState('');
  const [nameO, setNameO] = useState('');
  const [avatarX, setAvatarX] = useState('😎');
  const [avatarO, setAvatarO] = useState('🐱');

  const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const handleSubmit = () => {
    let finalAvatarX = avatarX;
    let finalAvatarO = avatarO;

    if (finalAvatarX === finalAvatarO) {
        finalAvatarO = getRandomItem(ALL_EMOJIS.filter(e => e !== finalAvatarX));
    }

    onNamesSet({
      X: nameX.trim() || getRandomItem(FUN_NICKNAMES),
      O: nameO.trim() || getRandomItem(FUN_NICKNAMES.filter(n => n !== nameX)),
    }, {
      X: finalAvatarX,
      O: finalAvatarO,
    });
  };
  
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center bg-[var(--card-bg)] backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-[var(--card-border)] w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Your Players</h2>
        
        <div className="flex w-full gap-4 mb-4">
            <PlayerPreviewCard name={nameX} avatar={avatarX} label="Player 1" />
            <PlayerPreviewCard name={nameO} avatar={avatarO} label="Player 2" />
        </div>

        <div className="w-full space-y-4 mb-6">
          {/* Player X */}
          <div className="space-y-2">
            <div className="relative w-full">
              <input
                type="text" id="playerX" value={nameX}
                onChange={(e) => setNameX(e.target.value)}
                className="floating-label-input block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-[var(--text-primary)] shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-transparent focus:ring-2 focus:ring-inset focus:ring-[var(--input-ring-cyan)] sm:text-sm transition-all h-12"
                placeholder="Player 1"
              />
              <label htmlFor="playerX" className="absolute top-3 left-3 text-gray-400 text-sm transition-all duration-300 origin-top-left pointer-events-none">Player 1 Name (X)</label>
            </div>
            <EmojiSelectionGrid selected={avatarX} onSelect={setAvatarX} />
          </div>

          {/* Player O */}
          <div className="space-y-2">
            <div className="relative w-full">
                <input
                    type="text" id="playerO" value={nameO}
                    onChange={(e) => setNameO(e.target.value)}
                    className="floating-label-input block w-full rounded-md border-0 py-2.5 px-3 bg-transparent text-[var(--text-primary)] shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-transparent focus:ring-2 focus:ring-inset focus:ring-[var(--input-ring-purple)] sm:text-sm transition-all h-12"
                    placeholder="Player 2"
                />
                <label htmlFor="playerO" className="absolute top-3 left-3 text-gray-400 text-sm transition-all duration-300 origin-top-left pointer-events-none">Player 2 Name (O)</label>
            </div>
            <EmojiSelectionGrid selected={avatarO} onSelect={setAvatarO} />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl hover:shadow-[var(--accent-shadow)]"
        >
          Continue
        </button>
      </div>
    </PageContainer>
  );
};

export default NameInputScreen;
