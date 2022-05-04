import { Box, Typography } from '@mui/material';
import React from 'react';

export interface IDamageBarEntry {
  label: string;
  color: string;
  value: number;
}

const entries: IDamageBarEntry[] = [
  {
    label: 'Berserker',
    color: '#ff0000',
    value: 500000,
  },
  {
    label: 'Sorceress',
    color: '#00ff00',
    value: 222244,
  },
  {
    label: 'Shadowhunter',
    color: '#ff00ff',
    value: 324232,
  },
];

const adjustColorBrightness = (hexInput: string, percent: number) => {
  let hex = hexInput;

  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, '$1$1');
  }

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  const calculatedPercent = (100 + percent) / 100;

  r = Math.round(Math.min(255, Math.max(0, r * calculatedPercent)));
  g = Math.round(Math.min(255, Math.max(0, g * calculatedPercent)));
  b = Math.round(Math.min(255, Math.max(0, b * calculatedPercent)));

  const rHex = r.toString(16).toUpperCase();
  const gHex = g.toString(16).toUpperCase();
  const bHex = b.toString(16).toUpperCase();

  const outColor = `#${rHex.length === 1 ? '0' + rHex : rHex}${
    gHex.length === 1 ? '0' + gHex : gHex
  }${bHex.length === 1 ? '0' + bHex : bHex}`;
  return outColor;
};

export const DamageBarDisplay = () => {
  const highestDamage = Math.max(...entries.map((e) => e.value));

  return (
    <Box width="100%" sx={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      {entries
        .sort((a, b) => b.value - a.value)
        .map((entry, index) => {
          return (
            <Box
              key={entry.label}
              sx={{
                position: 'relative',
                display: 'flex',
                width: '100%',
                height: '20px',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 0,
                  left: 0,
                  top: 0,
                  width: `${(entry.value / highestDamage) * 100}%`,
                  height: '100%',
                  background: `linear-gradient(${
                    entry.color
                  }, ${adjustColorBrightness(entry.color, -50)});`,
                }}
              />
              <Typography
                sx={{ zIndex: 1, paddingLeft: '5px', fontSize: '12px' }}
              >
                {`${index + 1}. ${entry.label}`}
              </Typography>
              <Typography
                sx={{
                  zIndex: 2,
                  fontSize: '12px',
                  position: 'absolute',
                  right: '5px',
                }}
              >
                {`${entry.value.toFixed(0)}`}
              </Typography>
            </Box>
          );
        })}
    </Box>
  );
};
