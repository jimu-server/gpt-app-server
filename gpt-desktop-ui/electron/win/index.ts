import {app, BrowserWindow, ipcMain, NativeImage, Tray} from 'electron'
import {indexHtml, url} from "../main";

let trayMenu: BrowserWindow | null = null

export function winDesktop(win: BrowserWindow) {
    app.setUserTasks([])
    win.setMenu(null)
    let buttons = win.setThumbarButtons([
        {
            click: () => {
                console.log("btn")
            },
            flags: ["noninteractive", "enabled"],
            icon: null,
            tooltip: null
        }
    ]);
    console.log(buttons)
}

export async function winCreateTray(icon: NativeImage, name: string): Tray {
    let tray = new Tray(icon)
    tray.setToolTip(ctx.name)
    // 当前 ui 写的托盘菜单最低30(单个菜单项)
    let menuHeight = 30
    trayMenu = new BrowserWindow({
        title: ctx.name,
        width: 110,
        height: menuHeight,
        frame: false,
        resizable: false,
        maximizable: false,
        skipTaskbar: false,
        alwaysOnTop: true,
        show: false,
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
            partition: String(+new Date())
        },
    })
    trayMenu.setAlwaysOnTop(true, 'pop-up-menu')
    if (process.env.VITE_DEV_SERVER_URL) {
        await trayMenu.loadURL(url + "#/tray")
    } else {
        await trayMenu.loadURL(indexHtml + "#/tray")
    }

    // 失去焦点后隐藏窗口
    trayMenu.on('blur', () => {
        trayMenu.hide()
    })

    /*
    * @description: 双击托盘图标，显示窗口
    * */
    tray.on('double-click', () => {
        if (!win.isVisible()) win.show()
        win.moveTop()
        trayMenu.hide()
    })
    /*
    * @description: 点击托盘图标，显示托盘菜单窗口
    * */
    tray.on('right-click', (event, point) => {
        let x = point.x + (point.width / 2)
        let y = point.y - menuHeight + (point.height / 2)
        trayMenu.setPosition(parseInt(x.toString()), parseInt(y.toString()))
        trayMenu.show()
        trayMenu.focus()
    })
}

ipcMain.on('close-tray', () => {
    trayMenu.hide()
})