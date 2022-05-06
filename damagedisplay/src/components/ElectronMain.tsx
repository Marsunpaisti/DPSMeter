import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DamageBarDisplay } from './DamageBarDisplay';

export const ElectronMain = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DamageBarDisplay
            width="300px"
            minHeight="80px"
          />
        }
      />
    </Routes>
  );
};
