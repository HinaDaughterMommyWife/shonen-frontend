'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Section, useSectionStore } from '@/store';
import { sectionData } from '@/common';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const { section, setSection } = useSectionStore();
  const sections = Object.values(sectionData).sort((a, b) => a.order - b.order);
  const currentIndex = sections.findIndex((s) => s.order === sectionData[section]?.order);

  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  useEffect(() => {
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
      setSection(section);
    }, 800);
  };
  // El Shonen Semanal Beta - Final Season Parte 3 (Second Half)

  /*
  <span className="text-sm text-gray-500/75">Darkrai a tener que ver las 100 novias</span>{' '}
          <img
            src={
              'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1fda4a1b40094c93af334f8b60868a7c/static/light/1.0'
            }
            alt={'pepelu'}
            className="inline h-5 w-5 align-middle"
            loading="lazy"
          />
  */

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
          <h2 className="pb-2 text-sm font-semibold tracking-tight text-yellow-300 opacity-70">
            (Del ganador de los Premios Simbolista 2024 "Mayor Itadori")
          </h2>
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            El Shonen Semanal Beta - Simbolista of the Year Edition
          </h2>
          <span className="text-sm text-gray-500/75">
            Y.. cuando llega el premio a mi cerro? A quien le doy mi direccion?
          </span>{' '}
          <img
            src={
              'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_47e825274dcb405981374b875bc0ff66/static/light/1.0'
            }
            alt={'pepelu'}
            className="inline h-6 w-6 align-middle"
            loading="lazy"
          />
        </div>
      </header>
      <div className="w-full px-small sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 pt-2xlarge">
        <div className="mx-auto flex w-full text-center justify-center xl:flex-row flex-col gap-4xlarge xl:gap-2">
          <img
            src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsaCJzM6dIe6DPKJbANLT1t79HRaZkMfWS3iF8"
            alt="Simbolista of the Year"
            className="w-[240px] h-auto mb-4 rounded-full shadow-lg self-center"
            loading="lazy"
          />
          <img
            src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBslrz04v5OpiVTzR1oDaUeb52IF7wXZmjAC39s"
            alt="Simbolista of the Year"
            className="w-[240px] h-auto mb-4 rounded-full shadow-lg self-center"
            loading="lazy"
          />
          <img
            src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBshnqtMaDR2Ivlsz6EaOq9PrLndbfyxtwu7V0D"
            alt="Simbolista of the Year"
            className="w-[240px] h-auto mb-4 rounded-full shadow-lg self-center"
            loading="lazy"
          />
          <img
            src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsfZ7irJsIN2bCgPoAEUHKpjtWY1kd3uG8QSvh"
            alt="Simbolista of the Year"
            className="w-[240px] h-auto  mb-4 rounded-full shadow-lg self-center"
            loading="lazy"
          />
        </div>
      </div>
      <div
        className={clsx(
          'fixed top-0 left-0 w-full bg-slate-900 shadow-md transition-all duration-300 z-10 py-medium',
          isSticky ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full',
        )}
      >
        <div className="mx-auto w-full max-w-[1440px] px-medium py-2 flex items-center justify-between">
          <div className="md:w-[320px] w-[160px] flex justify-start">
            {prevSection && (
              <button
                onClick={() => handleChangeSection(prevSection.key)}
                className="px-medium py-small bg-gray-700 text-white text-sm rounded-full hover:bg-gray-600 transition"
              >
                <span className="md:block hidden"> ← {prevSection.tinyTitle}</span>
                <span className="md:hidden"> ← {prevSection.icon}</span>
              </button>
            )}
          </div>
          <h2 className="sm:text-xl text-base font-semibold text-center px-large">
            {sectionData[section]?.title}
          </h2>
          <div className="md:w-[320px] w-[160px] flex justify-end">
            {nextSection && (
              <button
                onClick={() => handleChangeSection(nextSection.key)}
                className="px-medium py-small bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition"
              >
                <span className="md:block hidden"> {nextSection.tinyTitle} →</span>
                <span className="md:hidden"> {nextSection.icon} →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
