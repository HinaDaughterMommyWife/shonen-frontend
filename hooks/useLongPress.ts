import { useCallback, useMemo, useRef } from 'react';

const LONG_PRESS_ID_ATTR = 'longPressId';

interface UseLongPressOptions {
  onLongPress: (id: string) => void;
  onPress?: (id: string) => void;
  delay?: number;
  movementThreshold?: number;
}

/**
 * Single stable handlers object shared by every item in a list (spread onto each
 * element along with `data-long-press-id`), so memoized list items don't get a
 * fresh handler-object identity every render.
 */
export function useLongPress({ onLongPress, onPress, delay = 600, movementThreshold = 10 }: UseLongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const firedLongPressRef = useRef(false);
  const lastPointerTypeRef = useRef<string>('mouse');

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const getId = (e: React.PointerEvent | React.MouseEvent) =>
    (e.currentTarget as HTMLElement).dataset[LONG_PRESS_ID_ATTR];

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      lastPointerTypeRef.current = e.pointerType;
      firedLongPressRef.current = false;
      startPos.current = { x: e.clientX, y: e.clientY };

      const id = getId(e);
      clearTimer();
      timerRef.current = setTimeout(() => {
        firedLongPressRef.current = true;
        if (id) onLongPress(id);
      }, delay);
    },
    [onLongPress, delay, clearTimer],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startPos.current) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > movementThreshold) {
        clearTimer();
        startPos.current = null;
      }
    },
    [movementThreshold, clearTimer],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const wasPress = startPos.current !== null && !firedLongPressRef.current;
      clearTimer();
      startPos.current = null;
      const id = getId(e);
      if (wasPress && id) onPress?.(id);
    },
    [onPress, clearTimer],
  );

  const onPointerLeave = useCallback(() => {
    clearTimer();
    startPos.current = null;
  }, [clearTimer]);

  const onPointerCancel = onPointerLeave;

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    if (lastPointerTypeRef.current !== 'mouse') e.preventDefault();
  }, []);

  // Memoized: this object is spread as props onto every memoized EmoteItem in the grid.
  // A fresh object identity every render would defeat React.memo on all of them and
  // force EmoteDecorator to re-transform the whole visible grid on unrelated state
  // changes (typing in search, toggling a chip) — exactly the reported lag.
  return useMemo(
    () => ({
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave,
      onPointerCancel,
      onContextMenu,
    }),
    [onPointerDown, onPointerMove, onPointerUp, onPointerLeave, onPointerCancel, onContextMenu],
  );
}

export function longPressIdProp(id: string) {
  return { 'data-long-press-id': id };
}
