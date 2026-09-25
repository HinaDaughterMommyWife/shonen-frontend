'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSurveyStore } from '@/store';
import { nanoid } from 'nanoid';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import EmoteDecorator from '../EmoteDecorator';
import EmoteContainer from '../EmotesContainer/EmoteContainer';
import Image from 'next/image';
import QuieroSelector from '@/components/QuieroSelector';
import PixelReveal from '@/components/PixelReveal/PixelReveal';
import MarkdownPreview from '@/components/MarkdownPreview';

const PEPELU_SANTA = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBseHe47vlzWuJGf2kpoVdj4n85SAysHqMC0gD9';
const PEPELU_IMAGE = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ';
const LABUBU_IMAGE = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsWZc56RnLWVlN6XqPtiSm9Jpa54byjE3hnGu1';
const ADVINCULA_IMAGE =
  'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsNedmHXb9iFu0sXtSWf4lm5V3RAT8HPd1ChoI';
const SHUPO_GIF = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsWNDrrUpnLWVlN6XqPtiSm9Jpa54byjE3hnGu';

const VIDEO_MOMOI = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsyA7EJJWE2RrHWPuACU6tblTSchKogFveVfMY';
const SONG_VOLUME = 0.4;
const FADE_STEP = 0.04;
const FADE_INTERVAL_MS = 80;

type CommentSectionProps = {
  markdownContent?: string;
};

