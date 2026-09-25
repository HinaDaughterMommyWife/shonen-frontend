import { useEffect, useRef, useState } from "react";

interface UseScrollAudioOptions {
  /** Audio file URL */
  url: string;
  /** Maximum volume (0–1). Default 0.4 */
  maxVolume?: number;
  /** Whether the audio has been "activated" (e.g. button clicked) */
  active: boolean;
  /** Whether the target container is currently in the viewport */
  inView: boolean;
  /** Volume fade step per interval tick. Default 0.05 */
  fadeStep?: number;
  /** Interval in ms between each fade tick. Default 100 */
  fadeInterval?: number;
}


export function useScrollAudio({
  url,
  maxVolume = 0.4,
  active,
  inView,
  fadeStep = 0.05,
  fadeInterval = 100,
}: UseScrollAudioOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (active) {
      audio.play().catch(() => {/* autoplay blocked – silent */});
    } else {
      audio.pause();
      audio.currentTime = 0;
      setVolume(0);
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setVolume((prev) => {
        const target = inView ? maxVolume : 0;
        const delta = inView ? fadeStep : -fadeStep;
        const next = inView
          ? Math.min(prev + delta, target)
          : Math.max(prev + delta, target);

        if (next === prev) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return next;
      });
    }, fadeInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [inView, active, maxVolume, fadeStep, fadeInterval]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return { volume };
}
