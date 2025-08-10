import { useContext } from 'react';
import { ShonenDataContext } from './ShonenData.context';
import type { ShonenDataContextProps } from './ShonenData.types';

export const useShonenData = (): ShonenDataContextProps => {
  const context = useContext(ShonenDataContext);

  if (context === undefined) {
    throw new Error('useShonenData must be used within a ShonenDataProvider');
  }

  return context;
};
