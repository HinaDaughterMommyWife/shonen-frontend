'use client';

import { Section, useSectionStore } from '@/store';
import StatsLiked from '../StatsLiked';
import StatsDisliked from '../StatsDisliked';
import CommentSection from '../CommentSection';

export default function SectionVoted() {
  const { section } = useSectionStore();

  return (
    <div className="w-full min-h-[1400px]">
      {section === Section.LIKED && <StatsLiked />}
      {section === Section.DISLIKED && <StatsDisliked />}
      {section === Section.COMMENT && <CommentSection />}
    </div>
  );
}
