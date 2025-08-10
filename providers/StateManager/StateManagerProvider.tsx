import { JSX, useMemo, useState } from 'react'
import { StateManagerContext } from './StateManager.context'
import { Section } from '@/store';
import { StateManagerStateProps } from './StateManager.types';

export default function StateManagerProvider({
  initialSection,
  children,
  headerUnixTime,
}: Readonly<StateManagerStateProps>): JSX.Element {

  const [sectionPage, setSectionPage] = useState(initialSection);

  const value = useMemo(
    () => ({
      sectionPage,
      setSectionPage,
      headerUnixTime,
    }),
    [sectionPage]
  )

  return (
    <StateManagerContext.Provider value={value}>
      {children}
    </StateManagerContext.Provider>
  )
}
