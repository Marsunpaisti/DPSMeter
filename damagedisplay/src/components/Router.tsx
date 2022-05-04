import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Routes, Route, HashRouter, BrowserRouter } from 'react-router-dom';
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
    <div className="App">
      <AppBar
        position="static"
        elevation={0}
        sx={{
          '-webkit-user-select': 'none',
          '-webkit-app-region': 'drag',
          maxHeight: '30px',
          height: '30px',
        }}
      >
        <Toolbar sx={{ minHeight: '100% !important' }}>
          <Typography sx={{ fontSize: '14px' }}>
            {`
      DamageMeter - Router: ${
        RouterComponent === HashRouter ? 'HashRouter' : 'BrowserRouter'
      }`}
          </Typography>
        </Toolbar>
      </AppBar>
      <RouterComponent>
        <Routes>
          <Route path="/electron" element={<ElectronMain />} />
          <Route path="/" element={<p>Hello browser!</p>} />
        </Routes>
      </RouterComponent>
    </div>
  );
}
