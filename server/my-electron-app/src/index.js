const { app, BrowserWindow, screen, Menu, MenuItem } = require('electron');
const path = require('path');
const child_process = require('child_process');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // Create context menu template
  const contextMenuTemplate = [
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { type: 'separator' },
    { role: 'selectAll' }
  ];

  // Build context menu
  const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);

  // Set context menu to mainWindow
  mainWindow.webContents.on('context-menu', (event, params) => {
    contextMenu.popup(mainWindow, params.x, params.y);
  });

  // Start Node.js server
  const serverProcess = child_process.spawn('node', ['../app.js'], { cwd: path.join(__dirname, '..', 'server') });
  
  // Serve Angular frontend from Node.js server (assuming it's on port 1111)
  mainWindow.loadURL('http://localhost:1111');

  mainWindow.on('closed', () => {
    mainWindow = null;
    // Kill Node.js server when Electron window is closed
    serverProcess.kill();
  });

  // Add navigation buttons
  const { webContents } = mainWindow;
  const { NavigationController } = webContents;
  
  // Create back button
  const backButton = new MenuItem({
    label: 'Back',
    click: () => NavigationController.canGoBack() && NavigationController.goBack()
  });
  
  // Create forward button
  const forwardButton = new MenuItem({
    label: 'Forward',
    click: () => NavigationController.canGoForward() && NavigationController.goForward()
  });
  
  // Add navigation buttons to context menu
  contextMenu.append(backButton);
  contextMenu.append(forwardButton);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle DevTools error
process.on('uncaughtException', function (error) {
  console.error(error);
});
