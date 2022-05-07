import { Box, IconButton, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { DamageDataContext } from '../contexts/DamageDataContext';
import { ElectronNavbar } from './ElectonNavbar';
import CloseIcon from '@mui/icons-material/Close';
import { getIpcRenderer } from '../hooks/getIpcRenderer';
import { IpcChannels } from '../shared/channels';
import { useMouseEnabler } from '../hooks/useMouseEnabler';
import _ from 'lodash';
import { CombatEvent } from '../shared/logTypes';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

interface SkillStatistics {
  id: string;
  skillName: string;
  totalDamage: number;
  hitCount: number;
  critCount: number;
  backCount: number;
  frontCount: number;
}

export const DamageStatsDisplay = () => {
  const { mouseEnableRef } = useMouseEnabler();
  const location = useLocation();
  const { currentEncounter } = useContext(DamageDataContext);
  const entityName = new URLSearchParams(location.search).get('entityName');

  const selectedEntityLogs = currentEncounter.damageEvents.filter(
    (event) => event.sourceEntity === entityName,
  );

  const totalDamage = _.sumBy(
    selectedEntityLogs,
    (source) => source.skillDamage,
  );

  const columns: GridColDef[] = [
    { field: 'skillName', headerName: 'Skill', width: 200 },
    {
      field: 'dps',
      headerName: 'DPS',
      width: 70,
      type: 'number',
      valueGetter: (param) => (param.row.totalDamage / totalDamage) * 100,
      valueFormatter: (param) =>
        `${(param.value as number).toLocaleString(undefined, {
          maximumFractionDigits: 1,
        })}%`,
    },
    {
      field: 'totalDamage',
      headerName: 'Total Damage',
      width: 130,
      type: 'number',
    },

    {
      field: 'critCount',
      headerName: 'Crit',
      width: 70,
      type: 'number',
      valueGetter: (param) => (param.row.critCount / param.row.hitCount) * 100,
      valueFormatter: (param) =>
        `${(param.value as number).toLocaleString(undefined, {
          maximumFractionDigits: 1,
        })}%`,
    },
    {
      field: 'backCount',
      headerName: 'Back',
      width: 70,
      type: 'number',
      valueGetter: (param) => (param.row.backCount / param.row.hitCount) * 100,
      valueFormatter: (param) =>
        `${(param.value as number).toLocaleString(undefined, {
          maximumFractionDigits: 1,
        })}%`,
    },
    {
      field: 'frontCount',
      headerName: 'Front',
      width: 70,
      type: 'number',
      valueGetter: (param) => (param.row.frontCount / param.row.hitCount) * 100,
      valueFormatter: (param) =>
        `${(param.value as number).toLocaleString(undefined, {
          maximumFractionDigits: 1,
        })}%`,
    },
    {
      field: 'hitCount',
      headerName: 'Hits',
      width: 70,
      type: 'number',
    },
  ];

  const damageSources = _.groupBy(
    selectedEntityLogs,
    (damage) => damage.skillName,
  );

  const mappedDamageSources = _.map(
    damageSources,
    (events: CombatEvent[], key: string) => {
      const statistic: SkillStatistics = {
        id: key,
        skillName: key,
        totalDamage: 0,
        hitCount: events.length,
        critCount: 0,
        backCount: 0,
        frontCount: 0,
      };
      const total = events.reduce((acc, event) => {
        if (event.isCrit) acc.critCount++;
        if (event.isBack) acc.backCount++;
        if (event.isFront) acc.frontCount++;
        acc.totalDamage += event.skillDamage;
        return acc;
      }, statistic);
      return total;
    },
  );

  const closeApp = () => {
    getIpcRenderer()?.send(IpcChannels.CLOSE_WINDOW);
  };

  return (
    <Box
      ref={(r) => (mouseEnableRef.current = r as HTMLElement)}
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0,0,0,0.6)',
        pointerEvents: 'all',
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '500px',
          width: '100%',
          alignItems: 'center',
          overflowY: 'auto',
          margin: '30px',
        }}
      >
        <DataGrid
          rows={mappedDamageSources}
          columns={columns}
          autoHeight={true}
          hideFooter={true}
          rowHeight={30}
          sx={{
            color: 'white',
            border: 'none',
            width: '90%',
          }}
          initialState={{
            sorting: { sortModel: [{ field: 'dps', sort: 'desc' }] },
          }}
        />
      </Box>
    </Box>
  );
};
