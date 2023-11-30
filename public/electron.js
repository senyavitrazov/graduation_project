const path = require('path');
const { app, BrowserWindow, session } = require('electron');
const electronIpcMain = require('electron').ipcMain;
const isDev = app.isPackaged ? false : require('electron-is-dev');
const { importProfiles, exportProfiles, exportProfilesArray } = require('../src/model/profilemgr');
const bcrypt = require('bcryptjs');

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

electronIpcMain.on('export-profiles-channel', async (e, data) => {
  if (data.action === 'export-profiles') {
    exportProfiles(data.profilesData || null);
  }
  if (data.action === 'export-profiles-append-array') {
    let profiles = [];
    if (typeof data.profilesData === 'object' && !Array.isArray(data.profilesData)) {
      profiles = [data.profilesData];
    } if (Array.isArray(data.profilesData)) {
      profiles.push(...data.profilesData);
    } else {
      console.error('Invalid profilesData format. Expecting an object or an array of objects.');
    }
    const password = profiles[0].credentials.password;
    profiles[0].credentials.password = await bcrypt.hash(password, (await bcrypt.genSalt(10)))
    exportProfilesArray( profiles || null);
  }
});

electronIpcMain.handle('duplex-profiles-channel', async (e, data) => {
  try {
    const  profiles = await importProfiles();
    switch (data.action) {
      case 'search':
        const profile = profiles.find(obj => (obj.credentials.login === data.credentials.login));
        if (!profile) return new Error('Such profile doesnt exist', { cause: { login: false, password: false }});
        if (profile.credentials.password) {
          //console.log(data.credentials.password, profile.credentials.password);
          return await bcrypt.compare(data.credentials.password, profile.credentials.password) || new Error('Invalid password', { cause: { login: true, password: false }});
        }
        return null;
      default: return null;
    }
  } catch (error) {
    console.log(error.message);
    return error;
  }
});

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
