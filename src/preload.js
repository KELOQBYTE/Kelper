const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('overlay', {
  setClickThrough: (ignore) => ipcRenderer.invoke('overlay:setClickThrough', ignore),
  setOpacity: (alpha) => ipcRenderer.invoke('overlay:setOpacity', alpha),
  toggle: () => ipcRenderer.invoke('overlay:toggle'),
  setPositionPreset: (preset) => ipcRenderer.invoke('overlay:setPositionPreset', preset),
})