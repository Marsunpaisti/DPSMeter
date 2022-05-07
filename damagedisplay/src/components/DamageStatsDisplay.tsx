import { Box, IconButton, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { DamageDataContext } from '../contexts/DamageDataContext';
import { ElectronNavbar } from './ElectonNavbar';
import CloseIcon from '@mui/icons-material/Close';
import { getIpcRenderer } from '../hooks/getIpcRenderer';
import { IpcChannels } from '../shared/channels';

export const DamageStatsDisplay = () => {
  const location = useLocation();
  const { currentEncounter } = useContext(DamageDataContext);
  const entityName = new URLSearchParams(location.search).get('entityName');

  const closeApp = () => {
    getIpcRenderer()?.send(IpcChannels.CLOSE);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.6)',
      }}
    >
      <ElectronNavbar
        title={`Statistics for ${entityName}`}
        buttons={
          <>
            <IconButton
              onClick={closeApp}
              sx={{
                color: 'white',
                '-webkit-app-region': 'no-drag',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <CloseIcon
                sx={{
                  width: '22px',
                  height: '22px',
                }}
              />
            </IconButton>
          </>
        }
      />
      <Typography variant="h6">{`Statistics for ${entityName}`}</Typography>
    </Box>
  );
};
