import { useEffect, useState } from 'react';

import { IpcRenderer } from 'electron';
import { IpcChannels } from '../shared/channels';
import { DamageEvent, Encounter } from '../shared/logTypes';

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
  const [currentEncounter, setCurrentEncounter] = useState<Encounter>({
    damageEvents: [],
  });

  useEffect(() => {
    const ipcRenderer = getIpcRenderer();
    if (!ipcRenderer) {
      console.log('ipcRenderer undefined');
      return;
    }
    const handleData = (
      event: Electron.IpcRendererEvent,
      payload: Encounter,
    ) => {
      setCurrentEncounter(payload);
    };
    const handleNewZone = (event: Electron.IpcRendererEvent) => {};
    const handleConnectionLost = (event: Electron.IpcRendererEvent) => {};

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

  return currentEncounter;
};
