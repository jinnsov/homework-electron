import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as fs from 'fs'
import { exif4 } from './exif'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 900,
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
    mainWindow.loadFile(join(__dirname, '../renderer2/index.html'))
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
  // get images file
  //console.log(dialog.showOpenDialog({ properties: ['openDirectory'], defaultPath: 'y:/' }))
  return new Promise((resolve, reject) => {
    fs.readdir(dir, { withFileTypes: true }, (error, files) => {
      if (error) return reject(error)
      resolve(
        files
          .filter((e) => e.isFile())
          .filter((f) => f.name.endsWith('.jpg') || f.name.endsWith('.jpeg'))
          .map((e) => {
            return { path: e.path, name: e.name }
          })
      )
    })
  })
}
ipcMain.on('watch', (event, dir) => {
  // watch dir change:
  fs.watch(dir, () => {
    readDir(dir).then((files) => event.reply('files', files))
  })
})
ipcMain.handle('dir', (_, dir) =>
  //get list of files name:
  readDir(dir)
)
ipcMain.handle('exif', (_, file) =>
  //get exif:
  exif4(file)
)
ipcMain.handle('getFile', (_, file) => {
  //get file as base64
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
ipcMain.handle('getFileStat', (_, file) => {
  // getting information for a file
  process.stdout.write('get stats for ' + file)
  //const o = exif(file)
  //console.info(o)
  return fs.statSync(file)
})

ipcMain.handle('copyFiles', async (_, files, source, distance) => {
  // Синхронное копирование
  console.log(source)
  try {
    for (let file of files) {
      await fs.copyFileSync(source + '/' + file, distance + '/' + file)
      console.log('Скопирован файл ' + file)
    }
  } catch (err) {
    console.error(err)
    return false
  }
  return true
})
