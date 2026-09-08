// TimelineFlow Preload Script
const { contextBridge, ipcRenderer } = require("electron");

let version = "1.4.1";
try {
  const packageJson = require("./package.json");
  version = packageJson.version || "1.4.1";
} catch (e) {
  // fallback
}

contextBridge.exposeInMainWorld("electronAPI", {
  isDesktop: true,
  platform: process.platform,
  appVersion: version,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },
  sendPrint: () => ipcRenderer.send("window-print"),
  checkForUpdates: () => ipcRenderer.send("check-update"),
  startDownloadUpdate: () => ipcRenderer.send("start-download-update"),
  installUpdate: () => ipcRenderer.send("install-update"),
  openExternal: (url) => ipcRenderer.send("open-external-url", url),
  onMenuTrigger: (channel, callback) => {
    const validChannels = [
      "menu-export",
      "menu-import",
      "menu-goals",
      "menu-new-task",
      "trigger-check-update",
      "trigger-print",
      "menu-app-info"
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },
  onUpdaterEvent: (channel, callback) => {
    const validChannels = [
      "updater-checking",
      "updater-available",
      "updater-not-available",
      "updater-progress",
      "updater-downloaded",
      "updater-error",
      "updater-dev-mode",
      "trigger-check-update",
      "menu-app-info"
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  }
});
