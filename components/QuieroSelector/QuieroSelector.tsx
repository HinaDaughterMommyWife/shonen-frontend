'use client';

import React, { useState } from 'react';
import { useInViewMiddle } from '@/hooks/useInViewMiddle';
import { cn } from '@/lib/utils';

const OPTIONS = ['QUESO', 'KEKE', 'PIÑAS'] as const;
type Option = (typeof OPTIONS)[number];

const OPTION_EMOJI: Record<Option, string> = {
  QUESO: '🧀',
  KEKE: '🎂',
  PIÑAS: '🍍',
};

type Phase = 'buttons' | 'fadeOut' | 'reveal';

export default function QuieroSelector() {
  const { ref, inView } = useInViewMiddle<HTMLDivElement>({ once: true });
  const [selected, setSelected] = useState<Option | null>(null);
  const [phase, setPhase] = useState<Phase>('buttons');

  const handleSelect = (option: Option) => {
    if (phase !== 'buttons') return;
    setSelected(option);
    setPhase('fadeOut');
    setTimeout(() => {
      setPhase('reveal');
    }, 1200);
  };

  const buttonsVisible = inView && phase === 'buttons';
  const revealVisible = phase === 'reveal';

  return (
    <section className="flex flex-col items-center py-[120px] w-full">
      {/* QUIERO — letras separadas verticalmente */}
      <div className="flex flex-col items-center gap-16">
        {'QUIERO'.split('').map((letter, i) => (
          <span key={i} className="text-[20rem] font-black leading-none select-none">
            {letter}
          </span>
        ))}
      </div>

      {/* Espacio */}
      <div className="h-[300px]" />

      {/* Área de interacción, detectada por useInViewMiddle */}
      <div ref={ref} className="flex flex-col items-center w-full min-h-[300px] relative">

        {/* Botones */}
        <div
          className={cn(
            'flex flex-row items-center justify-center gap-8 transition-opacity duration-700 absolute inset-0',  
            buttonsVisible ? 'opacity-100' : 'opacity-0',
            phase === 'fadeOut' && 'pointer-events-none',
          )}
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={phase !== 'buttons'}
              className="text-5xl font-bold px-14 py-5 border-4 border-white text-white
                         hover:bg-white hover:text-black active:scale-95
                         transition-all duration-200 disabled:cursor-not-allowed"
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Reveal: emote + estrella */}
        <div
          className={cn(
            'flex items-center justify-center transition-opacity duration-700 absolute inset-0',
            revealVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
        >
          <div className="relative flex items-center justify-center">
            {/* Estrella detrás */}
            <span
              className="absolute text-[220px] leading-none select-none animate-spin"
              style={{ animationDuration: '8s' }}
            >
              ⭐
            </span>
            {/* Emoji de la opción elegida */}
            {selected && (
              <span className="relative z-10 text-[100px] leading-none select-none">
                {OPTION_EMOJI[selected]}
              </span>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
