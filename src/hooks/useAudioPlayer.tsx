import { useState, useRef, useCallback, useEffect } from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}

export const useAudioPlayer = (audioUrl: string) => {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.preload = 'metadata';
      
      // Set up event listeners
      audioRef.current.addEventListener('loadstart', () => {
        setState(prev => ({ ...prev, isLoading: true }));
      });
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          duration: audioRef.current?.duration || 0 
        }));
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setState(prev => ({ 
          ...prev, 
          currentTime: audioRef.current?.currentTime || 0 
        }));
      });
      
      audioRef.current.addEventListener('ended', () => {
        setState(prev => ({ 
          ...prev, 
          isPlaying: false,
          currentTime: 0 
        }));
      });
      
      audioRef.current.addEventListener('play', () => {
        setState(prev => ({ ...prev, isPlaying: true }));
      });
      
      audioRef.current.addEventListener('pause', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      });

      audioRef.current.addEventListener('error', () => {
        setState(prev => ({ ...prev, isLoading: false }));
        console.error('Audio loading failed:', audioUrl);
      });

      audioRef.current.addEventListener('canplay', () => {
        setState(prev => ({ ...prev, isLoading: false }));
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [audioUrl]);

  const play = useCallback(async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const changeSpeed = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setState(prev => ({ ...prev, playbackRate: rate }));
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  return {
    ...state,
    play,
    pause,
    stop,
    seek,
    changeSpeed,
    togglePlayPause
  };
};