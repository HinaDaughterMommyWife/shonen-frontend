'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (el?: HTMLElement | null) => void;
      };
    };
  }
}

const WIDGETS_SRC = 'https://platform.x.com/widgets.js';

/**
 * Loads platform.x.com/widgets.js once and re-hydrates embeds when `reloadKey` changes.
 */
export function useTwitterWidgets(reloadKey?: string) {
  useEffect(() => {
    const existing = document.querySelector(`script[src="${WIDGETS_SRC}"]`);

    const load = () => {
      window.twttr?.widgets?.load();
    };

    if (existing) {
      load();
      return;
    }

    const script = document.createElement('script');
    script.src = WIDGETS_SRC;
    script.async = true;
    script.charset = 'utf-8';
    script.onload = load;
    document.body.appendChild(script);

    // Do not remove the shared script on unmount — other sections may still need it.
  }, []);

  useEffect(() => {
    if (reloadKey == null) return;
    // Defer so rehype-raw DOM (blockquotes) exists before widgets scan
    const id = window.setTimeout(() => {
      window.twttr?.widgets?.load();
    }, 50);
    return () => window.clearTimeout(id);
  }, [reloadKey]);
}
