import { Box } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DamageBarDisplay } from './DamageBarDisplay';
import { DamageStatsDisplay } from './DamageStatsDisplay';

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
        <Route path="/electron/stats" element={<DamageStatsDisplay />} />
        <Route path="/electron" element={<DamageBarDisplay />} />
      </Routes>
    </Box>
  );
};
