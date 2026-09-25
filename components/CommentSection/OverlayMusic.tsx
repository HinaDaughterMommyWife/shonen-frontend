import React, { useEffect, useRef, useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { cn } from '../../lib/utils';

interface OverlayMusicProps {
  settings: {
    audio: string;
    name: string;
    volume: number;
    text: string;
  };
  children: React.ReactNode;
}

const OverlayMusic: React.FC<OverlayMusicProps> = ({ settings, children }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [volume, setVolume] = useState(settings.volume);
  const [targetVolume, setTargetVolume] = useState(settings.volume);
  const { ref, inView } = useInView<HTMLDivElement>({
    once: false,
    offset: 100,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (!isOverlayVisible) {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
    }
  }, [volume, isOverlayVisible]);

  useEffect(() => {
    if (inView) {
      // Gradually restore volume
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      const interval = setInterval(() => {
        setVolume((prev) => {
          const newVolume = Math.min(prev + 0.05, targetVolume);
          if (newVolume === targetVolume) clearInterval(interval);
          return newVolume;
        });
      }, 100);
    } else {
      // Gradually lower volume
      const interval = setInterval(() => {
        setVolume((prev) => {
          const newVolume = Math.max(prev - 0.05, 0);
          if (newVolume === 0) {
            clearInterval(interval);
            // Start timeout to stop music after 30 seconds
            if (!timeoutRef.current) {
              timeoutRef.current = setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                }
              }, 30000);
            }
          }
          return newVolume;
        });
      }, 100);
    }
  }, [inView, targetVolume]);

  const handleOverlayClick = () => {
    setIsOverlayVisible(false);
    setVolume(settings.volume);
    if (audioRef.current) {
      audioRef.current.volume = settings.volume;
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className={cn('text-white p-2 flex items-center justify-between z-10 max-w-3xl mx-auto w-full transition-opacity duration-500 delay-500', {
        'opacity-0 pointer-events-none': isOverlayVisible,
      })}>
        <span className="text-[8px] text-gray-500 italic">{settings.name}</span>
        <div className="flex justify-between gap-2">
          <label htmlFor="volume" className="text-sm">
            Volumen
          </label>
          <input
            type="range"
            min="0"
            max="0.3"
            step="0.01"
            value={targetVolume}
            onChange={(e) => setTargetVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div className="relative w-full h-full max-w-3xl mx-auto" ref={ref}>
        {isOverlayVisible && (
          <div
            className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20 flex items-center justify-center text-white text-xl font-bold transition-opacity duration-500"
            onClick={handleOverlayClick}
          >
            {settings.text}
          </div>
        )}
        <div
          className={`relative w-full h-full ${isOverlayVisible ? 'pointer-events-none' : ''} transition-opacity duration-500`}
        >
          {children}
        </div>
      </div>

      <audio ref={audioRef} src={settings.audio} preload="auto" loop />
    </div>
  );
};

export default OverlayMusic;
