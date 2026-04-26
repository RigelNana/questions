const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// Keep a global reference to prevent garbage collection
let mainWindow = null;

const isDev = !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 480,
    minHeight: 600,
    title: '刷题工具',
    icon: path.join(__dirname, '..', 'public', 'favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    // Frameless look on macOS, normal on Windows/Linux
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#ECEFF4',
    show: false, // Show when ready to avoid flash
  });

  if (isDev) {
    // In dev mode, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173/questions/');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // In production, load the built index.html
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // Show window when content is ready (avoids white flash)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// macOS: re-create window when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow);
