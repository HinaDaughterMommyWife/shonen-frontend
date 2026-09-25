'use client';

import { useInViewMiddle } from '@/hooks/useInViewMiddle';
import { useIncomingCallAudio } from '@/hooks/useIncomingCallAudio';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

const JUAN_AVATAR = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBse8ofxBlzWuJGf2kpoVdj4n85SAysHqMC0gD9';
const VIDEO_URL = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs28O19Bholsg76JvNkImERSopZqFPdQXbjhiC';

export default function IncomingCall() {
  const { ref, inView } = useInViewMiddle<HTMLDivElement>({ once: true });
  const [show, setShow] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const hasShown = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { startAudio, stopAudio } = useIncomingCallAudio();

  // Handle showing modal and starting audio
  useEffect(() => {
    if (inView && !hasShown.current) {
      hasShown.current = true;
      setShow(true);
      startAudio();
    }
  }, [inView]);

  // Handle body scroll lock
  useEffect(() => {
    if (show || showVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [show, showVideo]);

  // Handle video playback and auto-close
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;

    video.volume = 0.4;
    video.play();

    const handleVideoEnd = () => {
      setShowVideo(false);
      setShow(false);
    };

    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [showVideo]);

  const handleDismiss = () => {
    setShow(false);
    stopAudio();
  };

  const handleAccept = () => {
    setShow(false);
    stopAudio();
    setShowVideo(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
  };

  return (
    <div ref={ref} className="w-full flex justify-center py-[200px]">
      <div
        className={cn(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-out',
          show
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-75 pointer-events-none'
        )}
        style={{
          animation: show ? 'scaleIn 0.6s ease-out forwards' : 'none',
        }}
      >
        {/* FaceTime-style incoming call modal */}
        <div className="relative w-[380px] h-[600px] bg-gradient-to-b from-gray-900 via-gray-800 to-black rounded-[40px] shadow-2xl overflow-hidden border-4 border-gray-700">
          {/* Blurred background effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-purple-600/20 backdrop-blur-3xl" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-between h-full py-12 px-8">
            {/* Top section - Status */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-white/80 text-lg font-light tracking-wide">
                FaceTime Video
              </div>
              <div className="w-16 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Middle section - Avatar and name */}
            <div className="flex flex-col items-center gap-6">
              {/* Avatar with glow effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/50 rounded-full blur-3xl animate-pulse" />
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                  <Image
                    src={JUAN_AVATAR}
                    alt="Juan"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Caller name */}
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-white text-4xl font-semibold tracking-tight">
                  Netanyahu
                </h2>
                <p className="text-white/70 text-xl font-light animate-pulse">
                  Llamada entrante...
                </p>
              </div>
            </div>

            {/* Bottom section - Action buttons */}
            <div className="flex items-center justify-center gap-16 w-full">
              {/* Decline button */}
              <button
                className="group relative flex flex-col items-center gap-2"
                onClick={handleDismiss}
              >
                <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <span className="text-white/90 text-sm font-medium">
                  Rechazar
                </span>
              </button>

              {/* Accept button */}
              <button
                className="group relative flex flex-col items-center gap-2"
                onClick={handleAccept}
              >
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-95 animate-pulse">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span className="text-white/90 text-sm font-medium">
                  Aceptar
                </span>
              </button>
            </div>
          </div>

          {/* Animated ring effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-white/20"
              style={{
                animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-10 transition-opacity duration-300',
          showVideo ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleCloseVideo}
          className="absolute top-14 right-14 z-50 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Video container */}
        <div className="w-full h-full relative">
          {VIDEO_URL && (
            <video
              ref={videoRef}
              src={VIDEO_URL}
              className="w-full h-full object-contain"
              playsInline
            />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes ping {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
