const { app, BrowserWindow } = require('electron')

require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
})

function createWindow() {
    const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    win.loadFile('./modules/main/index.html')
    win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})