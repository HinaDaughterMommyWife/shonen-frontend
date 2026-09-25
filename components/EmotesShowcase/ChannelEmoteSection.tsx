import { EmoteData } from '@/common/emotes';
import EmoteDecorator from '../EmoteDecorator';
import React from 'react';
import EmoteItem from './EmoteItem';

interface ChannelEmoteSectionProps {
  emoteNames: string[];
  emotesData: Record<string, EmoteData>;
  longPressHandlers: Record<string, unknown>;
}

function ChannelEmoteSection({ emoteNames, emotesData, longPressHandlers }: ChannelEmoteSectionProps) {
  if (emoteNames.length === 0) return null;

  return (
    <div className="flex flex-col w-full mt-large">
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

export default React.memo(ChannelEmoteSection);
