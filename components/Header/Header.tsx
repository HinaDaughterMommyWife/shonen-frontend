'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Section, useSectionStore } from '@/store';
import { sectionData } from '@/common';
import { useStateManager } from '@/providers/StateManager';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const { sectionPage, setSectionPage } = useStateManager()

  const sections = Object.values(sectionData).sort((a, b) => a.order - b.order);
  const currentIndex = sections.findIndex((s) => s.order === sectionData[sectionPage]?.order);

  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  /* useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsSticky(!entry.isIntersecting), {
      threshold: 0,
    });

    const header = document.getElementById('main-header');
    if (header) observer.observe(header);

    return () => observer.disconnect();
  }, []);

  const handleChangeSection = (section: Section) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setSectionPage(section);
    }, 800);
  }; */

  return (
    <>
      <header
        id="main-header"
        className={clsx(
          'w-full px-small sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge transition-opacity duration-300',
          isSticky ? 'opacity-0' : 'opacity-100',
        )}
      >
        <div className="mx-auto block w-full max-w-[1240px] text-center ">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl md:text-4xl font-light tracking-tight first:mt-0 font-great-fighter">
            El Shonen Semanal
          </h2>
          <span className="text-sm text-gray-500/75">
            Llevo 3 dias de rellolling por Super Creek <img
              src={'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1fda4a1b40094c93af334f8b60868a7c/static/dark/3.0'}
              alt={'WhySoSerious'}
              className="inline h-5 w-5 align-middle"
              loading="lazy"
            />
            <br />
            <span className="text-xs">(Si estan leyendo esto, es porque aun no la tengo)</span>
          </span>
        </div>
      </header>
      {/* <div
        className={clsx(
          'fixed top-0 left-0 w-full bg-slate-900 shadow-md transition-all duration-300 z-50 py-medium',
          isSticky ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full',
        )}
      >
        <div className="mx-auto w-full max-w-[1440px] px-medium py-2 flex items-center justify-between">
          <div className="md:w-[320px] w-[160px] flex justify-start">
            {prevSection && (
              <button
                {...{ 'data-s:event': `click-header-${prevSection.key}` }}
                onClick={() => handleChangeSection(prevSection.key)}
                className="px-medium py-small bg-gray-700 text-white text-sm rounded-full hover:bg-gray-600 transition"
              >
                <span className="md:block hidden"> ← {prevSection.tinyTitle}</span>
                <span className="md:hidden">{prevSection.icon}</span>
              </button>
            )}
          </div>
          <h2 className="sm:text-xl text-base font-semibold text-center px-large">
            {sectionData[sectionPage]?.title}
          </h2>
          <div className="md:w-[320px] w-[160px] flex justify-end">
            {nextSection && (
              <button
                {...{ 'data-s:event': `click-header-${nextSection.key}` }}
                onClick={() => handleChangeSection(nextSection.key)}
                className="px-medium py-small bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition"
              >
                <span className="md:block hidden"> {nextSection.tinyTitle} →</span>
                <span className="md:hidden"> {nextSection.icon}</span>
              </button>
            )}
          </div>
        </div>
      </div> */}
    </>
  );
}
