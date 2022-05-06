import { useEffect, useState } from 'react';

import { IpcRenderer } from 'electron';
import { IpcChannels } from '../shared/channels';
import { Damage } from '../shared/logs';

const getIpcRenderer = () => {
  let userAgent = navigator.userAgent.toLowerCase();
  let electron;
  let ipcRenderer: IpcRenderer | undefined;
  if (userAgent.indexOf('electron/') !== -1) {
    electron = window.require('electron');
    ipcRenderer = electron.ipcRenderer;
  }
  return ipcRenderer;
};

export const useIpcListener = () => {
  const [logs, setLogs] = useState<Damage[]>([]);
  useEffect(() => {
    const ipcRenderer = getIpcRenderer();
    if (!ipcRenderer) {
      console.log('ipcRenderer undefined');
      return;
    }
    const handleData = (
      event: Electron.IpcRendererEvent,
      payload: Damage[],
    ) => {
      console.log(payload);
      setLogs(payload);
    };
    const handleNewZone = (event: Electron.IpcRendererEvent) => {
      console.log('New zone entered');
    };
    const handleConnectionLost = (event: Electron.IpcRendererEvent) => {
      console.log('Connection lost');
    };

    ipcRenderer.on(IpcChannels.DAMAGE_DATA, handleData);
    ipcRenderer.on(IpcChannels.NEWZONE, handleNewZone);
    ipcRenderer.on(IpcChannels.CONNECTION_LOST, handleConnectionLost);

    return () => {
      ipcRenderer.removeListener(IpcChannels.DAMAGE_DATA, handleData);
      ipcRenderer.removeListener(IpcChannels.NEWZONE, handleNewZone);
      ipcRenderer.removeListener(
        IpcChannels.CONNECTION_LOST,
        handleConnectionLost,
      );
    };
  }, []);

  return logs;
};
