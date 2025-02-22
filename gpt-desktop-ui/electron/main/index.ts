import {app, BrowserWindow, clipboard, ipcMain, nativeImage, shell, Tray} from 'electron'
import {release} from 'node:os'
import {join} from 'node:path'
import * as path from "path";
import os from "os";

import {spawn} from 'node:child_process'
import {ChildProcess} from "child_process";
import {getSubdirectories, readFiles} from "../utils";
import AbortController from "abort-controller";
import {winCreateTray, winDesktop} from '../win';
import {appleCreateTray, appleDesktop} from "../apple";


// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()


// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'


// 主窗口
let win: BrowserWindow | null = null
// 托盘
let tray: Tray | null = null
// 本地服务
let server: ChildProcess = null

const controller = new AbortController();
const {signal} = controller;

// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
export const url = process.env.VITE_DEV_SERVER_URL
export const indexHtml = join(process.env.DIST, 'index.html')

process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, "../public")
    : process.env.DIST;

// const vueDevToolsPath = path.resolve(__dirname, '../../6.5.1_0')

const ctx = {
    name: 'AIChat'
}

let appIcon = null

// 本地服务 基路径
let appServerBasePath = null
// 服务器路径
let appServerPath = null


// app 图标
if (process.env.VITE_DEV_SERVER_URL) {
    appIcon = join(__dirname, "../../build/icons/icon.ico")
} else {
    // 生产环境 图标加载位置为打包后的位置
    appIcon = join(path.dirname(app.getPath('exe')), "resources/build/icons/icon.ico")
}

// app 本地服务器
if (process.env.VITE_DEV_SERVER_URL) {
    appServerBasePath = join(__dirname, "../../server")
    appServerPath = join(appServerBasePath, "main.exe")
} else {
    // 生产环境 本地服务器 加载位置为打包后的位置
    appServerBasePath = join(path.dirname(app.getPath('exe')), "resources/server")
    appServerPath = join(appServerBasePath, "main.exe")
}


function createWindow() {
    win = new BrowserWindow({
        title: ctx.name,
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        icon: appIcon,
        frame: true,
        show: false,
        backgroundColor: "transparent",
        webPreferences: {
            spellcheck: false,
            preload,
            nodeIntegration: true,
            contextIsolation: false,
            partition: String(+new Date()),
        },
    })
    win.on("close", (event) => {
        event.preventDefault()
        win.hide()
    })
    switch (os.platform()) {
        case "win32":
            winDesktop(win)
            break
        case "darwin":
            appleDesktop(win)
            break
        default:
            console.log(os.platform())
    }

    // 通过事件初始化窗口显示时机 避免白版闪烁
    win.on('ready-to-show', () => {
        win.show()
    })

    // win.setIgnoreMouseEvents(false, {forward: true})
    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
        // console.log(url)
        win.loadURL(url + '#/app/home')
        // 打开浏览器调试窗口
        win.webContents.openDevTools()
    } else {
        win.loadURL(indexHtml + '#/app/home')
    }
    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })
    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({url}) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return {action: 'deny'}
    })
}

function startAppLocalServer() {
    if (appServerPath) {
        // 通过 spawn 创建的进程服务,应用程序结束自动退出
        console.log(appServerPath)
        server = spawn(appServerPath)
    }
}

app.whenReady().then(async () => {
    createWindow()
    await createTray()
    // 加载本地服务
    if (import.meta.env.MODE !== 'development') {
        console.log("begin start ollama server")
        startAppLocalServer()
    }
})

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', async () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

app.on('quit', () => {

})

ipcMain.on('DevTools', () => {
    if (win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools()
    } else {
        win.webContents.openDevTools()
    }
})

ipcMain.on('toggle', () => {
    if (win) {
        if (win.isMaximized()) {
            win.unmaximize()
        } else {
            win.maximize()
        }
    }
})

ipcMain.on('login', (event, args) => {
    if (win) {
        win.hide()
        // 通知渲染进程 跳转页面
        event.sender.send('home')
        setTimeout(() => {
            win.setMaximizable(true)
            win.setResizable(true)
            win.setMinimizable(true)
            win.setMinimumSize(1200, 800)
            win.setContentSize(1200, 800)
            win.setSize(1200, 800)
            win.center()
            win.show()
        }, 1000)
    }
})

/*
* @description 执行登出操作
* 修改窗口大小
* */
ipcMain.on('logout', (event, args) => {
    if (win) {
        win.hide()
        event.sender.send('login')
        setTimeout(() => {
            if (win.isMaximized()) {
                win.restore()
            }
            win.setResizable(false)
            win.setMaximizable(false)
            win.setMinimumSize(360, 450)
            win.setContentSize(360, 450)
            win.setSize(360, 450)
            win.center()
            win.show()
        }, 1000)

    }
})

// New window example arg: new windows url
ipcMain.handle('open-win', async (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        await childWindow.loadURL(`${url}#${arg}`)
    } else {
        await childWindow.loadFile(indexHtml, {hash: arg})
    }
})

ipcMain.on("on-copy", () => {
    let text = clipboard.readText()
})

/*
* @description: 执行关闭应用程序窗口
* */
ipcMain.on("window-quite", () => {
    win.hide()
})

ipcMain.on("window-max", (event, args) => {
    if (win.isMaximized()) {
        win.unmaximize()
    } else {
        win.maximize()
    }
    event.sender.send("win-change")
})

ipcMain.on("window-min", (event) => {
    if (win.isMinimized()) {
        win.restore()
    } else {
        win.minimize()
    }
    event.sender.send("win-change")
})

/*
* @description: 切换主题
* */
ipcMain.on("theme", (event, args) => {
    trayMenu.webContents.send("theme-change", args)
})

/*
* @description: 执行推出应用程序
* */
ipcMain.on("window-exit", () => {
    if (tray) {
        tray.destroy()
    }
    if (trayMenu) {
        trayMenu.destroy()
    }
    if (win) {
        win.destroy()
    }
    if (server) {
        server.kill()
    }
    app.quit()
})

async function createTray() {
    const icon = nativeImage.createFromPath(appIcon)

     switch (os.platform()) {
        case "win32":
            tray= await winCreateTray(icon,ctx.name)
            break
        case "darwin":
            tray=appleCreateTray(icon,ctx.name)
            break
        default:
            console.log(os.platform())
    }


}




ipcMain.handle('getDesktopPath', async () => {
    return app.getPath('desktop')
})

ipcMain.handle('getChildPath', async (event, value) => {
    return await getSubdirectories(value)
})
ipcMain.handle('readFiles', async (event, value) => {
    return readFiles(value);
})









