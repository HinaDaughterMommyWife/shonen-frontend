'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../ui/button';

export default function TopWindow() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button
      onClick={scrollToTop}
      className={clsx(
        'fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg transition-all duration-300',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
      )}
    >
      <ArrowUp className="w-6 h-6" />
    </Button>
  );
}
