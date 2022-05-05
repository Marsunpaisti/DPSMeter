import { useEffect, useState } from 'react';

import { IpcRenderer } from 'electron';

const getIpcRenderer = () => {
  let userAgent = navigator.userAgent.toLowerCase();
  let electron;
  let ipcRenderer: IpcRenderer | undefined;
  console.log('userAgent', userAgent);
  if (userAgent.indexOf('electron/') !== -1) {
    electron = window.require('electron');
    ipcRenderer = electron.ipcRenderer;
    console.log('electron', electron);
    console.log('ipcRenderer', ipcRenderer);
  }
  return ipcRenderer;
};

export const useIpcSender = () => {
  const [ipcRenderer, setIpcRenderer] = useState<IpcRenderer | undefined>();
  useEffect(() => {
    setIpcRenderer(getIpcRenderer());
  }, []);
  return ipcRenderer;
};
