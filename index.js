const { app, BrowserWindow } = require('electron')

function createWindow() {
    let win = new BrowserWindow({
        width: 1320,
        height: 630,
    })

    win.loadFile("home.html")

}

app.whenReady().then(createWindow)