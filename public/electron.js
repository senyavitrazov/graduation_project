const path = require('path');
const { app, BrowserWindow, session } = require('electron');
const electronIpcMain = require('electron').ipcMain;
const isDev = app.isPackaged ? false : require('electron-is-dev');
const { importProfiles, exportProfiles, exportProfilesArray } = require('../src/model/profilemgr');

let win, defaultSession;

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

app.on('ready', () => {
  defaultSession  = session.defaultSession;
  createWindow();
});

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

electronIpcMain.on('trafficlight-channel', (e, data) => {
  if (data.action === 'minimize') win.minimize();
  if (data.action === 'close') win.close();
  if (data.action === 'maximize') {
    win.isMaximized() ? win.unmaximize() : win.maximize();
  }
});

electronIpcMain.on('export-profiles-channel', (e, data) => {
  if (data.action === 'export-profiles') {
    exportProfiles(data.profilesData || null);
  }
  if (data.action === 'export-profiles-append-array') {
    exportProfilesArray(data.profilesData || null);
  }
});

electronIpcMain.handle('duplex-profiles-channel', async (e, data) => {
  try {
    return await importProfiles();
  } catch (error) {
    console.log(error.message);
    return error;
  }
})

/*
  if (data.action === 'import-profiles') {
     const responseObj = await importProfiles();
     console.log(responseObj);
     win.webContents.send('fromMain', responseObj);
   }
*/


electronIpcMain.handle('set-cookies-channel', (e, cookiesArray) => {
  if (!Array.isArray(cookiesArray)) cookiesArray = [cookiesArray];
  if (!cookiesArray.every(cookie => typeof cookie === 'object')) {
   return new Error('Invalid data format. Expecting an array of objects.');
  }
  for (const cookieData of cookiesArray) {
    const { key, value, expires } = cookieData;
    const options = {
      httpOnly: true,
      secure: false,
      path: '/',
    };
    defaultSession.cookie.set({ name: key, value, expires, ...options })
  }
  return { success: true };
});
