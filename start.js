const { app, BrowserWindow } = require('electron')

function createWindow() {
    let win = new BrowserWindow({
        width: 1280,
        height: 720,
    })

    win.loadFile("index.html")

}

app.whenReady().then(createWindow)