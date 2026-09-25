import { useCallback, useEffect, useRef, useState } from "react";

type UseInViewMiddleProps = {
  once?: boolean;
};

export function useInViewMiddle<T extends HTMLElement = HTMLElement>(
  { once = false }: UseInViewMiddleProps = {}
) {
  const [inView, setInView] = useState(false);
  const hasTriggered = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const onceRef = useRef(once);
  onceRef.current = once;

  const ref = useCallback((node: T | null) => {
    // Limpiar listeners previos al desmontar o cambiar elemento
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    if (!node) return;
    if (onceRef.current && hasTriggered.current) return;

    const rect = node.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    const absoluteBottom = rect.bottom + window.scrollY;

    const check = () => {
      if (onceRef.current && hasTriggered.current) return;

      const middle = window.scrollY + window.innerHeight / 2;
      const isInMiddle = absoluteTop <= middle && absoluteBottom >= middle;

      setInView(isInMiddle);

      if (onceRef.current && isInMiddle) {
        hasTriggered.current = true;
        cleanup();
      }
    };

    const cleanup = () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };

    cleanupRef.current = cleanup;
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
  }, []);

  // Limpiar al desmontar el hook
  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return { ref, inView };
}