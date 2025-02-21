'use client';

import { useSurveyStore } from '@/store';
import { nanoid } from 'nanoid';
import { Children } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const emotes: Record<string, string> = {
  ':PotFriend:': 'https://cdn3.emoji.gg/emojis/1412-potfriend.png',
  ':PEPELU:': 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ',
};

export default function CommentSection() {
  const { survey } = useSurveyStore();

  const comments = survey?.selectedComments || [];

  return (
    <section className="w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge">
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex flex-col gap-large">
          <h2 className="text-center font-bold text-6xl my-[80px]">Comentarios semanales</h2>
          <div className="flex md:flex-row gap-2xlarge justify-center items-center my-[780px]">
            <img
              src={'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ'}
              alt={'pepelu'}
              className="inline h-[256px] w-[256px] align-middle animate-[invert-wave_8s_infinite] [animation-delay:0s]"
              loading="lazy"
            />
            <img
              src={'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ'}
              alt={'pepelu'}
              className="inline h-32 w-32 align-middle animate-[invert-wave_8s_infinite] [animation-delay:1s]"
              loading="lazy"
            />
            <img
              src={'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ'}
              alt={'pepelu'}
              className="inline h-16 w-16 align-middle animate-[invert-wave_8s_infinite] [animation-delay:2s]"
              loading="lazy"
            />
            <img
              src={'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ'}
              alt={'pepelu'}
              className="inline h-8 w-8 align-middle animate-[invert-wave_8s_infinite] [animation-delay:3s]"
              loading="lazy"
            />
            <img
              src={'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ'}
              alt={'pepelu'}
              className="inline h-4 w-4 align-middle animate-[invert-wave_8s_infinite] [animation-delay:4s]"
              loading="lazy"
            />
            <img
              src={'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ'}
              alt={'pepelu'}
              className="inline h-2 w-2 align-middle animate-[invert-wave_8s_infinite] [animation-delay:5s]"
              loading="lazy"
            />
            <img
              src={'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ'}
              alt={'pepelu'}
              className="inline h-1 w-1 align-middle animate-[invert-wave_8s_infinite] [animation-delay:6s]"
              loading="lazy"
            />
            <img
              src={'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ'}
              alt={'pepelu'}
              className="inline h-0.5 w-0.5 align-middle animate-[invert-wave_8s_infinite] [animation-delay:7s]"
              loading="lazy"
            />
          </div>
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
                        <p className="text-5xl whitespace-pre-line">
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
                  src={
                    'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ'
                  }
                  alt={'pepelu'}
                  className={`inline h-[240px] w-[240px] align-middle`}
                  loading="lazy"
                />
              )}
              {index === comments.length - 2 && (
                <div className="scene">
                  <div className="cube">
                    <img
                      src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
                      alt="Pepelu"
                      className="cube-face front"
                    />
                    <img
                      src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
                      alt="Pepelu"
                      className="cube-face back"
                    />
                    <img
                      src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
                      alt="Pepelu"
                      className="cube-face left"
                    />
                    <img
                      src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
                      alt="Pepelu"
                      className="cube-face right"
                    />
                    <img
                      src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
                      alt="Pepelu"
                      className="cube-face top"
                    />
                    <img
                      src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
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

/*
<img
                  src={
                    'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ'
                  }
                  alt={'pepelu'}
                  className={`inline h-[420px] w-[420px] align-middle cube-face`}
                  loading="lazy"
                />
*/

/*
{index === comments.length - 2 && (
                <div className="scene">
                  <div className="cube">
                    <img
                      src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
                      alt="Pepelu"
                      className="cube-face front"
                    />
                    <img
                      src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
                      alt="Pepelu"
                      className="cube-face back"
                    />
                    <img
                      src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
                      alt="Pepelu"
                      className="cube-face left"
                    />
                    <img
                      src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
                      alt="Pepelu"
                      className="cube-face right"
                    />
                    <img
                      src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
                      alt="Pepelu"
                      className="cube-face top"
                    />
                    <img
                      src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ"
                      alt="Pepelu"
                      className="cube-face bottom"
                    />
                  </div>
                </div>
              )}
*/
