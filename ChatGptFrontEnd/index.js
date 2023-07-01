const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Load the Ionic application.
  // win.loadFile('src/index.html')
  //win.loadFile('src/app/home/home.page.html')

  
  win.loadURL(
    process.env.ELECTRON_START_URL ||
    // Load the Ionic application after building with `ionic build --prod`
    `file://${__dirname}/www/index.html`
  );

  // // Alternate way to load directory
  // // This should use the source but it's showing empty page
  // win.loadURL(
  //   process.env.ELECTRON_START_URL ||
  //   `file://${__dirname}/src/index.html`
  // );
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
