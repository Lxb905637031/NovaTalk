import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import started from 'electron-squirrel-startup'
import { settings } from '../shared'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit()
}

let mainWindow: BrowserWindow | null = null
let settingsWindow: BrowserWindow | null = null


const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/pages/index.html`)
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/pages/index.html`),
    )
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

const createsettingsWindow = () => {
  settingsWindow = new BrowserWindow({
    width: 600,
    height: 500,
    title: '设置',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    settingsWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/pages/settings.html`)
  } else {
    settingsWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/pages/settings.html`),
    )
  }

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
}

// IPC Handlers for settings
ipcMain.on('open-settings-window', () => {
  createsettingsWindow()
})

ipcMain.on('get-theme', (event) => {
  event.returnValue = settings.theme
})
ipcMain.on('get-language', (event) => {
  event.returnValue = settings.language
})

ipcMain.on('set-theme', (_, theme) => {
  console.log('Theme changed:', theme)
  settings.theme = theme
  mainWindow?.webContents.send('theme-changed', theme)
  settingsWindow?.webContents.send('theme-changed', theme)
})

ipcMain.on('set-language', (_, lang) => {
  console.log('Language changed:', lang)
  settings.language = lang
  mainWindow?.webContents.send('language-changed', lang)
  settingsWindow?.webContents.send('language-changed', lang)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.