import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DamageBarDisplay } from './DamageBarDisplay';

export const ElectronMain = () => {
  return (
    <Routes>
      <Route path="/" element={<DamageBarDisplay />} />
    </Routes>
  );
};
