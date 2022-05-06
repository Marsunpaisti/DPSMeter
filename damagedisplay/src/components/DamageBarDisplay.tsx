import { Box, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { DamageDataContext } from '../contexts/DamageDataContext';
import _ from 'lodash';
import { classColors, DamageEvent } from '../shared/logTypes';

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

export interface IDamageBarEntry {
  label: string;
  color: string;
  value: number;
}

export interface DamageBarDisplayProps {
  width?: string;
  height?: string;
}

export interface DamageBarEntryProps {
  width: string;
  index: number;
  color: string;
  label: string;
  value: number;
}

const DamageBarEntry: React.FC<DamageBarEntryProps> = ({
  width,
  index,
  color,
  label,
  value,
}) => {
  return (
    <Box
      key={label}
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
          width: width,
          height: '100%',
          background: `linear-gradient(${color}, ${adjustColorBrightness(
            color,
            -50,
          )});`,
        }}
      />
      <Typography sx={{ zIndex: 1, paddingLeft: '5px', fontSize: '12px' }}>
        {`${index + 1}. ${label}`}
      </Typography>
      <Typography
        sx={{
          zIndex: 2,
          fontSize: '12px',
          position: 'absolute',
          right: '5px',
        }}
      >
        {`${value.toFixed(0)}`}
      </Typography>
    </Box>
  );
};

export const DamageBarDisplay: React.FC<DamageBarDisplayProps> = ({
  width,
  height,
}) => {
  const { currentEncounter } = useContext(DamageDataContext);
  const damageEvents = currentEncounter.damageEvents;
  const damageByPlayers = damageEvents.filter((log) => log.sourceClassName);
  const groupedByPlayer = _.groupBy(damageByPlayers, (log) => log.sourceEntity);

  const mappedToRows = _.map(
    groupedByPlayer,
    (logs: DamageEvent[], key: string): IDamageBarEntry => {
      const label = key;
      const color = logs[0].sourceClassName
        ? classColors[logs[0].sourceClassName]
        : '#fffff';
      const value = logs.reduce(
        (accum: number, log: DamageEvent) => accum + log.skillDamage,
        0,
      );
      return {
        label,
        color,
        value,
      };
    },
  );

  const highestValue = Math.max(...mappedToRows.map((e) => e.value));

  return (
    <Box
      width="100%"
      sx={{ width, height, backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      {mappedToRows
        .sort((a, b) => b.value - a.value)
        .map((entry, index) => {
          return (
            <DamageBarEntry
              key={entry.label}
              width={`${(entry.value / highestValue) * 100}%`}
              label={entry.label}
              value={entry.value}
              index={index}
              color={entry.color}
            />
          );
        })}
    </Box>
  );
};
