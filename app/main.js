const { app, BrowserWindow } = require('electron')
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const parseVlessToXrayConfig = require('./vlessParser')

let xrayProcess = null

function createXrayConfig(vlessUrl) {
    const outbound = parseVlessToXrayConfig(vlessUrl);
    return {
        log: {
            loglevel: 'info'
        },
        inbounds: [
            {
                port: 1080,
                protocol: 'socks',
                settings: {
                    auth: 'noauth',
                    udp: true
                },
                sniffing: {
                    enabled: true,
                    destOverride: ['http', 'tls']
                }
            }
        ],
        outbounds: [
            outbound,
            {
                protocol: 'freedom',
                tag: 'direct'
            }
        ],
        routing: {
            rules: [
                {
                    type: 'field',
                    outboundTag: outbound.tag,
                    domain: ['geosite:google', 'geosite:youtube', '2ip.ru']
                }
            ]
        }
    };
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    })

    win.loadFile('modules/main/index.html')
    win.webContents.openDevTools()
}

app.on('ready', () => {
    require('electron-reload')(__dirname, {
        electron: require(`${__dirname}/../node_modules/electron`)
    })
    createWindow()

    // Set proxy for Electron session
    const mainWindow = require('electron').BrowserWindow.getAllWindows()[0];
    mainWindow.webContents.session.setProxy({ proxyRules: 'socks5://127.0.0.1:1080' });

    // Start Xray with VLESS config
    // const vlessUrl = 'vless://4052-af0b-f5b151ee91c6@123.212.1.65:32653?security=reality&sni=yahoo.com&fp=firefox&pbk=KZkb7ViBlEhKyJmmmSyaCcvd1QE4iGIHROWo6Ljh8Fo&sid=d52e2202&spx=/&type=tcp&flow=xtls-rprx-vision&encryption=none#test';
    const vlessUrl = 'vless://9c96c7c9-635b-4052-af0b-f5b151ee91c6@147.45.249.209:32653?security=reality&sni=yahoo.com&fp=firefox&pbk=KZkb7ViBlEhKyJmmmSyaCcvd1QE4iGIHROWo6Ljh8Fo&sid=d52e2202&spx=/&type=tcp&flow=xtls-rprx-vision&encryption=none#test'
    const config = createXrayConfig(vlessUrl);
    const configPath = path.join(__dirname, '..', 'resources', 'xray-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    const xrayPath = path.join(__dirname, '..', 'resources', 'xray.exe');
    xrayProcess = spawn(xrayPath, ['-config', configPath], { stdio: 'inherit' });

    xrayProcess.on('close', (code) => {
        console.log(`Xray process exited with code ${code}`);
    });

    xrayProcess.on('error', (err) => {
        console.error('Failed to start Xray:', err);
    });
})

app.on('window-all-closed', () => {
    if (xrayProcess) {
        xrayProcess.kill();
        console.log('Xray process stopped');
    }
    app.quit();
})