'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { NomineeEntry } from '@/common/resultdata';

interface NomineeCardProps {
  name: string;
  data: NomineeEntry;
  visible: boolean;
  isWinner?: boolean;
  fading?: boolean;
}

export default function NomineeCard({ name, data, visible, isWinner, fading }: NomineeCardProps) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const active = show && !fading;

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-6 transition-all duration-700 ease-out',
        active ? 'opacity-100' : 'opacity-0',
      )}
    >
      {data.img ? (
        <div
          className={cn(
            'w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-2xl overflow-hidden border-4 shadow-2xl',
            isWinner ? 'border-yellow-400 shadow-yellow-400/40' : 'border-white/20',
          )}
        >
          <img
            src={data.img}
            alt={name}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      ) : (
        <div
          className={cn(
            'w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-2xl overflow-hidden border-4 shadow-2xl flex items-center justify-center',
            isWinner
              ? 'border-yellow-400 shadow-yellow-400/40 bg-yellow-400/10'
              : 'border-white/20 bg-white/5',
          )}
        >
          <span className="text-7xl">🏆</span>
        </div>
      )}

      <h3
        className={cn(
          'text-3xl md:text-5xl font-bold text-center',
          isWinner ? 'text-yellow-400' : 'text-white',
        )}
      >
        {name}
      </h3>

      {isWinner && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-2xl md:text-3xl font-semibold text-yellow-300">
            {data.votes} votos
          </span>
        </div>
      )}
    </div>
  );
}
