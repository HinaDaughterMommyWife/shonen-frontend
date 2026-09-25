import { useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { useDraggableScroll } from '@/hooks/useDraggableScroll';
import { PINNED_CHANNEL_KEYS_ORDER } from '@/common/emoteChannelOrder';

export interface ChannelOption {
  key: string;
  username: string;
}

interface ChannelChipSelectorProps {
  channels: ChannelOption[];
  activeKeys: string[];
  onToggleChannel: (key: string) => void;
  chipSearchQuery: string;
  onChipSearchQueryChange: (query: string) => void;
  ready: boolean;
}

const ARROW_SCROLL_AMOUNT = 200;

export default function ChannelChipSelector({
  channels,
  activeKeys,
  onToggleChannel,
  chipSearchQuery,
  onChipSearchQueryChange,
  ready,
}: ChannelChipSelectorProps) {
  const { scrollRef, onMouseDown, onMouseMove, onMouseUp, onMouseLeave, scrollBy, consumeDidDrag } =
    useDraggableScroll<HTMLDivElement>();
  const hasAutoScrolledRef = useRef(false);

  const orderedChannels = useMemo(() => {
    const isTwitch = (c: ChannelOption) => c.key.toLowerCase().includes('twitch');

    const pinned = PINNED_CHANNEL_KEYS_ORDER.map(key => channels.find(c => c.key === key)).filter(
      (c): c is ChannelOption => Boolean(c),
    );
    const pinnedKeys = new Set(pinned.map(c => c.key));

    const rest = channels
      .filter(c => !pinnedKeys.has(c.key) && !isTwitch(c))
      .sort((a, b) => a.username.localeCompare(b.username));

    const twitch = channels.filter(isTwitch);

    return [...pinned, ...rest, ...twitch];
  }, [channels]);

  const visibleChannels = useMemo(() => {
    const query = chipSearchQuery.trim().toLowerCase();
    if (!query) return orderedChannels;
    return orderedChannels.filter(c => c.username.toLowerCase().includes(query));
  }, [orderedChannels, chipSearchQuery]);

  // Once the persisted selection has settled, snap the row (no animation) so the
  // nearest active chip is in view — otherwise a restored selection can sit scrolled
  // out of sight and look like nothing was selected.
  useEffect(() => {
    if (!ready || hasAutoScrolledRef.current) return;
    if (activeKeys.length === 0) return;

    const target = visibleChannels.find(c => activeKeys.includes(c.key));
    if (!target || !scrollRef.current) return;

    const chipEl = scrollRef.current.querySelector<HTMLElement>(`[data-channel-key="${target.key}"]`);
    chipEl?.scrollIntoView({ block: 'nearest', inline: 'nearest' });

    hasAutoScrolledRef.current = true;
  }, [ready, activeKeys, visibleChannels, scrollRef]);

  return (
    <div className="flex flex-col gap-small w-full">
      <Input
        value={chipSearchQuery}
        onChange={e => onChipSearchQueryChange(e.target.value)}
        placeholder="Buscar canal..."
        className="max-w-xs"
      />

      <div className="flex items-center gap-small w-full">
        <button
          type="button"
          aria-label="Desplazar canales a la izquierda"
          onClick={() => scrollBy(-ARROW_SCROLL_AMOUNT)}
          className="shrink-0 rounded-full border border-input p-1.5 hover:bg-accent transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          className="flex gap-small overflow-x-auto select-none cursor-grab active:cursor-grabbing [touch-action:pan-x] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {visibleChannels.map(channel => {
            const active = activeKeys.includes(channel.key);
            return (
              <button
                key={channel.key}
                type="button"
                data-channel-key={channel.key}
                onClick={() => {
                  if (consumeDidDrag()) return;
                  onToggleChannel(channel.key);
                }}
                className={cn(
                  'shrink-0 select-none whitespace-nowrap rounded-md border border-gray-300 px-4 py-2.5 text-base font-medium transition-colors [-webkit-touch-callout:none]',
                  active
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-accent',
                )}
              >
                {channel.username}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Desplazar canales a la derecha"
          onClick={() => scrollBy(ARROW_SCROLL_AMOUNT)}
          className="shrink-0 rounded-full border border-input p-1.5 hover:bg-accent transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
