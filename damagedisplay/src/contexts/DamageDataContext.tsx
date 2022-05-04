import React from 'react';
import { useIpcListener } from '../hooks/useIpcListener';

export interface IDamageDataContext {
  addLogLine: () => undefined;
  clearLogs: () => undefined;
  logLines: string[];
}

export const DamageDataContext = React.createContext<IDamageDataContext>({
  addLogLine: () => undefined,
  clearLogs: () => undefined,
  logLines: [],
});

export const DamageDataContextProvider: React.FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  useIpcListener();
  return (
    <DamageDataContext.Provider
      value={{
        addLogLine: () => undefined,
        clearLogs: () => undefined,
        logLines: [],
      }}
    >
      {children}
    </DamageDataContext.Provider>
  );
};
