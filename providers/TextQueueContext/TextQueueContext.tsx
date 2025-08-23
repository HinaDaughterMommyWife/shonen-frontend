'use client';

import { createContext, useContext, useRef, useState, useCallback } from 'react';

export const TextStatus = {
  Entering: 'entering',
  Visible: 'visible',
  Exiting: 'exiting',
} as const;

export type TextItem = {
  id: string;
  text: string;
  status: string
};

type TextQueueContextType = {
  queue: TextItem[];
  enqueue: (text: string) => void;
  queueRef: React.RefObject<TextItem[]>;
};

const TextQueueContext = createContext<TextQueueContextType | undefined>(undefined);

const ANIMATION_DURATION = 2000;

export function TextQueueProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<TextItem[]>([]);
  const queueRef = useRef<TextItem[]>([]);
  const animatingRef = useRef(false);

  const enqueue = useCallback((text: string) => {
    const item: TextItem = { id: crypto.randomUUID(), text, status: 'entering' };
    queueRef.current.push(item);
    startProcessor();
  }, []);

  const startProcessor = useCallback(() => {
    if (!animatingRef.current) processLoop();
  }, []);

  const processLoop = useCallback(async () => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    while (queueRef.current.length > 0) {
      const nextItem = queueRef.current.shift()!;

      setQueue((prev) => [
        ...prev.map((t) => (t.status === 'visible' ? { ...t, status: 'exiting' } : t)),
        nextItem,
      ]);

      await new Promise((res) => setTimeout(res, ANIMATION_DURATION));

      setQueue((prev) =>
        prev
          .map((t) => (t.status === 'entering' ? { ...t, status: 'visible' } : t))
          .filter((t) => t.status !== 'exiting')
      );
    }

    animatingRef.current = false;
  }, []);

  return (
    <TextQueueContext.Provider value={{ queue, enqueue, queueRef }}>
      {children}
    </TextQueueContext.Provider>
  );
}

export function useTextQueue() {
  const ctx = useContext(TextQueueContext);
  if (!ctx) throw new Error('useTextQueue debe usarse dentro de <TextQueueProvider>');
  return ctx;
}
