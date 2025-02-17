'use client';

import { nanoid } from 'nanoid';

// Diccionario de emotes con sus respectivas imágenes
const emotes: Record<string, string> = {
  ':PotFriend:': 'https://cdn3.emoji.gg/emojis/1412-potfriend.png',
  ':PEPELU:': 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ',
};

export default function CommentSection() {
  const comments = [
    { comment: '¡Increíble contenido!', textSize: 'text-4xl' },
    { comment: '¡Cada video es una obra maestra!', textSize: 'text-2xl' },
    {
      comment:
        'Me encanta la pasión que pones en cada análisis, siempre aportando una visión única.',
      textSize: 'text-lg',
    },
    { comment: '¡Esto es oro puro!', textSize: 'text-3xl' },
    { comment: '¡Sigue así, eres un crack!', textSize: 'text-4xl' },
    {
      comment: 'Tu análisis siempre es tan acertado, disfruto cada minuto de tus videos.',
      textSize: 'text-xl',
    },
    { comment: '¡El mejor contenido sobre manga y anime que existe!', textSize: 'text-2xl' },
    {
      comment:
        'Nunca dejas de sorprenderme con tus reflexiones, es un placer verte hablar del shonen.',
      textSize: 'text-lg',
    },
    {
      comment: 'Estos comentarios son falsos, generados por IA, no te creas wey :PotFriend:',
      textSize: 'text-5xl',
    },
    {
      comment: 'Cada semana espero con ansias estos videos, no hay mejor forma de estar al día.',
      textSize: 'text-lg',
    },
    { comment: '¡Qué análisis tan bien estructurado y divertido!', textSize: 'text-xl' },
    { comment: 'Siempre logras dar en el clavo con tus opiniones.', textSize: 'text-lg' },
    { comment: 'Este contenido me hace amar aún más el manga.', textSize: 'text-2xl' },
    {
      comment: 'Eres un referente en la comunidad, gracias por todo el esfuerzo que pones.',
      textSize: 'text-lg',
    },
    { comment: '¡Simplemente genial!', textSize: 'text-5xl' },
    { comment: 'Disfruto tanto de tus videos que los veo varias veces.', textSize: 'text-xl' },
    {
      comment: 'Siempre con opiniones frescas y bien fundamentadas, ¡una maravilla!',
      textSize: 'text-lg',
    },
    { comment: '¡Tremendo!', textSize: 'text-6xl' },
    { comment: 'No hay nadie que analice el manga como tú, eres único.', textSize: 'text-xl' },
    { comment: '¡La calidad de este contenido es impresionante!', textSize: 'text-2xl' },
    {
      comment: 'Robraas vuelve a casa :PEPELU:',
      textSize: 'text-lg',
    },
  ];

  return (
    <section className="w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge">
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex flex-col gap-large">
          <h2 className="text-center font-bold text-3xl">Comentarios semanales</h2>
        </div>
        <div className="flex flex-col pt-[120px] gap-4xlarge">
          {comments.map((item) => (
            <div key={nanoid()} className="flex flex-col gap-large bg-white text-black p-2xlarge">
              <p className={`${item.textSize} block`}>
                {item.comment
                  .split(/(:\w+:)/g)
                  .map((part, index) =>
                    emotes[part] ? (
                      <img
                        key={index}
                        src={emotes[part]}
                        alt={part}
                        className="inline h-10 w-10 align-middle"
                        loading="lazy"
                      />
                    ) : (
                      part
                    ),
                  )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
