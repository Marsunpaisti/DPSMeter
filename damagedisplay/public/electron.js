// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const url = require('url');

const createWindow = () => {
  // Create the browser window.
  const indexUrl = new URL(
    isDev
      ? 'http://localhost:3000/electron'
      : `${path.join(__dirname, '../build/index.html')}`,
  );

  if (!isDev) {
    indexUrl.hash = '/electron';
    indexUrl.protocol = 'file';
    indexUrl.slashes = true;
  }

  const mainWindow = new BrowserWindow({
    frame: false, // removes the frame from the BrowserWindow. It is advised that you either create a custom menu bar or remove this line
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    minHeight: 300,
    height: 300,
    maxHeight: 1000,
    minWidth: 400,
    width: 400,
    maxWidth: 1000,
    webPreferences: {
      devTools: isDev, // toggles whether devtools are available. to use node write window.require('<node-name>')
      nodeIntegration: true, // turn this off if you don't mean to use node
    },
  });

  // load the index.html of the app. (or localhost on port 3000 if you're in development)
  mainWindow.loadURL(indexUrl.toString());

  // Open the DevTools. will only work if webPreferences::devTools is true
  mainWindow.webContents.openDevTools({ mode: 'undocked' });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  setTimeout(() => {
    createWindow();
  }, 50);

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      setTimeout(() => {
        createWindow();
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
