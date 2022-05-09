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
import { DamageGroupedByEntity } from '../shared/logTypes';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { classIcons } from '../resources/class_icons';

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
  const entityName =
    new URLSearchParams(location.search)?.get('entityName') ?? '';

  let outgoingDamage: DamageGroupedByEntity | undefined =
    currentEncounter?.outgoing[entityName];

  if (!outgoingDamage) {
    outgoingDamage = {
      totalDamage: 0,
      damageEvents: [],
      bySkill: {},
    };
  }

  const selectedEntityLogs = outgoingDamage.damageEvents;
  const totalDamage = outgoingDamage.totalDamage;

  const className =
    selectedEntityLogs.length > 0
      ? selectedEntityLogs[0].sourceClassName
      : undefined;

  const columns: GridColDef[] = [
    {
      field: 'skillName',
      headerName: 'Skill',
      width: 260,
      disableColumnMenu: true,
    },
    {
      field: 'dps',
      headerName: 'Dmg %',
      width: 70,
      type: 'number',
      valueGetter: (param) => (param.row.totalDamage / totalDamage) * 100,
      valueFormatter: (param) =>
        `${(param.value as number).toLocaleString(undefined, {
          maximumFractionDigits: 1,
        })}%`,
      disableColumnMenu: true,
    },
    {
      field: 'totalDamage',
      headerName: 'Total DMG',
      type: 'number',
      disableColumnMenu: true,
    },

    {
      field: 'critCount',
      headerName: 'Crit',
      width: 55,
      type: 'number',
      valueGetter: (param) => (param.row.critCount / param.row.hitCount) * 100,
      valueFormatter: (param) =>
        `${(param.value as number).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}%`,
      disableColumnMenu: true,
    },
    {
      field: 'backCount',
      headerName: 'Back',
      width: 55,
      type: 'number',
      valueGetter: (param) => (param.row.backCount / param.row.hitCount) * 100,
      valueFormatter: (param) =>
        `${(param.value as number).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}%`,
      disableColumnMenu: true,
    },
    {
      field: 'frontCount',
      headerName: 'Front',
      width: 55,
      type: 'number',
      valueGetter: (param) => (param.row.frontCount / param.row.hitCount) * 100,
      valueFormatter: (param) =>
        `${(param.value as number).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}%`,
      disableColumnMenu: true,
    },
    {
      field: 'hitCount',
      headerName: 'Hits',
      width: 55,
      type: 'number',
      disableColumnMenu: true,
    },
  ];

  const mappedDamageSources = Object.keys(outgoingDamage.bySkill).map((key) => {
    const events = outgoingDamage!.bySkill[key].damageEvents;

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
  });

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
      <Typography
        variant="h4"
        sx={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}
      >
        {className && (
          <span>
            <img src={classIcons[className]} style={{ height: '50px' }} />
          </span>
        )}
        {entityName}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '500px',
          width: '85%',
          alignItems: 'center',
          overflowY: 'auto',
        }}
      >
        <DataGrid
          rows={mappedDamageSources}
          columns={columns}
          autoHeight={true}
          hideFooter={true}
          rowHeight={30}
          sx={{
            border: 'none',
            width: '100%',
            '.MuiDataGrid-iconButtonContainer': {
              display: 'none',
            },
            '.MuiDataGrid-menuIcon': {
              display: 'none',
            },
            '.MuiDataGrid-columnSeparator': {
              display: 'none',
            },
            '.MuiDataGrid-cellContent': {
              textOverflow: 'clip',
              whiteSpace: 'normal',
            },
          }}
          initialState={{
            sorting: { sortModel: [{ field: 'dps', sort: 'desc' }] },
          }}
        />
      </Box>
    </Box>
  );
};
