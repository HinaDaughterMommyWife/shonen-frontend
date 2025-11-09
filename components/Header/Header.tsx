'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Section, useSectionStore } from '@/store';
import { sectionData } from '@/common';
import { useStateManager } from '@/providers/StateManager';
import { CountdownDisplay } from '../CountdownDisplay';
import { useTextQueue } from '../../providers/TextQueueContext';
import EmoteDecorator from '../EmoteDecorator';
import { cn, isJSON } from '../../lib/utils';

const ANIMATION_DURATION = 1500;

const WS_URL = 'wss://kentucky-runner-crossing-overhead.trycloudflare.com';

interface TextItem {
  id: string;
  message: string;
  lastMessage: string;
  totalMessages: number;
}

export default function Header() {
  const { queue, enqueue } = useTextQueue();

  const [isSticky, setIsSticky] = useState(false);
  const { sectionPage, setSectionPage } = useStateManager();
  const wsRef = useRef<WebSocket | null>(null);
  const [totalMessages, setTotalMessages] = useState(0);

  const sections = Object.values(sectionData).sort((a, b) => a.order - b.order);
  const currentIndex = sections.findIndex((s) => s.order === sectionData[sectionPage]?.order);

  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  let totalMessageString = Number(totalMessages).toLocaleString('en-US');

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ Conectado al WebSocket');
    };

    ws.onmessage = (event) => {
      const message = event.data;

      if (typeof message !== 'string') {
        console.warn('Error: ', message);
        return;
      }

      if (isJSON(message)) {
        const data = JSON.parse(message) as TextItem;

        if (data.message || data.lastMessage) {
          enqueue(data.message || data.lastMessage);
        }

        if (data.totalMessages) {
          setTotalMessages(data.totalMessages);
        }
      }
    };

    ws.onerror = (error) => {
      console.error('❌ Error en WebSocket:', error);
    };

    ws.onclose = () => {
      console.log('🔌 Conexión cerrada');
    };

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('ping');
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, []);

  return (
    <>
      <header
        id="main-header"
        className={clsx(
          'w-full px-small sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge transition-opacity duration-300',
          isSticky ? 'opacity-0' : 'opacity-100',
        )}
      >
        <div className="mx-auto block w-full max-w-[1240px] text-center ">
          <h2 className="scroll-m-20 border-b pb-2 text-4xl md:text-5xl font-light tracking-tight first:mt-0 font-great-fighter">
            El Shonen Semanal
          </h2>
          <div className="mt-2">
            <span className="font-semibold">
              Ultimo Mensaje de Robraas (&nbsp;
              <img
                src={
                  'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0e109fdbe7394201924a2189264530aa/static/light/3.0'
                }
                alt={'pepelu'}
                className="inline h-5 w-5 align-middle"
                loading="lazy"
              />{' '}
              )<span className="text-xs text-gray-500">&nbsp;&nbsp;En tiempo real</span>
              <span className="inline-flex items-center ml-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500 animate-ping mr-1"></span>
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75"></span>
              </span>
            </span>
          </div>
          <div className="relative w-full md:min-h-[70px] min-h-[120px] overflow-hidden flex items-center justify-center fade-vertical">
            {queue.map((item) => (
              <span
                key={item.id}
                className={clsx(
                  'absolute w-full text-center p-1',
                  item.status === 'entering' && 'animate-slideDown',
                  item.status === 'exiting' && 'animate-slideUp',
                )}
                style={{ animationDuration: `${ANIMATION_DURATION}ms` }}
              >
                <EmoteDecorator displaySize={20}>{item.text}</EmoteDecorator>
              </span>
            ))}
          </div>
          <div
            className={cn(
              'flex justify-center opacity-0 transition-opacity duration-1000 ease-in-out',
              {
                'opacity-100': totalMessages !== 0,
              },
            )}
          >
              <span className="text-sm text-gray-500">
                Total mensajes enviados por Robraas: {totalMessageString}
              </span>
          </div>
        </div>
      </header>
    </>
  );
}
