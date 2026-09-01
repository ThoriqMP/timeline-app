// TimelineFlow Preload Script
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  platform: process.platform,
  sendPrint: () => ipcRenderer.send('window-print'),
  onMenuTrigger: (channel, callback) => {
    const validChannels = ['menu-export', 'menu-import', 'menu-goals', 'menu-new-task'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  }
});
