import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { width } from '@mui/system';
import React, { ReactNode } from 'react';
import { useMouseEnabler } from '../hooks/useMouseEnabler';

export interface ElectronNavbarProps {
  title: string;
  onTitleClick?: React.MouseEventHandler<HTMLSpanElement>;
  buttons?: ReactNode | ReactNode[];
  width?: string;
}

export const ElectronNavbar: React.FC<ElectronNavbarProps> = ({
  title,
  onTitleClick,
  buttons,
  width,
}) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        WebkitUserSelect: 'none',
        pointerEvents: 'all',
        maxHeight: '30px',
        height: '25px',
        background: '#700003',
        borderRadius: '4px 4px 0px 0px',
        width: width ?? '100%',
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
        <Typography
          onClick={onTitleClick}
          sx={{
            cursor: 'pointer',
            '-webkit-app-region': 'no-drag',
            fontWeight: 'bold',
          }}
        >
          {title}
        </Typography>

        <Box
          id="toolbar-buttons"
          sx={{
            minHeight: '100%',
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '20px',
              flexGrow: 1,
              margin: '0px 2px',
              '-webkit-app-region': 'drag',
            }}
          ></Box>
          {buttons}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
