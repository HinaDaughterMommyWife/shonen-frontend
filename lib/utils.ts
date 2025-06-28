import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function reorderScores(scores: Record<string, number>): Record<string, number> {
  let sortedScores = Object.entries(scores);

  sortedScores.sort((a, b) => b[1] - a[1]);

  let rankedScores: Record<string, number> = {};
  let currentRank = 0;
  let previousScore: number | null = null;

  for (const [key, score] of sortedScores) {
    if (previousScore === null || score !== previousScore) {
      currentRank += 1;
    }
    rankedScores[key] = currentRank;
    previousScore = score;
  }

  return rankedScores;
}

export const generateLinearSteps = (
  stepsCount: number,
  minValue: number,
  maxValue: number,
): number[] => {
  const len = Math.max(0, Math.floor(stepsCount));
  if (len === 0) return [];
  if (len === 1) return [minValue];

  const steps: number[] = [];
  const stepSize = (maxValue - minValue) / (len - 1);

  for (let i = 0; i < len; i++) {
    steps.push(minValue + i * stepSize);
  }

  // Garantizar que el último valor sea exactamente maxValue (por acumulación de decimales)
  steps[len - 1] = maxValue;

  return steps;
};
