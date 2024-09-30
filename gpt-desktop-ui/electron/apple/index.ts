import {app,BrowserWindow, Menu, NativeImage, Tray} from 'electron'


export function appleDesktop(win: BrowserWindow) {
    win.setMenu(null)
    Menu.setApplicationMenu(Menu.buildFromTemplate([]))
}

export function appleCreateTray(icon: NativeImage, name: string): Tray {
    let tray = new Tray(icon)
    tray.setToolTip(name)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            role: 'quit',
            click: () => {
              app.quit()
            }
        }
    ]);

    tray.setToolTip('Electron Example App');
    tray.setContextMenu(contextMenu);
    return tray
}