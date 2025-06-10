import { create } from 'zustand';

export enum Section {
  /* HOME = 'home', */
  LIKED = 'liked',
  DISLIKED = 'disliked',
  COMMENT = 'comment',
  /* RESUME = 'resume', */
}

export interface SectionState {
  section: Section;
  setSection: (section: Section) => void;
  resetSection: () => void;
}

export const useSectionStore = create<SectionState>((set) => ({
  section: Section.LIKED,
  setSection: (section: Section) => set({ section }),
  resetSection: () => set({ section: Section.LIKED }),
}));
