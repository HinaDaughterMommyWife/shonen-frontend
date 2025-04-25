'use client';

import { useSurveyStore } from '@/store';
import { nanoid } from 'nanoid';
import { Children } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { cn } from '@/lib/utils';

const emotes: Record<string, string> = {
  ':PotFriend:': 'https://cdn3.emoji.gg/emojis/1412-potfriend.png',
  ':PEPELU:': 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ',
};

const LUIS_IMAGE = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsnnhdaqBEwi4ZKzYNLpRc1xlWyOGXngAU87Ds';
const PEPELU_IMAGE = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ';

export default function CommentSection() {
  const { survey } = useSurveyStore();
  // const { experimental } = useHistoricalStore();
  const comments = survey?.selectedComments || [];

  const getRotationClass = (index: number) => {
    const rotationStep = index % 4;
    console.log('index', index, 'rotationStep', rotationStep);
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
    <section className="w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge">
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex flex-col gap-large">
          <h2 className="text-center font-bold text-6xl my-[80px] max-md:text-4xl">Comentarios semanales</h2>

          <div className="flex gap-2xlarge justify-center items-center my-[780px] md:flex-row flex-col">
            <h2 className="text-center font-bold text-3xl max-md:text-2xl text-yellow-500">Si, por algun motivo, quieres hacer el Shonen Semanal en Japon, esta pagina es 100% funcional en Movil</h2>
          </div>

          <div className="flex gap-2xlarge justify-center items-center my-[420px] md:flex-row flex-col">
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
              src={LUIS_IMAGE}
              alt="luis"
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
                        <p className="text-4xl md:text-5xl whitespace-pre-line break-word">
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
      </div>
    </section>
  );
}
