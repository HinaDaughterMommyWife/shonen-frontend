import { useEffect, useRef, useState } from 'react';

const pad = (num: number, size = 2) => String(num).padStart(size, '0');

const getTimeParts = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const days = Math.floor(totalSeconds / 86400) % 365;
  const years = Math.floor(totalSeconds / (86400 * 365));
  return { years, days, hours, minutes, seconds, milliseconds };
};

export function useCountdownRAF(toUnix: number) {
  const [remaining, setRemaining] = useState(0);

  const rafRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(toUnix * 1000 - now, 0);

      setRemaining((prev) => {
        return Math.abs(prev - diff) > 15 ? diff : prev;
      });

      if (diff > 0) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [toUnix]);

  const timeParts = getTimeParts(remaining);

  const formatted = `${timeParts.years} Años, ${timeParts.days} Días, ${pad(timeParts.hours)} Hor, ${pad(timeParts.minutes)} Min, ${pad(timeParts.seconds)} Seg, ${pad(timeParts.milliseconds, 3)} ms`;

  return {
    ...timeParts,
    formatted,
    isFinished: remaining <= 0,
    rawMs: remaining,
  };
}
