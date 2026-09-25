'use client';
import { EmoteData, setEmotesData } from '@/common/emotes';
import { EMOTE_SEARCH_FILTERS_STORAGE_KEY } from '@/common/storageKeys';
import { getLocalStorage, setLocalStorage } from '@/lib/localStorage';
import { useLongPress } from '@/hooks/useLongPress';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import EmoteEditor from './EmoteEditor';
import ChannelChipSelector, { ChannelOption } from './ChannelChipSelector';
import EmoteSearchBar, { MIN_SEARCH_LENGTH } from './EmoteSearchBar';
import ChannelEmoteSection from './ChannelEmoteSection';
import EmoteHistorySection from './EmoteHistorySection';
import { useEmoteHistory } from './useEmoteHistory';
import { DEFAULT_ACTIVE_CHANNEL_KEYS } from '@/common/emoteChannelOrder';
import { cn } from '@/lib/utils';

interface EmotesShowcaseProps {
    emotesData: Record<string, EmoteData> | null;
}

interface SearchFilters {
    searchQuery: string;
    chipSearchQuery: string;
    activeChannelKeys: string[];
}

const EXCLUDED_SUBSTRINGS = ['Pit', 'Toes'];

export default function EmotesShowcase({ emotesData }: EmotesShowcaseProps) {
    const safeEmotesData = useMemo(() => emotesData ?? {}, [emotesData]);

    useEffect(() => {
        setEmotesData(safeEmotesData);
    }, [safeEmotesData]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEmoteName, setSelectedEmoteName] = useState<string | null>('');

    const [searchQuery, setSearchQuery] = useState('');
    const [chipSearchQuery, setChipSearchQuery] = useState('');
    const [activeChannelKeys, setActiveChannelKeys] = useState<string[]>(DEFAULT_ACTIVE_CHANNEL_KEYS);
    const [filtersHydrated, setFiltersHydrated] = useState(false);

    const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

    const { history, historyHydrated, addEntry, clearHistory } = useEmoteHistory(emotesData);

    useEffect(() => {
        const raw = getLocalStorage(EMOTE_SEARCH_FILTERS_STORAGE_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as Partial<SearchFilters>;
                setSearchQuery(parsed.searchQuery ?? '');
                setChipSearchQuery(parsed.chipSearchQuery ?? '');
                setActiveChannelKeys(parsed.activeChannelKeys ?? DEFAULT_ACTIVE_CHANNEL_KEYS);
            } catch {
                // ignore malformed persisted filters
            }
        }
        setFiltersHydrated(true);
    }, []);

    // Everything client-only-hydrated (persisted filters + cleaned history) settles into
    // state on mount across a couple of renders — showing content before that finishes
    // means the user sees the default filters, then a jump to the persisted ones. Keep
    // the content invisible until both are ready, then fade it in as one atomic reveal.
    const ready = filtersHydrated && historyHydrated;

    useEffect(() => {
        if (!filtersHydrated) return;
        const filters: SearchFilters = { searchQuery: debouncedSearchQuery, chipSearchQuery, activeChannelKeys };
        setLocalStorage(EMOTE_SEARCH_FILTERS_STORAGE_KEY, JSON.stringify(filters));
    }, [filtersHydrated, debouncedSearchQuery, chipSearchQuery, activeChannelKeys]);

    const channels: ChannelOption[] = useMemo(
        () => Object.entries(safeEmotesData).map(([key, data]) => ({ key, username: data.username })),
        [safeEmotesData],
    );

    const channelSections = useMemo(() => {
        const trimmed = debouncedSearchQuery.trim().toLowerCase();
        const query = trimmed.length >= MIN_SEARCH_LENGTH ? trimmed : '';

        // A search of 3+ letters looks across every channel and collapses the results
        // into a single block, ignoring the channel chip filter entirely.
        if (query) {
            const seen = new Set<string>();
            const emoteNames: string[] = [];

            for (const data of Object.values(safeEmotesData)) {
                for (const name of Object.keys(data.emotes)) {
                    if (seen.has(name)) continue;
                    if (EXCLUDED_SUBSTRINGS.some(s => name.includes(s))) continue;
                    if (!name.toLowerCase().includes(query)) continue;
                    seen.add(name);
                    emoteNames.push(name);
                }
            }

            return [{ key: '__search__', emoteNames }];
        }

        // No (usable) search text: the chip selection decides which channels show.
        const sections: { key: string; emoteNames: string[] }[] = [];
        for (const key of activeChannelKeys) {
            const data = safeEmotesData[key];
            if (!data) continue;
            const emoteNames = Object.keys(data.emotes).filter(
                name => !EXCLUDED_SUBSTRINGS.some(s => name.includes(s)),
            );
            sections.push({ key, emoteNames });
        }

        return sections;
    }, [safeEmotesData, activeChannelKeys, debouncedSearchQuery]);

    const copyEmote = useCallback((emoteName: string) => {
        if ((window as any).stonks) {
            (window as any).stonks.event(`emote-copied-${emoteName}`);
        }
        toast(`${emoteName} copiado al portapapeles.`, {
            duration: 2000,
            style: { background: '#333', color: '#fff' },
        });
        navigator.clipboard.writeText(emoteName);
    }, []);

    // Clicking a regular-panel emote copies it AND bumps it into history.
    const handleShortPress = useCallback(
        (emoteName: string) => {
            copyEmote(emoteName);
            addEntry(emoteName);
        },
        [copyEmote, addEntry],
    );

    // Clicking a history emote only copies — it's already in history, re-adding it
    // duplicates the entry instead of just moving it.
    const handleHistoryShortPress = useCallback(
        (emoteName: string) => {
            copyEmote(emoteName);
        },
        [copyEmote],
    );

    const handleLongPress = useCallback((emoteName: string) => {
        setSelectedEmoteName(emoteName);
        setDialogOpen(true);
    }, []);

    const longPressHandlers = useLongPress({
        onLongPress: handleLongPress,
        onPress: handleShortPress,
        delay: 600,
    });

    const historyLongPressHandlers = useLongPress({
        onLongPress: handleLongPress,
        onPress: handleHistoryShortPress,
        delay: 600,
    });

    const handleToggleChannel = useCallback((key: string) => {
        setActiveChannelKeys(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
    }, []);

    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setChipSearchQuery('');
        setActiveChannelKeys(DEFAULT_ACTIVE_CHANNEL_KEYS);
    }, []);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <div className={cn('flex flex-col gap-large w-full transition-opacity duration-300', ready ? 'opacity-100' : 'opacity-0')}>
                <EmoteHistorySection
                    emoteNames={history}
                    emotesData={safeEmotesData}
                    longPressHandlers={historyLongPressHandlers}
                    onClearHistory={clearHistory}
                />

                <ChannelChipSelector
                    channels={channels}
                    activeKeys={activeChannelKeys}
                    onToggleChannel={handleToggleChannel}
                    chipSearchQuery={chipSearchQuery}
                    onChipSearchQueryChange={setChipSearchQuery}
                    ready={ready}
                />

                <EmoteSearchBar
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                    onClearFilters={handleClearFilters}
                />

                <div className="flex flex-col w-full min-h-[568px]">
                    {channelSections.map(({ key, emoteNames }) => (
                        <ChannelEmoteSection
                            key={key}
                            emoteNames={emoteNames}
                            emotesData={safeEmotesData}
                            longPressHandlers={longPressHandlers}
                        />
                    ))}
                </div>
            </div>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Añadir efectos a {selectedEmoteName}</DialogTitle>
                </DialogHeader>
                <EmoteEditor emoteName={selectedEmoteName ?? ''} emotesData={safeEmotesData} handleAddHistoryEmote={addEntry} />
            </DialogContent>
        </Dialog>
    );
}
