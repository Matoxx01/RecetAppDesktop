const { app, BrowserWindow, ipcMain } = require('electron');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 760,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            icon: __dirname + "/assets/icon.ico",
            preload: __dirname + "/preload.js"
        }
    });

    win.loadFile("index.html");

    win.webContents.insertCSS("body { overflow: hidden; }");

    win.setIcon(__dirname + "/assets/icon.ico");
}

app.whenReady().then(() => {
    app.dock && app.dock.setIcon(__dirname + "/assets/icon.ico");
});

// Eventos para controlar la ventana
ipcMain.on('minimize-window', () => {
    win.minimize();
});

ipcMain.on('maximize-window', () => {
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
});

ipcMain.on('close-window', () => {
    win.close();
});

app.whenReady().then(createWindow);
