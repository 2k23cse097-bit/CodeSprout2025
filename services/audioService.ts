class AudioService {
  private audioContext: AudioContext | null = null;
  // FIX: Changed properties from private to public (default) to be accessible from other components.
  // This resolves errors about private property access.
  isSfxMuted: boolean = false;
  isMusicMuted: boolean = false;
  
  private musicGain: GainNode | null = null;
  private musicLoopInterval: number | null = null;
  private musicSequence = [220, 261.63, 293.66, 220, 329.63]; // A simple, non-intrusive melody
  private musicNoteIndex = 0;

  constructor() {
    if (typeof window !== 'undefined') {
        try {
            this.isSfxMuted = localStorage.getItem('tictactoe-sfx-muted') === 'true';
            this.isMusicMuted = localStorage.getItem('tictactoe-music-muted') === 'true';
        } catch (e) {
            console.warn('Could not access localStorage for mute state.');
        }
    }
  }

  private initAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    if (this.audioContext) return;

    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser");
      }
    }
  }

  private playTone(frequency: number, type: OscillatorType = 'sine', duration: number = 0.1, startTime?: number) {
    this.initAudioContext();
    if (!this.audioContext || this.isSfxMuted) return;
    
    const context = this.audioContext;
    const time = startTime || context.currentTime;

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.5, time + 0.01); 

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.start(time);

    gainNode.gain.exponentialRampToValueAtTime(0.00001, time + duration);
    oscillator.stop(time + duration);
  }

  playPlayerMoveSound() {
    this.playTone(523.25, 'triangle', 0.05); // C5
  }

  playAIMoveSound() {
    this.playTone(349.23, 'sawtooth', 0.1); // F4
  }

  playWinSound() {
    if (this.isSfxMuted) return;
    this.initAudioContext();
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    this.playTone(523.25, 'sine', 0.08, now); // C5
    this.playTone(659.25, 'sine', 0.08, now + 0.1); // E5
    this.playTone(783.99, 'sine', 0.12, now + 0.2); // G5
  }

  playDrawSound() {
    this.playTone(329.63, 'square', 0.2); // E4
  }
  
  playMusic() {
    this.initAudioContext();
    if (!this.audioContext || this.isMusicMuted || this.musicLoopInterval !== null) return;
    
    const context = this.audioContext;
    this.musicGain = context.createGain();
    this.musicGain.gain.setValueAtTime(0.05, context.currentTime);
    this.musicGain.connect(context.destination);

    this.musicNoteIndex = 0;

    const playNote = () => {
        if (!this.audioContext || !this.musicGain) return;
        
        // Create a new oscillator for each note, preventing the "cannot start more than once" error.
        const oscillator = context.createOscillator();
        oscillator.connect(this.musicGain);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(this.musicSequence[this.musicNoteIndex % this.musicSequence.length], context.currentTime);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5); // Each note lasts 0.5s
        
        this.musicNoteIndex++;
    };

    if (this.musicLoopInterval !== null) {
      clearInterval(this.musicLoopInterval);
    }
    
    playNote(); // Play the first note immediately
    this.musicLoopInterval = window.setInterval(playNote, 1000); // Play a new note every second
  }

  stopMusic() {
    if (this.musicLoopInterval !== null) {
      clearInterval(this.musicLoopInterval);
      this.musicLoopInterval = null;
    }
    if (this.musicGain) {
      this.musicGain.disconnect();
      this.musicGain = null;
    }
  }

  private setMute(key: string, isMuted: boolean) {
     if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(key, String(isMuted));
        } catch(e) {
            console.warn('Could not access localStorage to save mute state.');
        }
    }
  }

  toggleSfxMute(): boolean {
    this.isSfxMuted = !this.isSfxMuted;
    this.setMute('tictactoe-sfx-muted', this.isSfxMuted);
    return this.isSfxMuted;
  }
  
  toggleMusicMute(): boolean {
    this.isMusicMuted = !this.isMusicMuted;
    this.setMute('tictactoe-music-muted', this.isMusicMuted);
    if(this.isMusicMuted) {
        this.stopMusic();
    } else {
        this.playMusic();
    }
    return this.isMusicMuted;
  }

  // FIX: Removed duplicated method-style properties that conflicted with the class properties,
  // resolving duplicate identifier and type mismatch errors.
}

export const audioService = new AudioService();
