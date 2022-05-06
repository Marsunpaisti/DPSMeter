// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { ConnectionBuilder } from 'electron-cgi';
import { IpcChannels } from './../src/shared/channels';
import { Damage } from './../src/shared/logs';
import { parseStringToDamage } from './utils/logParser';

let currWindow: BrowserWindow | undefined;

let currLogs: Damage[] = [];

const packetCapPath = isDev
  ? path.join(__dirname, '../packetcapture/LostArkLoggerElectronBackend.exe')
  : '../packetcapture/LostArkLoggerElectronBackend.exe';
const packetCapConnection = new ConnectionBuilder()
  .connectTo(packetCapPath)
  .build();

packetCapConnection.on('damageEvent', (payload) => {
  console.log(`Damage event: ${JSON.stringify(payload, undefined, 2)}`);

  try {
    const log = parseStringToDamage(payload);
    currLogs.push(log);
  } catch (e) {
    console.log('Unable to parse damage event:\n', e);
  } finally {
    currWindow &&
      currWindow.webContents.send(IpcChannels.DAMAGE_DATA, currLogs);
  }
});

packetCapConnection.on('newZone', () => {
  console.log(`New zone entered`);
  currWindow && currWindow.webContents.send(IpcChannels.NEWZONE);
  currLogs = [];
});

packetCapConnection.on('log', (payload) => {
  console.log(JSON.stringify(payload, undefined, 2));
});

packetCapConnection.onDisconnect = () => {
  console.log('Lost connection to the LostArkLoggerElectronBackend process');
  currWindow && currWindow.webContents.send(IpcChannels.CONNECTION_LOST);
};

ipcMain.on(IpcChannels.CLOSE, async (event, arg) => {
  app.quit();
});

/*
setInterval(() => {
  try {
    const log = parseStringToDamage(
      '22.05.05.21.45.58.7,$You (Paladin),506E15C4,Charge,1928,0,0,0',
    );
    console.log(log);
    currLogs.push(log);
  } catch (e) {
    console.log('invalid packet:', e);
  } finally {
    currWindow && currWindow.webContents.send(IpcChannels.DATA, currLogs);
  }
}, 2000);

setInterval(() => {
  try {
    const log = parseStringToDamage(
      '22.05.05.21.45.58.7,$Dimitri (Gunslinger),506E15C4,Charge,1928,0,0,0',
    );
    console.log(log);
    currLogs.push(log);
  } catch (e) {
    console.log('invalid packet:', e);
  } finally {
    currWindow && currWindow.webContents.send(IpcChannels.DATA, currLogs);
  }
}, 5000);
*/

const createWindow = () => {
  // Create the browser window.
  const indexUrl = new URL(
    isDev
      ? 'http://localhost:3000/electron'
      : `${path.join(__dirname, '../index.html')}`,
  );

  if (!isDev) {
    indexUrl.hash = '/electron';
    indexUrl.protocol = 'file';
  }

  const damageMeterWindow = new BrowserWindow({
    frame: false, // removes the frame from the BrowserWindow. It is advised that you either create a custom menu bar or remove this line
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    useContentSize: true,
    minWidth: 300,
    minHeight: 300,
    width: 300,
    height: 300,
    webPreferences: {
      devTools: isDev, // toggles whether devtools are available. to use node write window.require('<node-name>')
      nodeIntegration: true, // turn this off if you don't mean to use node
    },
  });

  // load the index.html of the app. (or localhost on port 3000 if you're in development)
  damageMeterWindow.loadURL(indexUrl.toString());

  // Open the DevTools. will only work if webPreferences::devTools is true
  damageMeterWindow.webContents.openDevTools({ mode: 'undocked' });

  if (isDev) {
    // Hot Reloading on 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(
        __dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        'electron' + (process.platform === 'win32' ? '.cmd' : ''),
      ),
      forceHardReset: true,
      hardResetMethod: 'exit',
    });
  }

  return damageMeterWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  setTimeout(() => {
    currWindow = createWindow();
  }, 50);

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      setTimeout(() => {
        currWindow = createWindow();
      }, 50);
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// to access anything in here use window.require('electron').remote
