import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Routes, Route, HashRouter, BrowserRouter } from 'react-router-dom';
import { DamageDataContextProvider } from '../contexts/DamageDataContext';
import { ElectronMain } from './ElectronMain';

export default function Router() {
  var userAgent = navigator.userAgent.toLowerCase();
  let RouterComponent = HashRouter;
  if (
    userAgent.indexOf('electron/') === -1 ||
    process.env.NODE_ENV === 'development'
  ) {
    RouterComponent = BrowserRouter;
  }
  return (
    <DamageDataContextProvider>
      <RouterComponent>
        <ElectronMain />
      </RouterComponent>
    </DamageDataContextProvider>
  );
}
