//File for starting the gui, nothing related to events

const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    darkTheme: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '/libs/NODEjs/preload.js'),
      webviewTag: true,
    }
  })

  win.loadFile('index.html')

  win.once('ready-to-show', () => {
    // win.removeMenu();
    win.maximize();
    win.show();
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})


app.on('window-all-closed', () => { app.quit() })
