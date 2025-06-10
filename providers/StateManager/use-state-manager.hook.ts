import { useContext } from 'react'
import { StateManagerContext } from './StateManager.context'
import type { StateManagerContextProps } from './StateManager.types'

export const useStateManager = (): StateManagerContextProps => {
  const context = useContext(StateManagerContext)

  if (context === undefined) {
    throw new Error(
      'useStateManager must be used within a StateManagerProvider'
    )
  }

  return context
}
