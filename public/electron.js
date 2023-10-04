const path = require('path');
const { app, BrowserWindow } = require('electron');
const isDev = app.isPackaged ? false : require('electron-is-dev'); 

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    title: 'СОДПП',
    frame: false,
  });
  win.loadURL(
      isDev
        ? 'http://127.0.0.1:3000'
        : `file://${__dirname}/../build/index.html`
  );
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

