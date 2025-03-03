const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  minimize: () => ipcRenderer.send('minimize-window'),
  max: () => ipcRenderer.send('maximize-window'),
  close: () => ipcRenderer.send('close-window'),
  home: () => ipcRenderer.send('home')
});
