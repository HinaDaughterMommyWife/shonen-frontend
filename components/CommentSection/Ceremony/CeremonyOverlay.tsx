'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CeremonyOverlayProps {
  text: string;
  scale?: boolean;
  fading?: boolean;
}

export default function CeremonyOverlay({ text, scale, fading }: CeremonyOverlayProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const visible = show && !fading;

  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center z-30 pointer-events-none',
        'transition-all ease-out',
        scale ? 'duration-[1200ms]' : 'duration-700',
        visible ? 'opacity-100' : 'opacity-0',
        scale && visible ? 'scale-100' : scale ? 'scale-50' : '',
      )}
    >
      <h2
        className="text-4xl md:text-6xl font-bold text-center px-8 drop-shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
        }}
      >
        {text}
      </h2>
    </div>
  );
}
