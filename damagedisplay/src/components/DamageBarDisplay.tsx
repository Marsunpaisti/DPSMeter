import React, { useCallback, useContext, useState } from 'react';
import { DamageDataContext } from '../contexts/DamageDataContext';
import _ from 'lodash';
import { classColors, DamageEvent } from '../shared/logTypes';
import { getEncounterDurationMs } from '../shared/encounterUtils';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  SxProps,
  Theme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { getIpcRenderer } from '../hooks/getIpcRenderer';
import { IpcChannels } from '../shared/channels';
import { useMouseEnabler } from '../hooks/useMouseEnabler';

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
  minHeight?: string;
}

export interface DamageBarEntryProps {
  width: string;
  index?: number;
  background: string;
  label: string;
  valueText: string;
  barSx?: SxProps<Theme>;
}

const DamageBarEntry: React.FC<DamageBarEntryProps> = ({
  width,
  index,
  background,
  label,
  valueText,
  barSx,
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
          ...barSx,
          position: 'absolute',
          zIndex: 0,
          left: 0,
          top: 0,
          width: width,
          height: '100%',
          background,
        }}
      />

      <Typography sx={{ zIndex: 1, paddingLeft: '5px', fontSize: '12px' }}>
        {index !== undefined ? `${index + 1}. ${label}` : `${label}`}
      </Typography>
      <Typography
        sx={{
          zIndex: 2,
          fontSize: '12px',
          position: 'absolute',
          right: '5px',
        }}
      >
        {valueText}
      </Typography>
    </Box>
  );
};

export enum DamageDisplayMode {
  DPS = 'DPS',
  DAMAGE_DONE = 'Damage',
}

export const DamageBarDisplay: React.FC<DamageBarDisplayProps> = ({}) => {
  const { currentEncounter } = useContext(DamageDataContext);
  const damageEvents = currentEncounter.damageEvents;
  const damageByPlayers = damageEvents.filter((log) => log.sourceClassName);
  const groupedByPlayer = _.groupBy(damageByPlayers, (log) => log.sourceEntity);
  const encounterDuration = getEncounterDurationMs(currentEncounter);
  const { mouseEnableRef } = useMouseEnabler();

  const [damageDisplayMode, setDamageDisplayMode] = useState<DamageDisplayMode>(
    DamageDisplayMode.DPS,
  );

  const cycleMode = useCallback(
    (amount: number) => {
      const modes = Object.values(DamageDisplayMode);
      const curIx = modes.findIndex((m) => damageDisplayMode === m);
      const nextIx = curIx + amount;
      console.log(
        `Mode: CurIx: ${curIx}+${amount} ${nextIx % modes.length} ${
          modes[nextIx % modes.length]
        }`,
      );
      setDamageDisplayMode(modes[nextIx % modes.length]);
    },
    [setDamageDisplayMode, damageDisplayMode],
  );

  const ipcRenderer = getIpcRenderer();

  const closeApp = () => {
    ipcRenderer?.send(IpcChannels.CLOSE);
  };

  const clearAll = () => {
    ipcRenderer?.send(IpcChannels.CLEAR_ALL);
  };

  let mappedToRows: IDamageBarEntry[];
  if (damageDisplayMode === DamageDisplayMode.DPS && !encounterDuration) {
    mappedToRows = [];
  } else {
    mappedToRows = _.map(
      groupedByPlayer,
      (logs: DamageEvent[], key: string): IDamageBarEntry => {
        const label = key;
        const color = logs[0].sourceClassName
          ? classColors[logs[0].sourceClassName]
          : '#fffff';
        let value = logs.reduce(
          (acc: number, log: DamageEvent) => acc + log.skillDamage,
          0,
        );
        if (damageDisplayMode === DamageDisplayMode.DPS) {
          value /= encounterDuration! / 1000;
        }
        return {
          label,
          color,
          value,
        };
      },
    );
  }

  const highestValue = Math.max(...mappedToRows.map((e) => e.value));
  const totalValue = [...mappedToRows].reduce((acc, row) => acc + row.value, 0);

  let totalValueText: string;
  if (totalValue > 1000000) {
    totalValueText = `${(totalValue / 1000000).toFixed(2)}M`;
  } else if (totalValue > 1000) {
    totalValueText = `${Math.round(totalValue / 1000)}k`;
  } else {
    totalValueText = totalValue.toFixed(0);
  }

  return (
    <>
      <AppBar
        ref={(r) => (mouseEnableRef.current = r as HTMLElement)}
        position="static"
        elevation={0}
        sx={{
          WebkitUserSelect: 'none',
          pointerEvents: 'all',
          maxHeight: '30px',
          height: '25px',
          width: '300px',
          background: '#700003',
          borderRadius: '4px 4px 0px 0px',
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
            onClick={() => cycleMode(1)}
            sx={{
              cursor: 'pointer',
              '-webkit-app-region': 'no-drag',
              fontWeight: 'bold',
            }}
          >
            {damageDisplayMode}
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
            <IconButton
              onClick={clearAll}
              sx={{
                color: 'white',
                '-webkit-app-region': 'no-drag',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <DeleteIcon
                sx={{
                  width: '18px',
                  height: '18px',
                }}
              />
            </IconButton>
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
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: '300px',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
      >
        {mappedToRows
          .sort((a, b) => b.value - a.value)
          .map((entry, index) => {
            let damageText: string;
            if (entry.value > 1000000) {
              damageText = `${(entry.value / 1000000).toFixed(2)}M`;
            } else if (entry.value > 1000) {
              damageText = `${Math.round(entry.value / 1000)}k`;
            } else {
              damageText = entry.value.toFixed(0);
            }

            const percentageText = `(${(
              (entry.value / totalValue) *
              100
            ).toFixed(1)}%)`;

            return (
              <DamageBarEntry
                key={entry.label}
                width={`${(entry.value / highestValue) * 100}%`}
                label={entry.label}
                valueText={`${damageText} ${percentageText}`}
                index={index}
                background={`linear-gradient(${
                  entry.color
                }, ${adjustColorBrightness(entry.color, -50)});`}
              />
            );
          })}
        <DamageBarEntry
          width={`100%`}
          label={'Total'}
          valueText={`${totalValueText}`}
          background={'#700003'}
          barSx={{
            borderRadius: '0px 0px 4px 4px',
          }}
        />
      </Box>
    </>
  );
};
