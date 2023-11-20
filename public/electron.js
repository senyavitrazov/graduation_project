const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = app.isPackaged ? false : require('electron-is-dev');
const { importProfiles, exportProfiles } = require('../src/model/profilemgr');

let win;

async function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    minWidth: 960,
    minHeight: 540,
    height: 1080,
    resizable: true,
    titleBarOverlay: true,
    title: 'trackING sOftware defecTs syStem (СОДПП/INGOTS)',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadURL(
      isDev
        ? 'http://127.0.0.1:3000'
        : `file://${__dirname}/../build/index.html`
  );
}

app.on("ready", createWindow);

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

ipcMain.on('toMain', (event, data) => {
  if (data.action === 'minimize') win.minimize();
  if (data.action === 'close') win.close();
  if (data.action === 'maximize') {
    win.isMaximized() ? win.unmaximize() : win.maximize();
  }
})

app.on('export-profiles', (event, profilesData) => {
  exportProfiles(profilesData);
});

app.on('import-profiles', async (event) => {
  const profilesData = await importProfiles();
  win.webContents.send('imported-profiles', profilesData);
});
