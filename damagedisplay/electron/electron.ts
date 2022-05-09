// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { ConnectionBuilder } from 'electron-cgi';
import { IpcChannels } from './../src/shared/channels';
import { parseCombatEventFromLog } from './utils/logParser';
import { LogContainer } from './LogContainer';
import * as fs from 'fs';

let logContainer = new LogContainer();
let mainWindow: BrowserWindow;

const sendMessageToWindows = (channel: IpcChannels, payload?: any) => {
  BrowserWindow.getAllWindows().forEach((w) => {
    w?.webContents?.send(channel, payload);
  });
};

const packetCapPath = isDev
  ? path.join(__dirname, '../packetcapture/LostArkLogger.exe')
  : '../packetcapture/LostArkLogger.exe';
const packetCapConnection = new ConnectionBuilder()
  .connectTo(packetCapPath)
  .build();

const handleNewCombatEvent = (logLine: string) => {
  console.log(`Combat event: ${JSON.stringify(logLine, undefined, 2)}`);

  try {
    const damageEvent = parseCombatEventFromLog(logLine);
    if (logContainer.timeSincePreviousDamage(damageEvent) > 33000) {
      logContainer.startNewEncounter();
    }
    if (!damageEvent) {
      console.log('Unable to parse damage event:\n', logLine);
      return;
    }
    logContainer.addCombatEvent(damageEvent);
  } catch (e) {
    console.log('Unable to parse damage event: \n', logLine, '\n', e);
  } finally {
    sendMessageToWindows(
      IpcChannels.DAMAGE_DATA,
      logContainer.currentEncounter,
    );
  }
};

let streamInterval: NodeJS.Timeout | undefined;
const streamTestLogLines = () => {
  if (!process.env.STREAM_TESTLOG || process.env.STREAM_TESTLOG !== 'true')
    return;
  console.log('Streaming test logs');
  if (isDev && !streamInterval) {
    const testLogPath = path.join(__dirname, '../testData/testlog.log');
    const testLogLines = fs.readFileSync(testLogPath).toString().split('\n');
    streamInterval = setInterval(() => {
      const line = testLogLines.shift();
      if (line === undefined) {
        if (streamInterval) {
          clearInterval(streamInterval!);
          streamInterval = undefined;
        }
        return;
      }
      if (line === '') return;
      handleNewCombatEvent(line!);
    }, 100);
  }
};

packetCapConnection.on('combat-event', (payload) => {
  if (splitOnNextEvent) {
    splitOnNextEvent = false;
    logContainer.startNewEncounter();
  }
  handleNewCombatEvent(payload);
});

let splitOnNextEvent = false;
packetCapConnection.on('new-zone', () => {
  console.log(`New zone entered`);

  splitOnNextEvent = true;
  sendMessageToWindows(IpcChannels.NEWZONE);
  logContainer.startNewEncounter();
});

packetCapConnection.on('log', (payload) => {
  console.log(JSON.stringify(payload, undefined, 2));
});

packetCapConnection.onDisconnect = () => {
  console.log('Lost connection to the LostArkLogger.exe process');

  sendMessageToWindows(IpcChannels.CONNECTION_LOST);
};

ipcMain.on(IpcChannels.CLOSE, async (event, arg) => {
  app.quit();
});

ipcMain.on(IpcChannels.CLOSE_WINDOW, async (event, arg) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win?.close();
});

ipcMain.on(IpcChannels.NEW_ENCOUNTER, async (event, arg) => {
  logContainer.startNewEncounter();
  sendMessageToWindows(IpcChannels.DAMAGE_DATA, logContainer.currentEncounter);
});

ipcMain.on(IpcChannels.CLEAR_ALL, async (event, arg) => {
  logContainer.clearAllEncounters();
  sendMessageToWindows(IpcChannels.DAMAGE_DATA, logContainer.currentEncounter);
});

