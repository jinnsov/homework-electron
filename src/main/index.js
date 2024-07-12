import { app, shell, BrowserWindow, ipcMain, dialog, path} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as fs from 'fs'
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

function readDir(dir) {
  //console.log(dialog.showOpenDialog({ properties: ['openDirectory'], defaultPath: 'y:/' }))
  return new Promise((resolve, reject) => {
    fs.readdir(dir, { withFileTypes: true }, (error, files) => {
      if (error) return reject(error)
      resolve(
        files
          .filter((e) => e.isFile())
          .filter(
            (f) =>
              f.name.endsWith('.jpg') ||
              f.name.endsWith('.jpeg') ||
              f.name.endsWith('.png') ||
              f.name.endsWith('.bmp') ||
              f.name.endsWith('.jpeg') ||
              f.name.endsWith('.gif')
          )
          .map((e) => e.name)
      )
    })
  })
}
ipcMain.on('watch', (event, dir) => {
  fs.watch(dir, () => {
    readDir(dir).then((files) => event.reply('files', files))
  })
})
ipcMain.handle('dir', (_, dir) => readDir(dir))

ipcMain.handle('getFile', (_, file) => {
  //console.log(file)
  return fs.readFileSync(file).toString('base64')
})

ipcMain.handle('getDir', async () => {
  const ret = dialog
    .showOpenDialog({ properties: ['openDirectory'] })
    .then((result) => {
      /*console.log(result.canceled)
      console.log(result.filePaths)*/
      return result
    })
    .catch((err) => {
      console.log(err)
    })
  return await ret
})

/*ipcMain.handle('getDir', () => {
  return dialog.showOpenDialogSync({
    properties: ['openDirectory', 'openFile']
  })
})*/
