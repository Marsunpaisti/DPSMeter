import { useEffect, useState } from 'react';

import { IpcRenderer } from 'electron';
import { IpcChannels } from '../shared/channels';
import { Encounter } from '../shared/logTypes';

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
  const [currentEncounter, setCurrentEncounter] = useState<
    Encounter | undefined
  >();

  useEffect(() => {
    const ipcRenderer = getIpcRenderer();
    if (!ipcRenderer) {
      return;
    }
    const handleData = (
      event: Electron.IpcRendererEvent,
      payload: Encounter,
    ) => {
      setCurrentEncounter(payload);
    };

    ipcRenderer.on(IpcChannels.DAMAGE_DATA, handleData);

    ipcRenderer.send(IpcChannels.DAMAGE_DATA, 'REQUEST_DATA');

    return () => {
      ipcRenderer.removeListener(IpcChannels.DAMAGE_DATA, handleData);
    };
  }, []);

  return currentEncounter;
};
