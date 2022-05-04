import React from 'react';
import { Routes, Route, HashRouter, BrowserRouter } from 'react-router-dom';

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
      {`
      Router: ${
        RouterComponent === HashRouter ? 'HashRouter' : 'BrowserRouter'
      }`}
      <RouterComponent>
        <Routes>
          <Route path="/electron" element={<p>Hello electron!</p>} />
          <Route path="/" element={<p>Hello browser!</p>} />
        </Routes>
      </RouterComponent>
    </div>
  );
}
