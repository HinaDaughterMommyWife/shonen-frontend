import { useIsTouchDevice } from './useIsTouchDevice';
import { useRef, useCallback } from 'react';

interface UseTouchLongPressOptions<T> {
  onLongPress: (value: T) => void;
  delay?: number;
  movementThreshold?: number;
}

export function useTouchLongPress<T = string>({
  onLongPress,
  delay = 600,
  movementThreshold = 10,
}: UseTouchLongPressOptions<T>) {
  const isTouch = useIsTouchDevice();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const getHandlers = useCallback(
    (value: T) => {
      const start = (e: React.TouchEvent) => {
        if (!isTouch) return;

        const touch = e.touches[0];
        startPos.current = { x: touch.clientX, y: touch.clientY };

        timerRef.current = setTimeout(() => {
          onLongPress(value);
        }, delay);
      };

      const cancel = () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        startPos.current = null;
      };

      const move = (e: React.TouchEvent) => {
        if (!startPos.current) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startPos.current.x;
        const dy = touch.clientY - startPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > movementThreshold) {
          cancel();
        }
      };

      return isTouch
        ? {
            onTouchStart: start,
            onTouchMove: move,
            onTouchEnd: cancel,
            onTouchCancel: cancel,
            onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
          }
        : {};
    },
    [onLongPress, delay, movementThreshold, isTouch],
  );

  return getHandlers;
}
