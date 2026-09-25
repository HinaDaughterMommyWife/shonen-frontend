import { useEffect, useRef, useState } from "react";

type UseInViewProps = {
  once?: boolean;
  offset?: number; // px de inset desde el borde del viewport (0 = detecta al tocar el borde)
};

export function useInView<T extends HTMLElement = HTMLElement>(
  { once = true, offset = 0 }: UseInViewProps = {}
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const margin = Math.max(0, offset);

    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        },
        {
          root: null,
          threshold: 0,
          rootMargin: `-${margin}px 0px -${margin}px 0px`,
        }
      );

      observer.observe(el);
      return () => observer.disconnect();
    } catch (error) {
      console.error('IntersectionObserver error:', error);
      setInView(false);
      return () => {};
    }
  }, [once, offset]);

  return { ref, inView };
}
