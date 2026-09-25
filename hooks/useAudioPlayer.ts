'use client';

import { useMemo, useRef } from 'react';

const FADE_DURATION = 800;
const MAX_VOLUME = 0.2;

export interface AudioPlayer {
  /** Call from a click handler to unlock the audio element for autoplay */
  init: () => void;
  /** Preload an audio source so it plays instantly later */
  prepare: (src: string) => void;
  play: (src: string, opts?: { loop?: boolean; volume?: number; maxVolume?: number }) => Promise<void>;
  stop: () => Promise<void>;
  stopImmediate: () => void;
}

export function useAudioPlayer(): AudioPlayer {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const preloadRef = useRef<HTMLAudioElement | null>(null);

  // Return a stable object so consumers can safely put it in dependency arrays
  return useMemo<AudioPlayer>(() => {
    const stopFade = () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    };

    const ensureAudio = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      return audioRef.current;
    };

    const fadeOut = (): Promise<void> => {
      return new Promise((resolve) => {
        const audio = audioRef.current;
        if (!audio || audio.paused) {
          resolve();
          return;
        }
        stopFade();
        const startVolume = audio.volume;
        const steps = 20;
        const stepTime = FADE_DURATION / steps;
        const volumeStep = startVolume / steps;
        let currentStep = 0;

        fadeIntervalRef.current = setInterval(() => {
          currentStep++;
          audio.volume = Math.max(0, startVolume - volumeStep * currentStep);
          if (currentStep >= steps) {
            stopFade();
            audio.pause();
            audio.currentTime = 0;
            audio.volume = MAX_VOLUME;
            resolve();
          }
        }, stepTime);
      });
    };

    return {
      init() {
        // Create & unlock the audio element inside a user-gesture call stack
        const audio = ensureAudio();
        audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
        audio.volume = 0;
        audio.play().then(() => audio.pause()).catch(() => {});
      },

      prepare(src) {
        if (!src) return;
        // Preload in a separate audio element so the browser caches the file
        if (preloadRef.current) {
          preloadRef.current.src = '';
        }
        const el = new Audio();
        el.preload = 'auto';
        el.src = src;
        el.load();
        preloadRef.current = el;
      },

      async play(src, { loop = false, volume = 1, maxVolume } = {}) {
        if (audioRef.current && !audioRef.current.paused) {
          await fadeOut();
        }
        const audio = ensureAudio();
        audio.src = src;
        audio.loop = loop;
        const cap = maxVolume != null ? Math.min(maxVolume, MAX_VOLUME) : MAX_VOLUME;
        audio.volume = Math.min(volume, cap);
        try {
          await audio.play();
        } catch {
          // autoplay blocked
        }
      },

      async stop() {
        await fadeOut();
      },

      stopImmediate() {
        stopFade();
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      },
    };
  }, []);
}
