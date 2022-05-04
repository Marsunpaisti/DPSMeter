import { useEffect } from 'react';

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

export const useIpcListener = () => {
  useEffect(() => {
    const ipcRenderer = getIpcRenderer();
    if (!ipcRenderer) {
      console.log('ipcRenderer undefined');
      return;
    }
    const handleData = (event: Electron.IpcRendererEvent, payload: string) => {
      console.log(payload);
    };
    const handleMessage = (
      event: Electron.IpcRendererEvent,
      payload: string,
    ) => {
      console.log(payload);
    };
    const handleError = (event: Electron.IpcRendererEvent, payload: string) => {
      console.log(payload);
    };
    const handleConnectionLost = (
      event: Electron.IpcRendererEvent,
      payload: string,
    ) => {
      console.log(payload);
    };

    ipcRenderer.on('data', handleData);
    ipcRenderer.on('message', handleMessage);
    ipcRenderer.on('error', handleError);
    ipcRenderer.on('connectionLost', handleConnectionLost);

    return () => {
      ipcRenderer.removeListener('data', handleData);
      ipcRenderer.removeListener('message', handleMessage);
      ipcRenderer.removeListener('error', handleError);
      ipcRenderer.removeListener('connectionLost', handleConnectionLost);
    };
  }, []);
};
