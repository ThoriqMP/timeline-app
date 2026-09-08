// TimelineFlow Preload Script
const { contextBridge, ipcRenderer } = require('electron');

const packageJson = require('./package.json');

contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  platform: process.platform,
  appVersion: packageJson.version,
  sendPrint: () => ipcRenderer.send('window-print'),
  checkForUpdates: () => ipcRenderer.send('check-update'),
  startDownloadUpdate: () => ipcRenderer.send('start-download-update'),
  installUpdate: () => ipcRenderer.send('install-update'),
  onMenuTrigger: (channel, callback) => {
    const validChannels = ['menu-export', 'menu-import', 'menu-goals', 'menu-new-task', 'trigger-check-update'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },
  onUpdaterEvent: (channel, callback) => {
    const validChannels = [
      'updater-checking',
      'updater-available',
      'updater-not-available',
      'updater-progress',
      'updater-downloaded',
      'updater-error',
      'updater-dev-mode',
      'trigger-check-update'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  }
});
