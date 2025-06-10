import { JSX, useMemo, useState } from 'react'
import { StateManagerContext } from './StateManager.context'
import { Section } from '@/store';

interface StateManagerProviderProps {
  initialSection: Section;
  children: React.ReactNode;
}

export default function StateManagerProvider({
  initialSection,
  children,
}: Readonly<StateManagerProviderProps>): JSX.Element {

  const [sectionPage, setSectionPage] = useState(initialSection);

  const value = useMemo(
    () => ({
      sectionPage,
      setSectionPage,
    }),
    [sectionPage]
  )

  return (
    <StateManagerContext.Provider value={value}>
      {children}
    </StateManagerContext.Provider>
  )
}
