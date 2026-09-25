'use client';

import { Section } from '@/store';
import StatsLiked from '../StatsLiked';
import StatsDisliked from '../StatsDisliked';
import CommentSection from '../CommentSection';
import { useStateManager } from '@/providers/StateManager';

type SectionVotedProps = {
  pastebinMarkdown?: string;
};

export default function SectionVoted({ pastebinMarkdown = '' }: SectionVotedProps) {
  const { sectionPage } = useStateManager();

  return (
    <div className="w-full min-h-[1400px]">
      {sectionPage === Section.LIKED && <StatsLiked />}
      {sectionPage === Section.DISLIKED && <StatsDisliked />}
      {sectionPage === Section.COMMENT && <CommentSection markdownContent={pastebinMarkdown} />}
    </div>
  );
}
