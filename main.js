const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;

// Configure Auto-Updater (Require user confirmation before download)
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

function setupAutoUpdater() {
  try {
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'ThoriqMP',
      repo: 'timeline-app'
    });
  } catch (err) {
    console.warn('Gagal menetapkan feed URL autoUpdater:', err);
  }

  autoUpdater.on('checking-for-update', () => {
    console.log('Memeriksa pembaruan...');
    if (mainWindow) {
      mainWindow.webContents.send('updater-checking');
    }
  });

  autoUpdater.on('update-available', (info) => {
    console.log(`Pembaruan versi ${info.version} tersedia.`);
    if (mainWindow) {
      mainWindow.webContents.send('updater-available', info);
    }
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('Aplikasi sudah dalam versi terbaru.');
    if (mainWindow) {
      mainWindow.webContents.send('updater-not-available', info);
    }
  });

  autoUpdater.on('error', (err) => {
    console.error('Error saat auto-updater:', err);
    if (mainWindow) {
      mainWindow.webContents.send('updater-error', err ? err.message : 'Gagal memeriksa pembaruan.');
    }
  });

  autoUpdater.on('download-progress', (progressObj) => {
    if (mainWindow) {
      mainWindow.webContents.send('updater-progress', progressObj);
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log(`Pembaruan versi ${info.version} siap dipasang.`);
    if (mainWindow) {
      mainWindow.webContents.send('updater-downloaded', info);
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 880,
    minWidth: 980,
    minHeight: 660,
    title: 'TimelineFlow',
    backgroundColor: '#0f172a',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false
    },
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle external links opening in user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setupAppMenu();
}

function setupAppMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              {
                label: 'Tentang TimelineFlow',
                click: () => {
                  if (mainWindow) mainWindow.webContents.send('menu-app-info');
                }
              },
              { type: 'separator' },
              { role: 'services', label: 'Layanan' },
              { type: 'separator' },
              { role: 'hide', label: 'Sembunyikan TimelineFlow' },
              { role: 'hideOthers', label: 'Sembunyikan Lainnya' },
              { role: 'unhide', label: 'Tampilkan Semua' },
              { type: 'separator' },
              { role: 'quit', label: 'Keluar TimelineFlow' }
            ]
          }
        ]
      : []),
    {
      label: 'File',
      submenu: [
        {
          label: '🎯 Buka Goals Calendar',
          accelerator: 'CmdOrCtrl+G',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu-goals');
          }
        },
        {
          label: '➕ Tambah Target Baru',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu-new-task');
          }
        },
        { type: 'separator' },
        {
          label: '📤 Backup Data (JSON)',
          accelerator: 'CmdOrCtrl+Shift+E',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu-export');
          }
        },
        {
          label: '📥 Restore Data (JSON)',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu-import');
          }
        },
        { type: 'separator' },
        {
          label: '🖨️ Cetak / Print Timeline',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('trigger-print');
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close', label: 'Tutup Jendela' } : { role: 'quit', label: 'Keluar' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo', label: 'Undo' },
        { role: 'redo', label: 'Redo' },
        { type: 'separator' },
        { role: 'cut', label: 'Cut' },
        { role: 'copy', label: 'Copy' },
        { role: 'paste', label: 'Paste' },
        { role: 'selectAll', label: 'Pilih Semua' }
      ]
    },
    {
      label: 'Tampilan',
      submenu: [
        { role: 'reload', label: 'Muat Ulang' },
        { role: 'forceReload', label: 'Muat Ulang Paksa' },
        { role: 'toggleDevTools', label: 'Toggle Developer Tools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Ukuran Normal' },
        { role: 'zoomIn', label: 'Perbesar' },
        { role: 'zoomOut', label: 'Perkecil' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Layar Penuh' }
      ]
    },
    {
      label: 'Jendela',
      submenu: [
        { role: 'minimize', label: 'Minimalkan' },
        { role: 'zoom', label: 'Zoom' },
        ...(isMac
          ? [
              { type: 'separator' },
              { role: 'front', label: 'Bawa ke Depan' },
              { type: 'separator' },
              { role: 'window', label: 'Jendela' }
            ]
          : [{ role: 'close', label: 'Tutup' }])
      ]
    },
    {
      label: 'Bantuan',
      submenu: [
        {
          label: 'Tentang & Info Aplikasi',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu-app-info');
          }
        },
        {
          label: 'Periksa Pembaruan...',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('trigger-check-update');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Panduan & Fitur',
          click: async () => {
            await shell.openPath(path.join(__dirname, 'README.md'));
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC listener for print request from UI
ipcMain.on('window-print', () => {
  if (mainWindow) mainWindow.webContents.print();
});

// IPC listener for opening external URLs safely
ipcMain.on('open-external-url', (_event, url) => {
  if (url && (url.startsWith('http:') || url.startsWith('https:'))) {
    shell.openExternal(url);
  }
});

// IPC listener for checking updates
ipcMain.on('check-update', () => {
  if (app.isPackaged) {
    autoUpdater.checkForUpdates().catch(err => {
      if (mainWindow) mainWindow.webContents.send('updater-error', err ? err.message : 'Gagal memeriksa pembaruan.');
    });
  } else {
    // In dev mode, simulate checking process
    if (mainWindow) {
      mainWindow.webContents.send('updater-checking');
      setTimeout(() => {
        mainWindow.webContents.send('updater-dev-mode', {
          currentVersion: app.getVersion(),
          message: 'Aplikasi berjalan dalam mode pengembang (Development).'
        });
      }, 1200);
    }
  }
});

// IPC listener to start downloading update after user confirmation
ipcMain.on('start-download-update', () => {
  if (app.isPackaged) {
    autoUpdater.downloadUpdate().catch(err => {
      if (mainWindow) mainWindow.webContents.send('updater-error', err ? err.message : 'Gagal mengunduh pembaruan.');
    });
  } else {
    // Dev mode simulation for testing download progress and install UI
    if (mainWindow) {
      let percent = 0;
      const interval = setInterval(() => {
        percent += 20;
        if (percent >= 100) {
          clearInterval(interval);
          mainWindow.webContents.send('updater-downloaded', {
            version: '1.3.0 (Demo Development)'
          });
        } else {
          mainWindow.webContents.send('updater-progress', {
            percent: Math.min(percent, 99),
            bytesPerSecond: 1024 * 1024 * 2.8,
            transferred: (percent / 100) * 85 * 1024 * 1024,
            total: 85 * 1024 * 1024
          });
        }
      }, 350);
    }
  }
});

// Directly apply update on macOS to support unsigned applications (bypassing Squirrel.Mac requirement)
function applyMacUpdateAndRestart() {
  const fs = require('fs');
  const { spawn } = require('child_process');

  const cacheDir = path.join(app.getPath('home'), 'Library/Caches/timelineflow-updater');
  const pendingDir = path.join(cacheDir, 'pending');
  const standardZip = path.join(cacheDir, 'update.zip');

  let targetZip = null;
  if (fs.existsSync(standardZip)) {
    targetZip = standardZip;
  } else if (fs.existsSync(pendingDir)) {
    try {
      const files = fs.readdirSync(pendingDir).filter(f => f.endsWith('.zip'));
      if (files.length > 0) {
        targetZip = path.join(pendingDir, files[0]);
      }
    } catch (e) {
      console.warn('Gagal membaca direktori pending updater:', e);
    }
  }

  const execPath = process.execPath;
  const match = execPath.match(/^(\/.*?\.app)\//);
  const currentAppBundle = match ? match[1] : null;

  if (targetZip && currentAppBundle && fs.existsSync(currentAppBundle)) {
    const scriptPath = path.join(app.getPath('temp'), `apply_timelineflow_update_${Date.now()}.sh`);
    const scriptContent = `#!/bin/bash
# Menunggu aplikasi lama benar-benar keluar
while kill -0 ${process.pid} 2>/dev/null; do
  sleep 0.3
done
sleep 0.5

TMP_EXTRACT="/tmp/timelineflow_upgrade_$$"
rm -rf "$TMP_EXTRACT"
mkdir -p "$TMP_EXTRACT"

# Ekstrak versi baru dari update.zip
unzip -q -o "${targetZip}" -d "$TMP_EXTRACT"

EXTRACTED_APP=$(find "$TMP_EXTRACT" -maxdepth 1 -name "*.app" | head -n 1)

if [ -n "$EXTRACTED_APP" ] && [ -d "$EXTRACTED_APP" ]; then
  xattr -cr "$EXTRACTED_APP" 2>/dev/null || true
  rm -rf "${currentAppBundle}"
  cp -R "$EXTRACTED_APP" "${currentAppBundle}"
  chmod -R 755 "${currentAppBundle}"
  xattr -cr "${currentAppBundle}" 2>/dev/null || true
  rm -rf "$TMP_EXTRACT"
  rm -f "${scriptPath}"
  open "${currentAppBundle}"
else
  rm -rf "$TMP_EXTRACT"
  rm -f "${scriptPath}"
  open "${currentAppBundle}"
fi
`;

    try {
      fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 });
      const child = spawn('/bin/bash', [scriptPath], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();
      app.quit();
      return;
    } catch (err) {
      console.error('Gagal menjalankan skrip pembaruan langsung macOS, beralih ke quitAndInstall:', err);
    }
  }

  // Fallback ke default quitAndInstall
  autoUpdater.quitAndInstall();
}

// IPC listener to install and restart
ipcMain.on('install-update', () => {
  if (app.isPackaged) {
    if (process.platform === 'darwin') {
      applyMacUpdateAndRestart();
    } else {
      autoUpdater.quitAndInstall();
    }
  } else {
    app.relaunch();
    app.quit();
  }
});

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();

  if (app.isPackaged) {
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch(err => {
        console.error('Gagal memeriksa pembaruan otomatis:', err);
      });
    }, 5000);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
