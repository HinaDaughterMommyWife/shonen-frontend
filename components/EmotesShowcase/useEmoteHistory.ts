import { EmoteData } from '@/common/emotes';
import { resolveEmoteToken } from '@/common/emoteResolver';
import { EMOTE_HISTORY_STORAGE_KEY } from '@/common/storageKeys';
import { addToLocalStorageLimited, getLocalStorageArray, setLocalStorageArray } from '@/lib/localStorage';
import { useCallback, useEffect, useState } from 'react';

export function useEmoteHistory(emotesData: Record<string, EmoteData> | null) {
  const [history, setHistory] = useState<string[]>([]);
  const [historyHydrated, setHistoryHydrated] = useState(false);

  useEffect(() => {
    const raw = getLocalStorageArray(EMOTE_HISTORY_STORAGE_KEY).slice(0, 20) as string[];

    if (!emotesData || Object.keys(emotesData).length === 0) {
      setHistory(raw);
      setHistoryHydrated(true);
      return;
    }

    const cleaned = raw.filter(name => resolveEmoteToken(name, emotesData) !== null);
    setHistory(cleaned);
    setHistoryHydrated(true);

    if (cleaned.length !== raw.length) {
      setLocalStorageArray(EMOTE_HISTORY_STORAGE_KEY, cleaned);
    }
  }, [emotesData]);

  const addEntry = useCallback((emoteName: string) => {
    addToLocalStorageLimited(EMOTE_HISTORY_STORAGE_KEY, emoteName);
    setHistory(prev => [emoteName, ...prev.slice(0, 19)]);
  }, []);

  const clearHistory = useCallback(() => {
    setLocalStorageArray(EMOTE_HISTORY_STORAGE_KEY, []);
    setHistory([]);
  }, []);

  return { history, historyHydrated, addEntry, clearHistory };
}