export default function CommentSection({ markdownContent = '' }: CommentSectionProps) {
  const { survey } = useSurveyStore();
  const [ctaFading, setCtaFading] = useState(false);
  const [ctaReady, setCtaReady] = useState(false);
  const [songArmed, setSongArmed] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const songStartRef = useRef<HTMLDivElement | null>(null);
  const songEndRef = useRef<HTMLDivElement | null>(null);
  const songEndedRef = useRef(false);
  const songStartedRef = useRef(false);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearFade = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const fadeVolumeTo = (target: number, onDone?: () => void) => {
    const video = videoRef.current;
    if (!video) {
      onDone?.();
      return;
    }

    clearFade();
    fadeIntervalRef.current = setInterval(() => {
      const current = video.volume;
      if (Math.abs(current - target) <= FADE_STEP) {
        video.volume = target;
        clearFade();
        onDone?.();
        return;
      }
      video.volume =
        current < target
          ? Math.min(current + FADE_STEP, target)
          : Math.max(current - FADE_STEP, target);
    }, FADE_INTERVAL_MS);
  };

  useEffect(() => {
    return () => {
      clearFade();
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, []);

  useEffect(() => {
    if (!songArmed) return;

    const startEl = songStartRef.current;
    const endEl = songEndRef.current;
    if (!startEl || !endEl) return;

    const startSong = () => {
      if (songEndedRef.current || songStartedRef.current) return;
      const video = videoRef.current;
      if (!video) return;
      songStartedRef.current = true;
      video.loop = true;
      video.currentTime = 0;
      video.volume = 0;
      setVideoVisible(true);
      void video
        .play()
        .then(() => fadeVolumeTo(SONG_VOLUME))
        .catch(() => {
          songStartedRef.current = false;
          setVideoVisible(false);
        });
    };

    const stopSong = () => {
      if (songEndedRef.current) return;
      songEndedRef.current = true;
      const video = videoRef.current;
      if (!video) return;
      setVideoVisible(false);
      fadeVolumeTo(0, () => {
        video.pause();
        video.currentTime = 0;
        video.loop = false;
        setVideoFinished(true);
      });
    };

    const startObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startSong();
          startObserver.disconnect();
        }
      },
      { threshold: 0 },
    );

    const endObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          stopSong();
          endObserver.disconnect();
        }
      },
      { threshold: 0 },
    );

    startObserver.observe(startEl);
    endObserver.observe(endEl);

    return () => {
      startObserver.disconnect();
      endObserver.disconnect();
    };
  }, [songArmed]);

  const handleArmSong = () => {
    if (songArmed || ctaFading) return;

    // Unlock video playback inside the user gesture (silent)
    const video = videoRef.current;
    if (video) {
      video.loop = true;
      video.volume = 0;
      video.currentTime = 0;
      void video.play().catch(() => {});
    }

    setSongArmed(true);
    setCtaFading(true);
  };

  useEffect(() => {
    if (!ctaFading) return;
    const timeout = setTimeout(() => {
      setCtaReady(true);
      setCtaFading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [ctaFading]);

  let comments = survey?.selectedComments || [];

  const normalizedComments: string[] = comments.map((item) =>
    typeof item === 'string' ? item : item.comment,
  );

  const getCommentMeta = (index: number) => {
    const item = comments[index];
    if (typeof item === 'string') return null;
    return item;
  };

  const rotationClasses = ['rotate-0', 'rotate-90', 'rotate-180', '-rotate-90'];

  const getRotationClass = (index: number) => {
    return rotationClasses[index % rotationClasses.length];
  };

  return (
    <section className="relative w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-50">
        <video
          ref={videoRef}
          src={VIDEO_MOMOI}
          playsInline
          preload="auto"
          className={cn(
            'absolute left-0 top-1/2 max-h-[20vh] w-auto -translate-y-1/2 pl-[8px] object-contain transition-opacity duration-700 ease-in-out',
            videoVisible ? 'opacity-100' : 'opacity-0',
            videoFinished && 'hidden pointer-events-none',
          )}
        />
      </div>
      <EmoteContainer />
      <div className="w-full flex justify-center py-[320px] px-5xlarge" />
      <div className="mx-auto w-full min-w-0 max-w-[1040px] px-5xlarge">
        <MarkdownPreview content={markdownContent} />
      </div>
      <div className="w-full flex justify-center py-[320px] px-5xlarge" />
      <div className="flex justify-center my-[300px]">
        <img
          src="https://media1.tenor.com/m/kfrk4pMJbHYAAAAd/mabel-black-souls.gif"
          alt="mabel black souls"
          loading="lazy"
          className="w-[20px] h-auto pointer-events-none select-none opacity-10"
        />
      </div>

      <div className="w-full flex justify-center mb-[100px] py-[80px] px-5xlarge" />
      <div className="flex flex-col gap-large">
        <h2 className="text-center font-bold text-6xl my-[80px] max-md:text-4xl">
          Comentarios semanales
        </h2>
      </div>
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex flex-col pt-[120px] gap-[220px]">
          {normalizedComments.map((item, index) => (
            <div className="flex flex-col gap-[180px] items-center" key={nanoid()}>
              <div className="w-full flex flex-col justify-center mb-[100px] px-5xlarge">
                <div
                  key={nanoid()}
                  id={`comment-${index}`}
                  className="flex flex-col bg-white text-black md:p-2xlarge p-large  z-20"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      img: ({ src, alt }) => (
                        <img
                          src={src}
                          alt={alt}
                          className="inline h-10 w-10 align-middle"
                          loading="lazy"
                        />
                      ),
                      a: ({ children, href, target }) => (
                        <a
                          href={href}
                          target={'_blank'}
                          rel={'noopener noreferrer'}
                          className="text-blue-500 underline"
                        >
                          {children}
                        </a>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside my-4 space-y-2 text-3xl md:text-4xl pl-4">
                          {children}
                        </ol>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside my-4 space-y-2 text-3xl md:text-4xl pl-4">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-3xl md:text-4xl whitespace-pre-line break-word leading-relaxed">
                          {children}
                        </li>
                      ),
                      p: ({ children }) => {
                        return (
                          <EmoteDecorator>
                            <span className="text-4xl md:text-5xl whitespace-pre-line break-word">
                              {children}
                            </span>
                          </EmoteDecorator>
                        );
                      },
                    }}
                  >
                    {item.replace(/\n/gi, '&nbsp; \n')}
                  </ReactMarkdown>
                </div>
                {(() => {
                  const meta = getCommentMeta(index);
                  if (!meta) return null;
                  return (
                    <div className="mt-4 w-full flex justify-between items-center bg-gray-100 text-black px-6 py-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">👍</span>
                        {meta.favorite_chapter ? (
                          <span className="font-semibold text-green-600 text-xl">
                            {meta.favorite_chapter}
                          </span>
                        ) : (
                          <span className="font-semibold text-gray-400 text-xl">No hay voto</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {meta.least_favorite_chapter ? (
                          <span className="font-semibold text-red-600 text-xl">
                            {meta.least_favorite_chapter}
                          </span>
                        ) : (
                          <span className="font-semibold text-gray-400 text-xl">No hay voto</span>
                        )}
                        <span className="text-2xl">👎</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
              {index < normalizedComments.length - 2 && (
                <img
                  src={LABUBU_IMAGE}
                  alt={'pepelu'}
                  className={cn(
                    'inline h-[300px] w-[240px] align-middle ',
                    getRotationClass(index),
                  )}
                  loading="lazy"
                />
              )}
              {index === normalizedComments.length - 2 && (
                <>
                  <Image
                    src={
                      'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsaKnMIIdIe6DPKJbANLT1t79HRaZkMfWS3iF8'
                    }
                    alt="Deltarun"
                    width={400}
                    height={600}
                    className="inline py-[300px] align-middle"
                    loading="lazy"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
