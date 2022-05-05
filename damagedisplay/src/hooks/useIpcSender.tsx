import { useEffect, useState } from 'react';

import { IpcRenderer } from 'electron';

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

export const useIpcSender = () => {
  const [ipcRenderer, setIpcRenderer] = useState<IpcRenderer | undefined>();
  useEffect(() => {
    setIpcRenderer(getIpcRenderer());
  }, []);
  return ipcRenderer;
};
