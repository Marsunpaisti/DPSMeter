import React from 'react';
import { useIpcListener } from '../hooks/useIpcListener';
import { Encounter } from '../shared/logTypes';

export interface IDamageDataContext {
  currentEncounter?: Encounter;
}

export const DamageDataContext = React.createContext<IDamageDataContext>({
  currentEncounter: undefined,
});

export const DamageDataContextProvider: React.FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const currentEncounter = useIpcListener();
  return (
    <DamageDataContext.Provider
      value={{
        currentEncounter,
      }}
    >
      {children}
    </DamageDataContext.Provider>
  );
};
