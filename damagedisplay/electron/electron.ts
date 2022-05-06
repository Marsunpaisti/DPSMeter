// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { ConnectionBuilder } from 'electron-cgi';
import { IpcChannels } from './../src/shared/channels';
import { parseDamageEventFromLog } from './utils/logParser';
import { LogContainer } from './LogContainer';

let currWindow: BrowserWindow | undefined;

let logContainer = new LogContainer();

const sendMessageToWindows = (channel: IpcChannels, payload?: any) => {
  BrowserWindow.getAllWindows().forEach((w) => {
    w.webContents.send(channel, payload);
  });
};

const packetCapPath = isDev
  ? path.join(__dirname, '../packetcapture/LostArkLoggerElectronBackend.exe')
  : '../packetcapture/LostArkLoggerElectronBackend.exe';
const packetCapConnection = new ConnectionBuilder()
  .connectTo(packetCapPath)
  .build();

packetCapConnection.on('damageEvent', (payload) => {
  console.log(`Damage event: ${JSON.stringify(payload, undefined, 2)}`);
  try {
    const damageEvent = parseDamageEventFromLog(payload);
    if (logContainer.timeSincePreviousDamage(damageEvent) > 33000) {
      logContainer.startNewEncounter();
    }
    logContainer.addDamageEvent(damageEvent);
  } catch (e) {
    console.log('Unable to parse damage event:\n', e);
  } finally {
    sendMessageToWindows(
      IpcChannels.DAMAGE_DATA,
      logContainer.currentEncounter,
    );
  }
});

packetCapConnection.on('newZone', () => {
  console.log(`New zone entered`);

  sendMessageToWindows(IpcChannels.NEWZONE);
  logContainer.startNewEncounter();
});

packetCapConnection.on('log', (payload) => {
  console.log(JSON.stringify(payload, undefined, 2));
});

packetCapConnection.onDisconnect = () => {
  console.log('Lost connection to the LostArkLoggerElectronBackend process');

  sendMessageToWindows(IpcChannels.CONNECTION_LOST);
};

ipcMain.on(IpcChannels.CLOSE, async (event, arg) => {
  app.quit();
});

ipcMain.on(IpcChannels.NEW_ENCOUNTER, async (event, arg) => {
  logContainer.startNewEncounter();
  sendMessageToWindows(IpcChannels.DAMAGE_DATA, logContainer.currentEncounter);
});

ipcMain.on(IpcChannels.CLEAR_ALL, async (event, arg) => {
  logContainer.startNewEncounter();
  sendMessageToWindows(IpcChannels.DAMAGE_DATA, logContainer.currentEncounter);
});

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
