'use client';

import { useSurveyStore } from '@/store';
import { nanoid } from 'nanoid';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { cn } from '@/lib/utils';
import EmoteDecorator from '../EmoteDecorator';
import EmoteContainer from '../EmotesContainer/EmoteContainer';
import Image from 'next/image';

const PEPELU_IMAGE = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ';
const LABUBU_IMAGE = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsWZc56RnLWVlN6XqPtiSm9Jpa54byjE3hnGu1';

export default function CommentSection() {
  const { survey } = useSurveyStore();
  let comments = survey?.selectedComments || [];
  const containerRef = useRef<HTMLDivElement>(null);

  const getRotationClass = (index: number) => {
    const rotationStep = index % 4;
    switch (rotationStep) {
      case 0:
        return 'rotate-0';
      case 1:
        return 'rotate-90';
      case 2:
        return 'rotate-180';
      case 3:
        return '-rotate-90';
      default:
        return 'rotate-0';
    }
  };

  function getColorByIndex(index: number): string {
    const colors = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#C084FC'];
    return colors[index % colors.length];
  }

  useEffect(() => {
    let offset = 0;
    let animationId: number;

    const step = () => {
      const container = containerRef.current;
      if (!container) return;

      offset += 2.5;
      if (offset >= container.scrollWidth / 2) {
        offset = 0;
      }

      container.scrollLeft = offset;
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge overflow-x-hidden">
      <EmoteContainer />
      <div className="flex flex-col gap-large">
        <h2 className="text-center font-bold text-6xl my-[80px] max-md:text-4xl">
          Comentarios semanales
        </h2>
        <div className="w-full px-8 py-[180px] flex flex-col gap-8" />
      </div>
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex flex-col pt-[120px] gap-[220px]">
          {comments.map((item, index) => (
            <div className="flex flex-col gap-[180px] items-center" key={nanoid()}>
              <div
                key={nanoid()}
                className="flex flex-col bg-white text-black md:p-2xlarge p-large  z-20"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks, remarkHtml]}
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
                        target={target}
                        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                        className="text-blue-500 underline"
                      >
                        {children}
                      </a>
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
              {index < comments.length - 2 && (
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
              {index === comments.length - 2 && (
                <>
                <Image
                  src={"https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsaKnMIIdIe6DPKJbANLT1t79HRaZkMfWS3iF8"}
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
