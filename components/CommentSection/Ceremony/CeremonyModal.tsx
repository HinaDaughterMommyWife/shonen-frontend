'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import { surveyDarkraiStyle, type NomineeEntry } from '@/common/resultdata';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import CeremonyOverlay from './CeremonyOverlay';
import NomineeCard from './NomineeCard';
import ResultsTable from './ResultsTable';

type Phase =
  | 'intro'
  | 'gap'
  | 'category-title'
  | 'nominados-label'
  | 'showing-nominee'
  | 'winner-announce'
  | 'winner-reveal'
  | 'results'
  | 'finale';

const scrollbarStyles =
        '[scrollbar-gutter:stable] [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:my-3 [&::-webkit-scrollbar]:absolute [&::-webkit-scrollbar]:w-[6px]';


const INTRO_AUDIO = 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MDKMtao9sVhX5CKk0NTZU4tyzJ3ndrFgL2pxq'; // URL for intro music

export default function CeremonyModal({ onClose }: { onClose: () => void }) {
  const categories = Object.entries(surveyDarkraiStyle);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('gap');
  const [modalVisible, setModalVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [nextPhase, setNextPhase] = useState<Phase | null>('intro');
  const nextPhaseRef = useRef<Phase | null>('intro');
  const [nomineeIndex, setNomineeIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitRef = useRef(false);
  const audio = useAudioPlayer();

  const currentCategory = categories[categoryIndex];
  const [categoryTitle, categoryData] = currentCategory || ['', {}];
  const nominees = Object.entries(categoryData) as [string, NomineeEntry][];
  const sorted = [...nominees].sort((a, b) => b[1].votes - a[1].votes);
  const winner = sorted[0];
  const isLastCategory = categoryIndex >= categories.length - 1;

  useEffect(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Unlock audio & fade in modal on mount
  useEffect(() => {
    if (!hasInitRef.current) {
      hasInitRef.current = true;
      audio.init();
    }
    document.body.style.overflow = 'hidden';
    // Trigger modal fade-in on next frame
    requestAnimationFrame(() => setModalVisible(true));
    return () => {
      document.body.style.overflow = '';
      clearTimer();
      audio.stopImmediate();
    };
  }, [clearTimer, audio]);

  // Phase machine
  useEffect(() => {
    clearTimer();

    switch (phase) {
      case 'intro':
        if (INTRO_AUDIO) {
          const t = setTimeout(() => audio.play(INTRO_AUDIO, { loop: true, volume: 0.7 }), 100);
          timerRef.current = setTimeout(() => {
            clearTimeout(t);
            gotoWithGap('category-title');
          }, 6000);
        } else {
          timerRef.current = setTimeout(() => gotoWithGap('category-title'), 8000);
        }
        break;

      case 'gap':
        // Preload next nominee's audio during the gap
        if (nextPhaseRef.current === 'showing-nominee' && nominees[nomineeIndex]?.[1]?.audio) {
          audio.prepare(nominees[nomineeIndex][1].audio);
        }
        timerRef.current = setTimeout(() => {
          if (nextPhaseRef.current) {
            setPhase(nextPhaseRef.current);
            nextPhaseRef.current = null;
            setNextPhase(null);
          }
        }, 1500);
        break;

      case 'category-title':
        timerRef.current = setTimeout(() => gotoWithGap('nominados-label'), 5000);
        break;

      case 'nominados-label':
        audio.stop();
        timerRef.current = setTimeout(() => {
          setNomineeIndex(0);
          gotoWithGap('showing-nominee');
        }, 2000);
        break;

      case 'showing-nominee': {
        const nominee = nominees[nomineeIndex];
        if (nominee && nominee[1].audio) {
          audio.play(nominee[1].audio, { volume: 0.8, maxVolume: nominee[1].maxVolume });
        }
        timerRef.current = setTimeout(() => {
          if (nomineeIndex < nominees.length - 1) {
            audio.stop();
            fadeOutThen(() => {
              nextPhaseRef.current = 'showing-nominee';
              setNextPhase('showing-nominee');
              setNomineeIndex((prev) => prev + 1);
              setPhase('gap');
            });
          } else {
            audio.stop();
            gotoWithGap('winner-announce');
          }
        }, 8000);
        break;
      }

      case 'winner-announce':
        audio.stop();
        timerRef.current = setTimeout(() => gotoWithGap('winner-reveal'), 3000);
        break;

      case 'winner-reveal':
        setShowConfetti(true);
        if (winner && winner[1].audio) {
          audio.play(winner[1].audio, { volume: 0.9, maxVolume: winner[1].maxVolume });
        }
        timerRef.current = setTimeout(() => {
          setShowConfetti(false);
          fadeOutThen(() => setPhase('results'));
        }, 8000);
        break;

      case 'results':
        break;

      case 'finale':
        audio.stop();
        timerRef.current = setTimeout(() => onClose(), 5000);
        break;
    }
  }, [phase, nomineeIndex]);

  const FADE_OUT_MS = 700;

  const fadeOutThen = useCallback((cb: () => void) => {
    setFading(true);
    timerRef.current = setTimeout(() => {
      setFading(false);
      cb();
    }, FADE_OUT_MS);
  }, []);

  const gotoWithGap = useCallback((target: Phase) => {
    fadeOutThen(() => {
      nextPhaseRef.current = target;
      setNextPhase(target);
      setPhase('gap');
    });
  }, [fadeOutThen]);

  const handleNext = () => {
    if (isLastCategory) {
      fadeOutThen(() => setPhase('finale'));
    } else {
      fadeOutThen(() => {
        setCategoryIndex((prev) => prev + 1);
        setNomineeIndex(0);
        nextPhaseRef.current = 'category-title';
        setNextPhase('category-title');
        setPhase('gap');
      });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-[5%] transition-opacity duration-700 ease-out ${
        modalVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

      {/* Inner container at 90% */}
      <div className="relative w-full h-full max-w-full max-h-full rounded-2xl overflow-hidden">

      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.w}
          height={windowSize.h}
          numberOfPieces={300}
          recycle={true}
          colors={['#FFD700', '#FFA500', '#FF6347', '#7B68EE', '#00CED1', '#FF69B4']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 10000 }}
        />
      )}

      {/* Close button */}
      <button
        onClick={() => {
          audio.stopImmediate();
          clearTimer();
          onClose();
        }}
        className="absolute top-6 right-6 z-[10001] text-white/60 hover:text-white transition-colors
                   w-12 h-12 flex items-center justify-center rounded-full border border-white/20
                   hover:border-white/40 bg-white/5 hover:bg-white/10 text-2xl"
        aria-label="Cerrar"
      >
        ✕
      </button>

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent" />

      {/* Content */}
      <div className="relative z-[10000] flex flex-col items-center justify-center w-full h-full px-6 overflow-y-auto">
        {/* INTRO */}
        {phase === 'intro' && (
          <CeremonyOverlay text="Premios Simbolistas - Extras ⭐" scale={true} fading={fading} />
        )}

        {/* CATEGORY TITLE */}
        {phase === 'category-title' && (
          <CeremonyOverlay key={`cat-${categoryIndex}`} text={categoryTitle} fading={fading} />
        )}

        {/* NOMINADOS LABEL */}
        {phase === 'nominados-label' && (
          <CeremonyOverlay text="Nominados" fading={fading} />
        )}

        {/* SHOWING NOMINEES (+ preload during gap) */}
        {(phase === 'showing-nominee' || (phase === 'gap' && nextPhase === 'showing-nominee')) &&
          nominees[nomineeIndex] && (
          <NomineeCard
            key={`${categoryIndex}-${nomineeIndex}`}
            name={nominees[nomineeIndex][0]}
            data={nominees[nomineeIndex][1]}
            visible={true}
            fading={fading || phase === 'gap'}
          />
        )}

        {/* WINNER ANNOUNCE */}
        {phase === 'winner-announce' && (
          <CeremonyOverlay text="Y el ganador es..." fading={fading} />
        )}

        {/* WINNER REVEAL */}
        {phase === 'winner-reveal' && winner && (
          <NomineeCard
            name={winner[0]}
            data={winner[1]}
            visible={true}
            isWinner={true}
            fading={fading}
          />
        )}

        {/* RESULTS */}
        {phase === 'results' && (
          <div className={`flex flex-col items-center w-full max-h-[80vh] overflow-y-auto py-8 ${scrollbarStyles}`}>
            <ResultsTable nominees={nominees} />
            <button
              onClick={handleNext}
              className="mt-10 px-10 py-4 rounded-xl text-xl font-bold transition-all
                         bg-gradient-to-r from-yellow-500 to-amber-500 text-black
                         hover:from-yellow-400 hover:to-amber-400 hover:scale-105
                         shadow-lg shadow-yellow-500/20"
            >
              {isLastCategory ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        )}

        {/* FINALE */}
        {phase === 'finale' && (
          <CeremonyOverlay text="Encuesta realizada por GatoJoeyBot" fading={fading} />
        )}
      </div>
      </div>
    </div>
  );
}
