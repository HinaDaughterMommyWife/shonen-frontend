'use client';

import { create } from 'zustand';
import { useEffect, useRef, useCallback } from 'react';

const RINGTONE_URL = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsNj74J9Hb9iFu0sXtSWf4lm5V3RAT8HPd1Cho';

interface AudioState {
  isPlaying: boolean;
  isReady: boolean;
  setPlaying: (playing: boolean) => void;
  setReady: (ready: boolean) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: false,
  isReady: false,
  setPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setReady: (ready: boolean) => set({ isReady: ready }),
}));

export function useIncomingCallAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying, isReady, setPlaying, setReady } = useAudioStore();

  useEffect(() => {
    // Create audio element
    const audio = new Audio(RINGTONE_URL);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // Set ready when audio can play
    const handleCanPlay = () => {
      setReady(true);
    };

    audio.addEventListener('canplaythrough', handleCanPlay);

    // Cleanup
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.pause();
      audio.src = '';
    };
  }, [setReady]);

  useEffect(() => {
    if (!audioRef.current || !isReady) return;

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.log('Audio play failed:', error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isReady]);

  const prepareAudio = useCallback(() => {
    if (!audioRef.current) return;
    
    // Prepare audio context with user interaction (required for autoplay bypass)
    // Load the audio but don't play it yet
    audioRef.current.load();
    setReady(true);
  }, [setReady]);

  const startAudio = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.play()
      .then(() => {
        setPlaying(true);
        setReady(true);
      })
      .catch((error) => {
        console.log('Audio play failed:', error);
      });
  }, [setPlaying, setReady]);

  const stopAudio = useCallback(() => {
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [setPlaying]);

  return {
    prepareAudio,
    startAudio,
    stopAudio,
    isPlaying,
    isReady,
  };
}
