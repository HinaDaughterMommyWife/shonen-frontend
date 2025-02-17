'use client';

import { EmoteChannel, EMOTES_URL } from '@/common/emotes';

// Interfaz del diccionario de emotes
interface Emote {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  averageDelay?: number;
}

interface EmoteDictionary {
  static: Array<Emote>;
  animated: Array<Emote>;
}

const dataEmotes = await fetch('/emote-data.json').then((response) => response.json());

const staticEmotes = Object.values(EmoteChannel)
  .map((channel) => dataEmotes[channel].static)
  .flat();
const animatedEmotes = Object.values(EmoteChannel)
  .map((channel) => dataEmotes[channel].animated)
  .flat();

const emotes: EmoteDictionary = {
  static: staticEmotes,
  animated: animatedEmotes,
};

const EmoteText: React.FC<{ text: string }> = ({ text }) => {
  // Expresión regular para detectar emotes en el texto
  const emoteRegex = /:([\w\d]+):/g;

  const parsedText = text.split(emoteRegex).map((part, index) => {
    if (index % 2 === 0) {
      return part; // Fragmento de texto normal
    } else {
      const emote =
        emotes.static.find((e) => e.name === part) || emotes.animated.find((e) => e.name === part);
      if (emote) {
        const backgroundImage = emote.averageDelay
          ? EMOTES_URL['darkrai'].animated
          : EMOTES_URL['darkrai'].static;
        return (
          <span
            key={index}
            className="emote"
            style={{
              width: `64px`,
              height: `64px`,
              scale: '0.5',
              display: 'inline-block',
              backgroundImage: `url(${backgroundImage})`,
              backgroundPosition: `-${emote.x}px -${emote.y}px`,
              objectFit: 'cover',
              imageRendering: 'pixelated',
            }}
            data-delay={emote.averageDelay || ''}
          />
        );
      }
      return `:${part}:`; // Si no se encuentra el emote, mostrar el texto original
    }
  });

  return <p className="emote-text">{parsedText}</p>;
};

export default EmoteText;
