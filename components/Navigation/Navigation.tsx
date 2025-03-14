'use client';

import { getSectionData } from '@/common';
import { Section, useSectionStore } from '@/store';
import { useEffect } from 'react';

export default function Navigation() {
  const { section, setSection } = useSectionStore();

  return (
    <section className="w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-6xlarge">
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex gap-2xlarge justify-center md:flex-row flex-col">
          {Object.values(Section).map((item) => (
            <button
              key={item}
              onClick={() => setSection(item)}
              className={`${
                section === item ? 'text-primary border-primary' : 'text-secondary '
              } text-2xlarge font-bold border rounded-2xl px-2xlarge py-medium hover:border-primary hover:text-primary transition-all duration-300`}
            >
              {getSectionData(item).tinyTitle}
            </button>
          ))}
        </div>
      </div>
      {/* <EmoteText text="hola :darkraiFuristare:" /> */}
    </section>
  );
}
