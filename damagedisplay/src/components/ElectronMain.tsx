import { Box } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useMouseEnabler } from '../hooks/useMouseEnabler';
import { DamageBarDisplay } from './DamageBarDisplay';
import { DamageStatsDisplay } from './DamageStatsDisplay';

export const ElectronMain = () => {
  const { mouseEnableRef } = useMouseEnabler();

  return (
    <Box
      ref={(r) => (mouseEnableRef.current = r as HTMLElement)}
      sx={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        pointerEvents: 'all',
      }}
    >
      <Routes>
        <Route path="/electron/stats" element={<DamageStatsDisplay />} />
        <Route path="/electron" element={<DamageBarDisplay />} />
      </Routes>
    </Box>
  );
};
