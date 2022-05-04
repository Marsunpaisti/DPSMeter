import React from 'react';

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
