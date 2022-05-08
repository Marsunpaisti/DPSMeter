import React, { useCallback, useContext, useState } from 'react';
import { DamageDataContext } from '../contexts/DamageDataContext';
import _ from 'lodash';
import { classColors, CombatEvent } from '../shared/logTypes';
import { getEncounterDurationMs } from '../shared/encounterUtils';
import { Typography, Box, SxProps, Theme, IconButton } from '@mui/material';
import { getIpcRenderer } from '../hooks/getIpcRenderer';
import { IpcChannels } from '../shared/channels';
import { ElectronNavbar } from './ElectonNavbar';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMouseEnabler } from '../hooks/useMouseEnabler';
import { classIcons } from '../resources/class_icons';

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
  icon: string;
}

export interface DamageBarDisplayProps {}

export interface DamageBarEntryProps {
  width: string;
  index?: number;
  background: string;
  label: string;
  valueText: string;
  barSx?: SxProps<Theme>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  icon?: string;
}

const DamageBarEntry: React.FC<DamageBarEntryProps> = ({
  width,
  index,
  background,
  label,
  valueText,
  barSx,
  onClick,
  icon,
}) => {
  return (
    <Box
      onClick={onClick}
      key={label}
      sx={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '20px',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : undefined,
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
      <img
        src={icon}
        style={{
          height: '100%',
          zIndex: 1000,
          filter: 'saturate(100%)',
        }}
      />
      <Typography
        sx={{
          zIndex: 1,
          paddingLeft: '5px',
          fontSize: '14px',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          zIndex: 2,
          fontSize: '14px',
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
    DamageDisplayMode.DAMAGE_DONE,
  );

  const cycleMode = useCallback(
    (amount: number) => {
      const modes = Object.values(DamageDisplayMode);
      const curIx = modes.findIndex((m) => damageDisplayMode === m);
      const nextIx = curIx + amount;
      setDamageDisplayMode(modes[nextIx % modes.length]);
    },
    [setDamageDisplayMode, damageDisplayMode],
  );

  const ipcRenderer = getIpcRenderer();

  const closeApp = () => {
    ipcRenderer?.send(IpcChannels.CLOSE);
  };

  const clearAll = () => {
    ipcRenderer?.send(IpcChannels.NEW_ENCOUNTER);
  };

  let mappedToRows: IDamageBarEntry[];
  if (damageDisplayMode === DamageDisplayMode.DPS && !encounterDuration) {
    mappedToRows = [];
  } else {
    mappedToRows = _.map(
      groupedByPlayer,
      (logs: CombatEvent[], entityName: string): IDamageBarEntry => {
        const label = entityName;
        const className = logs[0].sourceClassName;
        const color = className ? classColors[className!] : '#fffff';
        const icon = classIcons[className!];
        let value = logs.reduce(
          (acc: number, log: CombatEvent) => acc + log.skillDamage,
          0,
        );
        if (damageDisplayMode === DamageDisplayMode.DPS) {
          value /= encounterDuration! / 1000;
        }
        return {
          label,
          color,
          value,
          icon,
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
    <Box
      ref={(r) => (mouseEnableRef.current = r as HTMLElement)}
      sx={{ pointerEvents: 'all' }}
    >
      <ElectronNavbar
        title={damageDisplayMode}
        onTitleClick={() => cycleMode(1)}
        width="300px"
        buttons={
          <>
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
          </>
        }
      />
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
                icon={entry.icon}
                key={entry.label}
                width={`${(entry.value / highestValue) * 100}%`}
                label={entry.label}
                valueText={`${damageText} ${percentageText}`}
                index={index}
                background={`linear-gradient(${
                  entry.color
                }, ${adjustColorBrightness(entry.color, -50)});`}
                onClick={() => {
                  getIpcRenderer()?.send(
                    IpcChannels.OPEN_STATS_WINDOW,
                    entry.label,
                  );
                }}
              />
            );
          })}
        {mappedToRows.length > 0 && (
          <DamageBarEntry
            width={`100%`}
            label={'Total'}
            valueText={`${totalValueText}`}
            background={'#700003'}
            barSx={{
              borderRadius: '0px 0px 4px 4px',
            }}
          />
        )}
      </Box>
    </Box>
  );
};
