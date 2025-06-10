import { Section } from '@/store';

export interface StateManagerProviderProps {
  initialSection: Section;
  sectionPage: Section;
  setSectionPage: (section: Section) => void;
  children: React.ReactNode;
}

export interface StateManagerContextProps
  extends Omit<StateManagerProviderProps, 'children' | 'initialSection'> {}
