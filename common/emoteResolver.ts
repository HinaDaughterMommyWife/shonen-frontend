import { Emote, EmoteData } from '@/common/emotes';
import { effectAnimationMap, effectClassMap, wrapperClassMap } from '@/common/emotesEffects';

const SPECIAL_EMOTE_NAMES = new Set(['o_o', 'o_O', 'O_O', 'O_o']);

export interface ResolvedEmoteToken {
  baseName: string;
  channelKey: string;
  emoteData: EmoteData;
  emote: Emote;
  isAnimated: boolean;
  effectKeys: string[];
}

function splitBaseNameAndEffects(token: string): { baseName: string; effectKeysRaw: string[] } {
  const tokens = token.split('_');

  if (tokens.length >= 2 && SPECIAL_EMOTE_NAMES.has(`${tokens[0]}_${tokens[1]}`)) {
    return { baseName: `${tokens[0]}_${tokens[1]}`, effectKeysRaw: tokens.slice(2) };
  }

  return { baseName: tokens[0], effectKeysRaw: tokens.slice(1) };
}

export function resolveEmoteToken(
  rawToken: string,
  emotesData: Record<string, EmoteData>,
): ResolvedEmoteToken | null {
  const { baseName, effectKeysRaw } = splitBaseNameAndEffects(rawToken);

  const effectKeys = Array.from(
    new Set(
      effectKeysRaw
        .map(key => key.toUpperCase())
        .filter(key => effectClassMap[key] || effectAnimationMap[key] || wrapperClassMap[key]),
    ),
  );

  const channelKey = Object.keys(emotesData).find(key => baseName.startsWith(key)) ?? '';
  const emoteData = emotesData[channelKey] || emotesData['twitch'];
  const emote = emoteData?.emotes[baseName];

  if (!emoteData || !emote) return null;

  return {
    baseName,
    channelKey,
    emoteData,
    emote,
    isAnimated: 'animationDuration' in emote,
    effectKeys,
  };
}
