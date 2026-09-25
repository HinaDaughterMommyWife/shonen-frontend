import { EmoteData } from '@/common/emotes';
import EmoteDecorator from '../EmoteDecorator';
import { X } from 'lucide-react';
import React from 'react';
import EmoteItem from './EmoteItem';

interface EmoteHistorySectionProps {
  emoteNames: string[];
  emotesData: Record<string, EmoteData>;
  longPressHandlers: Record<string, unknown>;
  onClearHistory: () => void;
}

function EmoteHistorySection({ emoteNames, emotesData, longPressHandlers, onClearHistory }: EmoteHistorySectionProps) {
  if (emoteNames.length === 0) return null;

  return (
    <div className="flex gap-medium justify-center flex-col items-center mt-large">
      <div className="flex items-center gap-small">
        <span className="text-sm font-semibold uppercase text-muted-foreground">Historial</span>
        <button
          type="button"
          onClick={onClearHistory}
          className="flex items-center gap-0.5 text-xs text-red-500 hover:text-red-600 transition-colors"
        >
          <X className="size-3" />
          Borrar historial
        </button>
      </div>
      <EmoteDecorator emotesDataSSR={emotesData}>
        <div className="flex flex-wrap w-full gap-small justify-center">
          {emoteNames.map(emoteName => (
            <EmoteItem key={emoteName} emoteName={emoteName} longPressHandlers={longPressHandlers}>
              {emoteName}
            </EmoteItem>
          ))}
        </div>
      </EmoteDecorator>
    </div>
  );
}

export default React.memo(EmoteHistorySection);
