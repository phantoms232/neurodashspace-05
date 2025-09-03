import { useRef, useCallback } from 'react';

interface AudioPool {
  playTone: (frequency: number, duration?: number) => void;
  playClick: () => void;
}

export const useAudioPool = (isMuted: boolean = false): AudioPool => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number = 0.1) => {
    if (isMuted) return;

    try {
      const audioContext = getAudioContext();
      
      // Resume context if it's suspended (mobile requirement)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [isMuted, getAudioContext]);

  const playClick = useCallback(() => {
    if (isMuted) return;

    try {
      if (!clickAudioRef.current) {
        clickAudioRef.current = new Audio();
        clickAudioRef.current.src = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuEzO/PhzwKJIPM7eGUQwMZf9v+53M0EQtClOjgqmIKDlms3OOjOjAHeLy9+6N5NAAKjOj58lwnECyJGfzfp1QcFliH/8iWwAcyUw8nkyXFD2wWnCDGjUZZFKU9dLXCKYNXBF7b/H8+WdFTZZMm1DnlAUkUnrAHUc5hEzOHbPWpJJvOjr6+vMLFuJWFsDFQE8QLtjP0N3U9ZK/Q2YU7dGdU7VEuAmSlIqiAWoAFzHt9r4w8Y3Nul4LsZV+8K/NM3wNcv7/1nq3LW5MRLdkqP4vj++PrR7QZ0QZrPfSbh+/mxfAhfODzEp5/QVfOzAF8w3RfSH6uuU5Y7I8O4p+Z4VWFYkGk4ftKyXBWQdA+iqhXTQS7L/RAZCiUIXy7vMrH/D1OGBU9HxzjhJM8Y/n+gLpccJdKDRpQ4DzNw4sQZrPQ4M6LdE7A5mBNqE3tOhEONm3JzPiOV4ZgLQJKUAZe8ykKQRZL3fz1uj+dOwPYcjDPz8cU7B6EKiWLiR3PzOA6iZO5FKGd+zAC2Z1SZl5+8fkdWLK2m8kZgXHLb4QFeLOKkCxsJLwFNr8r+Rvfb5X7LvPGVYzf7Z7/J+X+X3o0CfX7zKFt3YRqI5rq5R6g3LaNhEQ4I+mLfXB7WDFY6H7xnwhJCxCRX/9uHZQ3qmQl9TFcQF2A=`;
        clickAudioRef.current.volume = 0.3;
      }

      const audio = clickAudioRef.current.cloneNode() as HTMLAudioElement;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (error) {
      console.warn('Click audio playback failed:', error);
    }
  }, [isMuted]);

  return { playTone, playClick };
};