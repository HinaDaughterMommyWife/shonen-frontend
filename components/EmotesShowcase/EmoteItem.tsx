import React from 'react';

export const emoteItemStyles =
  "cursor-pointer select-none relative inline-flex items-center justify-center coarse:active:outline-none transition after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-gray-200/80 after:opacity-0 coarse:active:after:opacity-50 after:transition after:duration-200 after:pointer-events-none";

interface EmoteItemProps {
  emoteName: string;
  longPressHandlers: Record<string, unknown>;
  children: React.ReactNode;
}

// `children` must be the literal emote-name string passed down from the caller (not
// reconstructed here) so EmoteDecorator's transform() — which walks the JSX tree it's
// given before anything renders — can see the raw text and swap it for a sprite.
function EmoteItem({ emoteName, longPressHandlers, children }: EmoteItemProps) {
  return (
    <span
      data-long-press-id={emoteName}
      className={emoteItemStyles}
      style={{ touchAction: 'none' }}
      {...longPressHandlers}
    >
      {children}
    </span>
  );
}

export default React.memo(EmoteItem);
