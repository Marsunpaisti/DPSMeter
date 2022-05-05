import { useEffect } from 'react';

import { IpcRenderer } from 'electron';
import { IpcChannels } from '../shared/channels';

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

    ipcRenderer.on(IpcChannels.DATA, handleData);
    ipcRenderer.on(IpcChannels.MESSAGE, handleMessage);
    ipcRenderer.on(IpcChannels.ERROR, handleError);
    ipcRenderer.on(IpcChannels.CONNECTION_LOST, handleConnectionLost);

    return () => {
      ipcRenderer.removeListener(IpcChannels.DATA, handleData);
      ipcRenderer.removeListener(IpcChannels.MESSAGE, handleMessage);
      ipcRenderer.removeListener(IpcChannels.ERROR, handleError);
      ipcRenderer.removeListener(
        IpcChannels.CONNECTION_LOST,
        handleConnectionLost,
      );
    };
  }, []);
};
