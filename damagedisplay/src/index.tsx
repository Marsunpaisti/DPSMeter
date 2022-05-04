import './index.sass';
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import Router from './components/Router';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
