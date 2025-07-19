'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type DvdSettings = {
  speed: number;
  opacity: number;
  enabled: boolean;
  setSpeed: (speed: number) => void;
  setOpacity: (opacity: number) => void;
  setEnabled: (enabled: boolean) => void;
};

const DvdContext = createContext<DvdSettings | undefined>(undefined);

export const DvdProvider = ({ children }: { children: ReactNode }) => {
  const [speed, setSpeed] = useState(2);
  const [opacity, setOpacity] = useState(1);
  const [enabled, setEnabled] = useState(false);

  return (
    <DvdContext.Provider value={{ speed, opacity, enabled, setSpeed, setOpacity, setEnabled }}>
      {children}
    </DvdContext.Provider>
  );
};

export const useDvd = () => {
  const context = useContext(DvdContext);
  if (!context) throw new Error('useDvd must be used within a DvdProvider');
  return context;
};
