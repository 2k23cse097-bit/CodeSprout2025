import React from 'react';
import type { Theme } from '../types';

interface SettingsPanelProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  isSfxMuted: boolean;
  isMusicMuted: boolean;
  onSfxMuteToggle: () => void;
  onMusicMuteToggle: () => void;
}

// SVG Icons
const SpeakerOnIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
  </svg>
);
const SpeakerOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6.375a1.5 1.5 0 1 0-3 0m-1.5 8.25a1.5 1.5 0 1 0 0-3m-3.75 1.5a1.5 1.5 0 1 0 3 0m6-1.5a1.5 1.5 0 1 0-3 0m-1.5 8.25a1.5 1.5 0 1 0 0-3m0 3a1.5 1.5 0 1 0 0-3m-3.75 1.5a1.5 1.5 0 1 0 3 0m-6-6.375a1.5 1.5 0 1 0-3 0m-1.5 8.25a1.5 1.5 0 1 0 0-3m0 3a1.5 1.5 0 1 0 0-3" />
  </svg>
);
const MusicNoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V7.5A2.25 2.25 0 0 0 19.5 5.25v1.5a2.25 2.25 0 0 0-2.25 2.25v3.75" />
  </svg>
);

const THEMES: { id: Theme; label: string; colors: string[] }[] = [
  { id: 'purple', label: 'Purple Mist', colors: ['#4e54c8', '#8f94fb'] },
  { id: 'neon', label: 'Neon Glow', colors: ['#0f0c29', '#00f2ff'] },
  { id: 'sunset', label: 'Sunset', colors: ['#ff7e5f', '#d9534f'] },
];

const ThemeButton: React.FC<{ themeItem: typeof THEMES[0]; isActive: boolean; onClick: () => void; }> = ({ themeItem, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-8 h-8 rounded-full transition-transform duration-200 transform hover:scale-110 focus:outline-none ${isActive ? 'ring-2 ring-offset-2 ring-offset-[var(--card-bg)] ring-white' : ''}`}
        style={{ background: `linear-gradient(45deg, ${themeItem.colors[0]}, ${themeItem.colors[1]})` }}
        aria-label={`Select ${themeItem.label} theme`}
    />
);

const SettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-2 p-2 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-2">
        {THEMES.map(themeItem => (
            <ThemeButton key={themeItem.id} themeItem={themeItem} isActive={props.theme === themeItem.id} onClick={() => props.onThemeChange(themeItem.id)} />
        ))}
      </div>
      <div className="w-px h-6 bg-white/20" />
      <button 
          onClick={props.onMusicMuteToggle} 
          className="p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none"
          aria-label={props.isMusicMuted ? 'Unmute music' : 'Mute music'}
        >
          {props.isMusicMuted 
            ? <MusicNoteIcon className="w-5 h-5 text-gray-400" /> 
            : <MusicNoteIcon className="w-5 h-5 text-[var(--text-primary)]" />
          }
      </button>
      <button 
        onClick={props.onSfxMuteToggle} 
        className="p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none"
        aria-label={props.isSfxMuted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {props.isSfxMuted 
          ? <SpeakerOffIcon className="w-5 h-5 text-gray-400" /> 
          : <SpeakerOnIcon className="w-5 h-5 text-[var(--text-primary)]" />
        }
      </button>
    </div>
  );
};

export default SettingsPanel;
