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

export const isJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};
