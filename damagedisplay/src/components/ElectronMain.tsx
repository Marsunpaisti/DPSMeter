import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DamageBarDisplay } from './DamageBarDisplay';
import { useIpcSender } from '../hooks/useIpcSender';
import { IpcChannels } from '../shared/channels';

export const ElectronMain = () => {
  const ipcRenderer = useIpcSender();

  const handleClose = () => {
    ipcRenderer?.send(IpcChannels.CLOSE);
  };

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
            display: 'flex',
          }}
        >
          <Typography sx={{ float: 'left' }}>Damage Meter</Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              '-webkit-app-region': 'no-drag',
              marginLeft: 'auto',
              padding: 0,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<DamageBarDisplay width="300px" />} />
      </Routes>
    </>
  );
};
