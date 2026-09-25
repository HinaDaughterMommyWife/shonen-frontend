import { useCallback, useEffect, useRef } from 'react';

const DRAG_CLICK_SUPPRESS_THRESHOLD = 5;

export function useDraggableScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T | null>(null);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    // Prevent native text/element selection while drag-scrolling with the mouse.
    e.preventDefault();
    isDraggingRef.current = true;
    didDragRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftStartRef.current = scrollRef.current.scrollLeft;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    const delta = e.pageX - startXRef.current;
    if (Math.abs(delta) > DRAG_CLICK_SUPPRESS_THRESHOLD) didDragRef.current = true;
    scrollRef.current.scrollLeft = scrollLeftStartRef.current - delta;
  }, []);

  const stopDragging = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // React attaches its wheel listener as passive, so calling preventDefault() through
  // the synthetic onWheel prop is a no-op that spams a console warning. Attach a real
  // DOM listener with { passive: false } instead, so converting vertical wheel/trackpad
  // input (e.g. a mouse with no horizontal wheel) into horizontal scroll actually works.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaX !== 0) return;
      if (el.scrollWidth <= el.clientWidth) return;

      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const scrollBy = useCallback((amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  const consumeDidDrag = useCallback(() => {
    const dragged = didDragRef.current;
    didDragRef.current = false;
    return dragged;
  }, []);

  return {
    scrollRef,
    onMouseDown,
    onMouseMove,
    onMouseUp: stopDragging,
    onMouseLeave: stopDragging,
    scrollBy,
    consumeDidDrag,
  };
}
