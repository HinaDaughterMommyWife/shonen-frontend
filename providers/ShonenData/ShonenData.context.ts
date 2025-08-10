import { createContext } from 'react';
import type { ShonenDataContextProps } from './ShonenData.types';

export const ShonenDataContext = createContext<ShonenDataContextProps | undefined>(undefined);
