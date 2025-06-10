import { createContext } from 'react'
import type { StateManagerContextProps } from './StateManager.types'

export const StateManagerContext = createContext<
  StateManagerContextProps | undefined
>(undefined)
