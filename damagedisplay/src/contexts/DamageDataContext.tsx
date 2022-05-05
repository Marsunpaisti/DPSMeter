import React from 'react';
import { useIpcListener } from '../hooks/useIpcListener';
import { Damage } from '../shared/logs';

export interface IDamageDataContext {
  addLogLine: () => undefined;
  clearLogs: () => undefined;
  logLines: Damage[];
}

export const DamageDataContext = React.createContext<IDamageDataContext>({
  addLogLine: () => undefined,
  clearLogs: () => undefined,
  logLines: [],
});

export const DamageDataContextProvider: React.FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const logs = useIpcListener();
  return (
    <DamageDataContext.Provider
      value={{
        addLogLine: () => undefined,
        clearLogs: () => undefined,
        logLines: logs,
      }}
    >
      {children}
    </DamageDataContext.Provider>
  );
};
