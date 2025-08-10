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

function formatParts({
  years,
  days,
  hours,
  minutes,
  seconds,
  milliseconds,
}: ReturnType<typeof getTimeParts>) {
  const parts: string[] = [];

  if (years > 0) parts.push(`${years} ${years === 1 ? 'Año' : 'Años'}`);
  if (days > 0) parts.push(`${days} ${days === 1 ? 'Día' : 'Días'}`);
  if (hours > 0) parts.push(`${pad(hours)} Horas`);

  if (minutes > 0 || parts.length > 0) parts.push(`${pad(minutes)} Minutos`);
  if (seconds > 0 || parts.length > 0) parts.push(`${pad(seconds)} Segundos`);

  if (milliseconds > 0 || parts.length > 0) parts.push(`${pad(milliseconds, 3)} ms`);

  if (parts.length === 0) return '0 ms';

  if (parts.length === 1) return parts[0];

  return parts.slice(0, -1).join(', ') + ' y ' + parts[parts.length - 1];
}

export function useCountdownRAF(toUnix: number) {
  let initialCurrentTime = toUnix - 1000000;

  const [remaining, setRemaining] = useState(toUnix - initialCurrentTime);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(toUnix * 1000 - now, 0);

      setRemaining((prev) => {
        return Math.abs(prev - diff) > 15 ? diff : prev;
      });

      if (diff < 15) {
        cancelAnimationFrame(rafRef.current);
        setRemaining(0);
        return;
      }

      if (diff > 0) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [toUnix]);

  const timeParts = getTimeParts(remaining);
  const formatted = formatParts(timeParts);

  return {
    ...timeParts,
    formatted,
    isFinished: remaining <= 0,
    rawMs: remaining,
  };
}
