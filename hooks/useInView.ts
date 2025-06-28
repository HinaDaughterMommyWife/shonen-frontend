import { useEffect, useRef, useState } from 'react';

type UseInViewProps = {
  once?: boolean;
  distance?: number;
};

export function useInView<T extends HTMLElement = HTMLElement>({
  once = true,
  distance = 0,
}: UseInViewProps = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const rootBounds = entry.rootBounds;
        if (!rootBounds) return;

        const centerY = rootBounds.top + rootBounds.height / 2;
        const margin = distance;

        const topLimit = centerY - margin;
        const bottomLimit = centerY + margin;

        const elementTop = entry.boundingClientRect.top;
        const elementBottom = entry.boundingClientRect.bottom;

        const isInCenterZone = elementTop < bottomLimit && elementBottom > topLimit;

        if (isInCenterZone) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once, distance]);

  return { ref, inView };
}
