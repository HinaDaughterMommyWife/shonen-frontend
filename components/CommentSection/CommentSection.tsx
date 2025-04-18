'use client';

import { useSurveyStore } from '@/store';
import { useHistoricalStore } from '@/store/historical';
import { nanoid } from 'nanoid';
import { Children } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import Expermient from './Expermient';
import Luis from './Luis';

const emotes: Record<string, string> = {
  ':PotFriend:': 'https://cdn3.emoji.gg/emojis/1412-potfriend.png',
  ':PEPELU:': 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ',
};

const PEPELU_IMAGE = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsnnhdaqBEwi4ZKzYNLpRc1xlWyOGXngAU87Ds';
// const PEPELU_IMAGE = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ';

export default function CommentSection() {
  const { survey } = useSurveyStore();
  const { experimental } = useHistoricalStore();
  const comments = survey?.selectedComments || [];

  return (
    <section className="w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge">
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex flex-col gap-large">
          <h2 className="text-center font-bold text-6xl my-[80px]">Comentarios semanales</h2>
          <div className="w-full px-8 pt-12 pb-[600px] flex flex-col gap-8 mt-[580px]">
            <div>
              <h2 className="text-3xl font-bold text-center">
                Con respecto a las "Palabras mas usadas"
              </h2>
              <span className="block text-center text-gray-500 text-base mt-2">
                Necesito un par de semanas para hacer esto mas automatico, pero, por favor Darkrai, responde esta pregunta:
              </span>
              <span className="block text-center text-yellow-500 text-base mt-2">
                ¿Filtro los emotes, los !comandos y los @robraas? Porque si no lo hago, veras el mismo Top cada semana xd
              </span>
            </div>
          </div>

          <div className="w-full px-8 pt-12 pb-[600px] flex flex-col gap-8 mt-[300px]">
            <h2 className="text-2xl font-bold text-center">
              Este comentario me llego a alma, en su honor esta semana no estaran los Pepelus
            </h2>
            <img
              src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsBWss3zNV64s5bjuGWe37Ic8z19wEDvlqmRxH"
              alt="pepelu"
              className="self-center h-auto w-[456px] align-middle my-10"
              loading="lazy"
            />
            <img
              src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsgNOiRTk6w8bydkmZ40HcCSDpWYNJuQleo7MU"
              alt="pepelu"
              className="self-center h-auto w-[456px] align-middle"
              loading="lazy"
            />
          </div>
          <div className="w-full px-8 pt-12 pb-[600px] flex flex-col gap-8 mt-[300px]">
            <h2 className="text-3xl font-bold text-center">
              En su lugar...
            </h2>
          </div>
          <Luis />
          {/* {experimental.length > 0 && (
            <Expermient data={experimental} />
          )} */}
          {/* <div className="flex gap-2xlarge justify-center items-center my-[780px] md:flex-row flex-col">
            <img
              src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
              alt="pepelu"
              className="inline h-[256px] w-[256px] align-middle animate-spin-wave [animation-delay:0s]"
              loading="lazy"
            />
            <img
              src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
              alt="pepelu"
              className="inline h-32 w-32 align-middle animate-spin-wave [animation-delay:0.5s]"
              loading="lazy"
            />
            <img
              src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
              alt="pepelu"
              className="inline h-16 w-16 align-middle animate-spin-wave [animation-delay:1s]"
              loading="lazy"
            />
            <img
              src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
              alt="pepelu"
              className="inline h-8 w-8 align-middle animate-spin-wave [animation-delay:1.5s]"
              loading="lazy"
            />
            <img
              src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
              alt="pepelu"
              className="inline h-4 w-4 align-middle animate-spin-wave [animation-delay:2s]"
              loading="lazy"
            />
            <img
              src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
              alt="pepelu"
              className="inline h-2 w-2 align-middle animate-spin-wave [animation-delay:2.5s]"
              loading="lazy"
            />
            <img
              src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
              alt="pepelu"
              className="inline h-1 w-1 align-middle animate-spin-wave [animation-delay:3s]"
              loading="lazy"
            />
            <img
              src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
              alt="pepelu"
              className="inline h-0.5 w-0.5 align-middle animate-spin-wave [animation-delay:3.5s]"
              loading="lazy"
            />
          </div> */}
          <div className="w-full px-8 py-[80px] flex flex-col gap-8 " />
        </div>
        <div className="flex flex-col pt-[120px] gap-[220px]">
          {comments.map((item, index) => (
            <div className="flex flex-col gap-[180px] items-center" key={nanoid()}>
              <div key={nanoid()} className="flex flex-col bg-white text-black p-2xlarge">
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
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {children}
                      </a>
                    ),
                    p: ({ children }) => {
                      return (
                        <p className="text-5xl whitespace-pre-line break-word">
                          {Children.map(children, (child) => {
                            if (typeof child === 'string') {
                              return child
                                .split(/(:\w+:)/g)
                                .map((part, index) =>
                                  emotes[part] ? (
                                    <img
                                      key={index}
                                      src={emotes[part]}
                                      alt={part}
                                      className="inline h-12 w-12 align-middle"
                                      loading="lazy"
                                    />
                                  ) : (
                                    part
                                  ),
                                );
                            }
                            return child;
                          })}
                        </p>
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
                  className={`inline h-[240px] w-[240px] align-middle`}
                  loading="lazy"
                />
              )}
              {index === comments.length - 2 && (
                <div className="scene">
                  <div className="cube">
                    <img
                      src={PEPELU_IMAGE}
                      alt="Pepelu"
                      className="cube-face front"
                    />
                    <img
                      src={PEPELU_IMAGE}
                      alt="Pepelu"
                      className="cube-face back"
                    />
                    <img
                      src={PEPELU_IMAGE}
                      alt="Pepelu"
                      className="cube-face left"
                    />
                    <img
                      src={PEPELU_IMAGE}
                      alt="Pepelu"
                      className="cube-face right"
                    />
                    <img
                      src={PEPELU_IMAGE}
                      alt="Pepelu"
                      className="cube-face top"
                    />
                    <img
                      src={PEPELU_IMAGE}
                      alt="Pepelu"
                      className="cube-face bottom"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
