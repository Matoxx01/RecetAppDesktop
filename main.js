import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let win;

const preloadPath = path.join(app.getAppPath(), 'preload.js');
const iconPath = path.join(app.getAppPath(), 'assets', 'icon.ico');

function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 760,
        frame: false,
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            icon: iconPath,
        }
    });

    win.loadFile("index.html");

    win.webContents.on('did-finish-load', () => {
        console.log('URL actual:', win.webContents.getURL());
    });

    win.webContents.openDevTools();

    // Redericciones

    ipcMain.on('home', () => {
        win.loadFile('home/home.html');
    });    

    win.webContents.insertCSS("body { overflow: hidden; }");

    win.setIcon(path.join(path.resolve(), "assets/icon.ico"));
}

app.whenReady().then(() => {
    if (app.dock) {
        app.dock.setIcon(path.join(path.resolve(), "assets/icon.ico"));
    }
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
