import React from 'react';
import { useIpcListener } from '../hooks/useIpcListener';
import { DamageEvent, Encounter } from '../shared/logTypes';

export interface IDamageDataContext {
  currentEncounter: Encounter;
}

export const DamageDataContext = React.createContext<IDamageDataContext>({
  currentEncounter: { damageEvents: [] },
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
