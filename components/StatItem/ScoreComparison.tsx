import { ChevronDown, ChevronUp, EqualApproximately } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreComparisonProps {
  position: number;
  previousPosition: number;
}

export default function ScoreComparison({ position, previousPosition }: ScoreComparisonProps) {
  const safePreviousPosition = previousPosition ?? position
  const change = position - safePreviousPosition;
  const sign: -1 | 0 | 1 = Math.sign(change) as -1 | 0 | 1;

  const iconMap = {
    [-1]: <ChevronUp />,
    [1]: <ChevronDown />,
    [0]: <EqualApproximately />,
  } as const;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center w-[64px] rounded-r-2xl border max-xs:px-0 p-4 font-semibold',
        {
          'text-green-500': sign === -1,
          'text-red-500': sign === 1,
          'text-yellow-500': sign === 0,
        },
      )}
    >
      {Math.abs(change)}
      {iconMap[sign]}
    </div>
  );
}
