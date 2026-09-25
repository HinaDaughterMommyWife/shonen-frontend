'use client';

import React, { useRef, useState, useCallback } from 'react';

const AUDIO_URL = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5ApWlWQRLHr4spidyZSq0co8UYMh2EOK9NkJ'; // Reemplaza con la URL del audio
const REVEAL_TEXT = 'Darkrai, soy tu unico suscriptor (el segundo pixel es Robraas), para demostrarte voy a spamear "Quiero Keke" con todas mis multicuentas en el chat... #DarkraiMola1M'; // Reemplaza con tu texto
const AUDIO_DELAY_MS = 1000; // silencio inicial del audio
const PIXEL_HOLD_MS = 4000; // tiempo que los píxeles se quedan en el centro

type Phase = 'idle' | 'playing' | 'waiting' | 'animating' | 'holding' | 'fading' | 'done';

export default function PixelReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [showText, setShowText] = useState(false);
  const [btnFading, setBtnFading] = useState(false);
  const [btnGone, setBtnGone] = useState(false);

  const fadeCanvas = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    setPhase('fading');
    wrapper.style.transition = 'opacity 0.8s ease';
    wrapper.style.opacity = '0';
    wrapper.addEventListener(
      'transitionend',
      () => {
        setPhase('done');
        setShowText(true);
      },
      { once: true },
    );
  }, []);

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setPhase('animating');

    const W = canvas.width;
    const H = canvas.height;
    const PIXEL = 8; // x2 (antes 4)
    const DURATION = 4000;

    const endX = Math.floor(W / 2) - Math.floor(PIXEL / 2);
    const p1y = Math.floor(H / 2) - PIXEL - 2;
    const p2y = Math.floor(H / 2) + 2;

    let startTime: number | null = null;

    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const t = Math.min((ts - startTime) / DURATION, 1);

      ctx.clearRect(0, 0, W, H);
      const x = Math.round(t * endX);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, p1y, PIXEL, PIXEL);
      ctx.fillRect(x, p2y, PIXEL, PIXEL);

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        // Píxeles quedan en el centro — esperar PIXEL_HOLD_MS antes de esconder el canvas
        setPhase('holding');
        setTimeout(fadeCanvas, PIXEL_HOLD_MS);
      }
    };

    requestAnimationFrame(tick);
  }, [fadeCanvas]);

  const handleStart = useCallback(() => {
    if (phase !== 'idle') return;

    // Fade del botón
    setBtnFading(true);
    setTimeout(() => setBtnGone(true), 500);

    setPhase('playing');

    // 1s de delay para el silencio inicial del audio
    setTimeout(() => {
      const audio = new Audio(AUDIO_URL);
      audio.play().catch(() => {});
      audio.addEventListener(
        'ended',
        () => {
          setPhase('waiting');
          setTimeout(startAnimation, 500);
        },
        { once: true },
      );
    }, AUDIO_DELAY_MS);
  }, [phase, startAnimation]);

  return (
    <div className="w-full flex flex-col items-center gap-16 py-12 px-4">
      <style>{`
        @keyframes charFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .char-reveal {
          display: inline;
          animation: charFadeIn 0.25s ease both;
        }
      `}</style>

      <p className="text-center text-xl text-gray-300 ">
        Felicidades por los 100k, Darkrai, a continuación, voy a mostrarte representados en pixeles, la gran cantidad de suscriptores que has conseguido. Son muchos... asi que preparate 👀
      </p>

      {/* Contenedor que siempre reserva el espacio — sin layout shifts */}
      <div className="relative w-full max-w-3xl" style={{ aspectRatio: '16 / 9' }}>

        {/* Capa canvas + borde */}
        <div ref={wrapperRef} className="absolute inset-0 border border-white">
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="absolute inset-0 w-full h-full bg-black"
          />

          {/* Botón centrado sobre el canvas */}
          {!btnGone && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={handleStart}
                style={{ transition: 'opacity 0.5s ease', opacity: btnFading ? 0 : 1 }}
                className="px-8 py-4 bg-white text-black font-bold text-xl rounded-lg hover:bg-gray-100 cursor-pointer pointer-events-auto"
              >
                Iniciar
              </button>
            </div>
          )}
        </div>

        {/* Capa texto — siempre en el DOM, opacity controla visibilidad */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-transparent"
          style={{
            opacity: showText ? 1 : 0,
            pointerEvents: showText ? 'auto' : 'none',
          }}
        >
          <p className="text-center text-lg md:text-2xl font-bold text-white px-4 leading-relaxed break-words w-full">
            {showText && REVEAL_TEXT.split('').map((char, i) => (
              <span
                key={i}
                className="char-reveal"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </p>
        </div>

      </div>
    </div>
  );
}
