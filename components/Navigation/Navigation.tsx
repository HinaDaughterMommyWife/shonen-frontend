'use client';

import { getSectionData } from '@/common';
import { Section } from '@/store';
import { useStateManager } from '@/providers/StateManager';
import { useIncomingCallAudio } from '@/hooks/useIncomingCallAudio';

export default function Navigation() {
  const { sectionPage, setSectionPage } = useStateManager()
  const { prepareAudio } = useIncomingCallAudio();

  const handleSectionChange = (section: Section) => {
    const params = new URLSearchParams(window.location.search);
    params.set('section', section);
    window.history.replaceState(null, '', `?${params.toString()}`);
    setSectionPage(section);
    
    // Prepare audio (bypass autoplay restrictions) but don't play yet
    if (section === Section.COMMENT) {
      prepareAudio();
    }
  };

  return (
    <section className="w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-6xlarge">
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex gap-2xlarge justify-center md:flex-row flex-col">
          {Object.values(Section).map((item) => (
            <button
              key={item}
              {...{ 'data-s:event': `click-nav-${item}` }}
              onClick={() => handleSectionChange(item)}
              className={`${sectionPage === item ? 'text-primary !border-primary' : 'text-secondary '
                } text-2xlarge font-bold border rounded-2xl px-2xlarge py-medium hover:!border-primary hover:text-primary transition-all duration-300`}
            >
              {getSectionData(item).tinyTitle}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
