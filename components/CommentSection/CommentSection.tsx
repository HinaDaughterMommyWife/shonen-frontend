'use client';

import { useSurveyStore } from '@/store';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { cn } from '@/lib/utils';
import EmoteDecorator from '../EmoteDecorator';

const PEPELU_IMAGE = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsp7QQpTePYPiZUKgdsI4JGNxR20Db3ze9FnTB';

export default function CommentSection() {
  const { survey } = useSurveyStore();
  let comments = survey?.selectedComments || [];

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


  return (
    <section className="w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge overflow-x-hidden">
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex flex-col gap-large">
          <h2 className="text-center font-bold text-6xl my-[80px] max-md:text-4xl">Comentarios semanales</h2>
          <div className="w-full px-8 py-12 flex flex-col gap-8 mt-[280px]">
            <div>
              <span className="block text-center text-xl mt-2 font-semibold">Una cosa rapida, en la pagina de listado de emotes, las instruccionen dicen: "Para editar un emote, presiona la tecla Z y luego haz click en el emote"</span>
              <span className="block text-center text-xl mt-2 font-semibold">Pero en dispositivos moviles esta complicado presionar "una letra Z" <img
                src={'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_47e825274dcb405981374b875bc0ff66/static/light/3.0'}
                alt={'sapoweon'}
                className="inline h-8 w-8 align-middle"
                loading="lazy"
              />
              </span>
              <br />
              <span className="block text-center text-xl mt-2 font-semibold">La siguiente semana voy a hacerlo funcional para los papus móviles, que según mis stats, la gente que usa móviles es un 48%.</span>
            </div>
          </div>
          <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center md:mt-[450px] mt-[250px] md:mb-[250px] mb-[150px] overflow-visible">
            <img
              src={PEPELU_IMAGE}
              alt={'pepelu'}
              className={cn('inline h-[180px] w-[180px] align-middle')}
              loading="lazy"
            />
          </div>
          <div className="w-full px-8 py-[80px] flex flex-col gap-8" />
        </div>
        <div className="flex flex-col pt-[120px] gap-[220px]">
          {comments.map((item, index) => (
            <div className="flex flex-col gap-[180px] items-center" key={nanoid()}>
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
                <img
                  src={PEPELU_IMAGE}
                  alt={'pepelu'}
                  className={cn('inline h-[240px] w-[240px] align-middle', getRotationClass(index))}
                  loading="lazy"
                />
              )}
              {index === comments.length - 2 && (
                <div className="scene">
                  <div className="cube">
                    <img
                      src={PEPELU_IMAGE}
                      alt="Pepelu"
                      className="cube-face front animate-[rainbow_3s_linear_infinite] filter brightness-150 contrast-125 saturate-200"
                    />
                    <img
                      src={PEPELU_IMAGE}
                      alt="Pepelu"
                      className="cube-face back animate-[rainbow_3s_linear_infinite] filter brightness-150 contrast-125 saturate-200"
                    />
                    <img
                      src={PEPELU_IMAGE}
                      alt="Pepelu"
                      className="cube-face left animate-[rainbow_3s_linear_infinite] filter brightness-150 contrast-125 saturate-200"
                    />
                    <img
                      src={PEPELU_IMAGE}
                      alt="Pepelu"
                      className="cube-face right animate-[rainbow_3s_linear_infinite] filter brightness-150 contrast-125 saturate-200"
                    />
                    <img
                      src={PEPELU_IMAGE}
                      alt="Pepelu"
                      className="cube-face top animate-[rainbow_3s_linear_infinite] filter brightness-150 contrast-125 saturate-200"
                    />
                    <img
                      src={PEPELU_IMAGE}
                      alt="Pepelu"
                      className="cube-face bottom animate-[rainbow_3s_linear_infinite] filter brightness-150 contrast-125 saturate-200"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div >
    </section >
  );
}
