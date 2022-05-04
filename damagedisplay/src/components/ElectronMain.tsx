import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DamageBarDisplay } from './DamageBarDisplay';

export const ElectronMain = () => {
  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          WebkitUserSelect: 'none',
          '-webkit-app-region': 'drag',
          maxHeight: '30px',
          height: '25px',
          width: '300px',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: '100% !important',
            maxHeight: '100% !important',
            padding: '0px 10px',
          }}
        >
          Damage meter
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<DamageBarDisplay width="300px" />} />
      </Routes>
    </>
  );
};
