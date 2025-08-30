'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import EmotePhysics from './EmotePhysics';
import tmi from 'tmi.js';
import { EmoteEntry } from './types';

interface SevenTVEmote {
  name: string;
  urls: string[];
  animated: boolean;
  width: number;
  height: number;
}

const TWITCH_CHANNEL = 'thedarkraimola';
const TWITCH_ID = '57105861';

const MAX_EMOTE_QUEUE_SIZE = 50;

const LIMIT_EMOTES = 4;

export default function EmoteContainer() {
  const [emoteQueue, setEmoteQueue] = useState<EmoteEntry[]>([]);
  const clientRef = useRef<tmi.Client | null>(null);
  const sevenTVEmotesRef = useRef<Record<string, SevenTVEmote>>({});

  useEffect(() => {
    const fetchEmotes = async () => {
      try {
        const sevenTVRes = await fetch(`https://api.7tv.app/v3/users/twitch/${TWITCH_ID}`);
        const sevenTVData = await sevenTVRes.json();

        const sevenTVEmoteMap: Record<string, SevenTVEmote> = {};

        if (sevenTVRes.ok) {
          for (const emote of sevenTVData.emote_set.emotes) {
            sevenTVEmoteMap[emote.name] = {
              name: emote.name,
              urls: emote.data.host.files.map((f: any) => `https:${emote.data.host.url}/${f.name}`),
              animated: emote.data.animated,
              width: emote.data.host.files[0].width,
              height: emote.data.host.files[0].height,
            };
          }

          sevenTVEmotesRef.current = sevenTVEmoteMap;
        }
      } catch (err) {
        console.error('Error loading emotes:', err);
      }
    };

    fetchEmotes();
  }, []);

  const cleanupQueue = useCallback((currentQueue: EmoteEntry[]) => {
    if (currentQueue.length > MAX_EMOTE_QUEUE_SIZE) {
      return currentQueue.slice(currentQueue.length - MAX_EMOTE_QUEUE_SIZE);
    }
    return currentQueue;
  }, []);

  const onEmoteEnd = useCallback(
    (id: string) => {
      setEmoteQueue((prev) => cleanupQueue(prev.filter((e) => e.id !== id)));
    },
    [cleanupQueue],
  );

  useEffect(() => {
    if (!clientRef.current) {
      const client = new tmi.Client({
        connection: { secure: true, reconnect: true, timeout: 10000 },
        channels: [TWITCH_CHANNEL],
      });

      client.connect().catch(console.warn);
      clientRef.current = client;
    }

    // @ts-ignore
    const onMessageHandler = (channel, tags, message, self) => {
      if (!tags || self) return;

      const newEmotes: EmoteEntry[] = [];

      let countEmotes = 0;

      if (tags.emotes) {
        Object.keys(tags.emotes).forEach((emoteId) => {
          if (countEmotes >= LIMIT_EMOTES) {
            return;
          }
          countEmotes++;

          const id = crypto.randomUUID();
          newEmotes.push({
            id,
            src: `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/light/3.0`,
            animated: true,
            width: 64,
            height: 64,
            isTwitch: true,
          });
        });
      }

      let sevenTVMap: Record<string, EmoteEntry> = {};
      let sevenEmoteIndex = 0;

      for (const word of message.split(/\s+/)) {
        const sevenTVEmote = sevenTVEmotesRef.current[word];
        if (sevenTVEmote) {
          const id = crypto.randomUUID();
          const preferred = sevenTVEmote.animated
            ? sevenTVEmote.urls.find((u) => u.endsWith('.webp')) || sevenTVEmote.urls.at(0)
            : sevenTVEmote.urls.at(0);
          if (preferred && sevenEmoteIndex <= LIMIT_EMOTES - 1) {
            sevenEmoteIndex++;
            sevenTVMap[word] = {
              id: id,
              src: preferred,
              animated: true,
              width: sevenTVEmote.width,
              height: sevenTVEmote.height,
              isTwitch: false,
            }; 
          }
        }
      }

      for (const [_key, value] of Object.entries(sevenTVMap)) {
        newEmotes.push(value);
      }

      if (newEmotes.length > 0) {
        setEmoteQueue((prev) => cleanupQueue([...prev, ...newEmotes]));
      }
    };

    clientRef.current?.on('message', onMessageHandler);

    return () => {
      clientRef.current?.removeListener('message', onMessageHandler);
      clientRef.current?.disconnect().catch(console.warn).finally(() => (clientRef.current = null));
      clientRef.current = null;
    };
  }, []);

  return <EmotePhysics emotes={emoteQueue} onEmoteEnd={onEmoteEnd} />;
}
