const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;

// Configure Auto-Updater
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    console.log('Memeriksa pembaruan...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log(`Pembaruan versi ${info.version} tersedia.`);
    if (mainWindow) {
      mainWindow.webContents.send('update-available', info);
    }
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('Aplikasi sudah dalam versi terbaru.');
    if (mainWindow) {
      mainWindow.webContents.send('update-not-available', info);
    }
  });

  autoUpdater.on('error', (err) => {
    console.error('Error saat auto-updater:', err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    if (mainWindow) {
      mainWindow.webContents.send('update-download-progress', progressObj);
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    if (mainWindow) {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Pembaruan Siap Dipasang',
        message: `Versi baru (${info.version}) telah selesai diunduh!`,
        detail: 'Restart aplikasi sekarang untuk menerapkan pembaruan?',
        buttons: ['Restart Sekarang', 'Nanti'],
        defaultId: 0,
        cancelId: 1
      }).then(({ response }) => {
        if (response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
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
          label: '🔄 Periksa Pembaruan...',
          click: () => {
            if (app.isPackaged) {
              autoUpdater.checkForUpdates();
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Pembaruan',
                message: 'Memeriksa Pembaruan...',
                detail: 'Sistem sedang memeriksa versi rilis terbaru di server GitHub.'
              });
            } else {
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Periksa Pembaruan',
                message: 'Mode Pengembang (Development)',
                detail: 'Auto-update aktif otomatis pada versi aplikasi yang telah diinstall / dibuild.'
              });
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
    autoUpdater.checkForUpdates();
  }
});

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();

  if (app.isPackaged) {
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify().catch(err => {
        console.error('Gagal memeriksa pembaruan otomatis:', err);
      });
    }, 4000);
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
