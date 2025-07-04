'use client';

import { useSurveyStore } from '@/store';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { cn, generateLinearSteps } from '@/lib/utils';
import EmoteDecorator from '../EmoteDecorator';
import CaitThinking from './CaitThinking';

const PEPELU_IMAGE = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ';

export default function CommentSection() {
  const { survey } = useSurveyStore();
  let comments = survey?.selectedComments || [];

  const linearSteps = generateLinearSteps(comments.length - 1, 8, 1200).slice(1);

  return (
    <section className="w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge overflow-x-hidden">
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex flex-col gap-large">
          <h2 className="text-center font-bold text-6xl my-[80px] max-md:text-4xl">Comentarios semanales</h2>

          <div className="w-full flex justify-center flex-col gap-xlarge mt-[500px] text-center">
            <h3 className="text-center font-bold text-3xl">Un Short de "Portal Esperanza", no tiene perdida xd</h3>
            <h3 className="text-center font-bold text-sm">(bajale el audio a menos de la mitad que yo casi me quedo sordo xd)</h3>
            <a href="https://www.youtube.com/shorts/Yc5h1oZbeBI" target="_blank" className="underline text-blue-500">https://www.youtube.com/shorts/Yc5h1oZbeBI</a>
          </div>
          <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center md:mt-[450px] mt-[250px] md:mb-[250px] mb-[150px] overflow-visible">
            <img
              src={PEPELU_IMAGE}
              alt={'pepelu'}
              className={cn('inline size-[12px] align-middle')}
              loading="lazy"
            />
          </div>
          <div className="w-full px-8 py-[80px] flex flex-col gap-8" />
        </div>
        <div className="flex flex-col pt-[120px] gap-[560px]">
          {comments.map((item, index) => (
            <div className="flex flex-col gap-[560px] items-center" key={nanoid()}>
              <div key={nanoid()} className="flex flex-col bg-white text-black md:p-2xlarge p-large">
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
                <div className="relative w-fit h-fit overflow-visible">
                  <div
                    className="relative"
                    style={{
                      width: Math.floor(linearSteps[index]) + 'px',
                      height: Math.floor(linearSteps[index]) + 'px',
                    }}
                  >
                    <img
                      src={PEPELU_IMAGE}
                      alt="pepelu"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

              )}
              {index === comments.length - 2 && (
                <CaitThinking />
              )}
            </div>
          ))}
        </div>
      </div >
    </section >
  );
}
