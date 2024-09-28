import {app, BrowserWindow, clipboard, ipcMain, Menu, nativeImage, shell, Tray} from 'electron'


export function winDesktop(win: BrowserWindow) {
    app.setUserTasks([])
    win.setMenu(null)
    let buttons = win.setThumbarButtons([
        {
            click: () => {
                console.log("btn")
            },
            flags: ["noninteractive","enabled"],
            icon: null,
            tooltip: null
        }
    ]);
    console.log(buttons)
}