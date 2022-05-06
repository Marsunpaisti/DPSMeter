import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DamageBarDisplay } from './DamageBarDisplay';
import { useIpcRenderer } from '../hooks/useIpcRenderer';
import { IpcChannels } from '../shared/channels';

export const ElectronMain = () => {
  const ipcRenderer = useIpcRenderer();

  const closeApp = () => {
    ipcRenderer?.send(IpcChannels.CLOSE);
  };

  const clearAll = () => {
    ipcRenderer?.send(IpcChannels.CLEAR_ALL);
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
            padding: '0px',
            paddingLeft: '10px',
          }}
        >
          <Typography>Damage Meter</Typography>
          <Box
            id="toolbar-buttons"
            sx={{
              minHeight: '100%',
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'stretch',
            }}
          >
            <IconButton
              onClick={clearAll}
              sx={{
                '-webkit-app-region': 'no-drag',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={closeApp}
              sx={{
                '-webkit-app-region': 'no-drag',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<DamageBarDisplay width="300px" />} />
      </Routes>
    </>
  );
};
