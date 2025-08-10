import { Section } from '@/store';

export interface StateManagerStateProps {
  initialSection: Section;
  headerUnixTime: number;
  children: React.ReactNode;
}

export interface StateManagerProviderProps extends StateManagerStateProps {
  sectionPage: Section;
  setSectionPage: (section: Section) => void;
}

export interface StateManagerContextProps
  extends Omit<StateManagerProviderProps, 'children' | 'initialSection'> {}
