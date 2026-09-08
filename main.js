const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;

// Configure Auto-Updater (Require user confirmation before download)
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

function setupAutoUpdater() {
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
      sandbox: true,
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
              { role: 'about', label: 'Tentang TimelineFlow' },
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
            if (mainWindow) mainWindow.webContents.print();
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

// IPC listener to install and restart
ipcMain.on('install-update', () => {
  if (app.isPackaged) {
    autoUpdater.quitAndInstall();
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
