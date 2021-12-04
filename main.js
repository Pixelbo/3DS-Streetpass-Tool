const { app, BrowserWindow } = require('electron')
const path = require('path')
var reading = require("./reading")

function MainMenu(){
  reading.listTitles();
}


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    darkTheme: true,
    show: false,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  win.once('ready-to-show', () => {
    win.maximize()
    win.show()

    MainMenu();
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


app.on('window-all-closed', () => {app.quit()})