ipcMain.on(IpcChannels.ENABLE_MOUSE_PASSTHROUGH, async (event, arg) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win?.setIgnoreMouseEvents(true, {
    forward: true,
  });

  win?.setAlwaysOnTop(true, 'screen-saver');
});

ipcMain.on(IpcChannels.DISABLE_MOUSE_PASSTHROUGH, async (event, arg) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win?.setIgnoreMouseEvents(false);
  win?.setAlwaysOnTop(true, 'screen-saver');
});

ipcMain.on(IpcChannels.OPEN_STATS_WINDOW, (event, entityName: string) => {
  createStatsWindow(entityName);
});

ipcMain.on(IpcChannels.DAMAGE_DATA, (event, arg: any) => {
  if (arg === 'REQUEST_DATA') {
    console.log(`Responding to REQUEST_DATA from window ${event.sender.id}`);
    BrowserWindow.fromWebContents(event.sender)?.webContents.send(
      IpcChannels.DAMAGE_DATA,
      logContainer.currentEncounter,
    );
  }
});

const createMeterWindow = () => {
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
    fullscreenable: false,
    maximizable: false,
    focusable: true,
    enableLargerThanScreen: true,
    useContentSize: true,
    width: 500,
    height: 500,
    webPreferences: {
      devTools: isDev, // toggles whether devtools are available. to use node write window.require('<node-name>')
      nodeIntegration: true, // turn this off if you don't mean to use node
    },
  });

  // load the index.html of the app. (or localhost on port 3000 if you're in development)
  damageMeterWindow.loadURL(indexUrl.toString());

  // Open the DevTools. will only work if webPreferences::devTools is true
  damageMeterWindow.webContents.openDevTools({ mode: 'undocked' });

  damageMeterWindow.setAlwaysOnTop(true, 'screen-saver');

  return damageMeterWindow;
};

const createStatsWindow = (entityName: string) => {
  const indexUrl = new URL(
    isDev
      ? `http://localhost:3000/electron/stats`
      : `${path.join(__dirname, '../index.html')}`,
  );

  const query = `?entityName=${entityName}`;
  if (!isDev) {
    indexUrl.hash = `/electron/stats`;
    indexUrl.protocol = 'file';
  }

  const statsWindow = new BrowserWindow({
    frame: false, // removes the frame from the BrowserWindow. It is advised that you either create a custom menu bar or remove this line
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    fullscreenable: false,
    maximizable: false,
    focusable: true,
    enableLargerThanScreen: true,
    useContentSize: true,
    width: 800,
    height: 900,
    parent: mainWindow,
    webPreferences: {
      devTools: isDev, // toggles whether devtools are available. to use node write window.require('<node-name>')
      nodeIntegration: true, // turn this off if you don't mean to use node
    },
  });

  // load the index.html of the app. (or localhost on port 3000 if you're in development)
  statsWindow.loadURL(indexUrl.toString() + query);

  // Open the DevTools. will only work if webPreferences::devTools is true
  statsWindow.once('ready-to-show', () => {
    statsWindow.webContents.openDevTools({ mode: 'undocked' });
  });

  if (isDev) {
    setTimeout(
      () => statsWindow?.webContents?.openDevTools({ mode: 'undocked' }),
      3000,
    );
  }

  statsWindow?.setIgnoreMouseEvents(true, {
    forward: true,
  });
  statsWindow?.setAlwaysOnTop(true, 'screen-saver');

  return statsWindow;
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  setTimeout(() => {
    const win = createMeterWindow();
    mainWindow = win;
    win.setIgnoreMouseEvents(true, {
      forward: true,
    });
    streamTestLogLines();
  }, 50);

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      setTimeout(() => {
        const win = createMeterWindow();
        mainWindow = win;
        win.setIgnoreMouseEvents(true, {
          forward: true,
        });
        streamTestLogLines();
      }, 50);
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// to access anything in here use window.require('electron').remote
