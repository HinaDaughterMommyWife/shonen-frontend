'use client';

import { Section } from '@/store';
import StatsLiked from '../StatsLiked';
import StatsDisliked from '../StatsDisliked';
import CommentSection from '../CommentSection';
import { useStateManager } from '@/providers/StateManager';

export default function SectionVoted() {
  const { sectionPage } = useStateManager()

  return (
    <div className="w-full min-h-[1400px]">
      {sectionPage === Section.LIKED && <StatsLiked />}
      {sectionPage === Section.DISLIKED && <StatsDisliked />}
      {sectionPage === Section.COMMENT && <CommentSection />}
    </div>
  );
}
