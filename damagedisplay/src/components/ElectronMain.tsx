import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { getIpcRenderer } from '../hooks/getIpcRenderer';
import { IpcChannels } from '../shared/channels';
import { DamageBarDisplay } from './DamageBarDisplay';

export const ElectronMain = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Routes>
        <Route
          path="/"
          element={<DamageBarDisplay width="300px" minHeight="80px" />}
        />
      </Routes>
    </Box>
  );
};
