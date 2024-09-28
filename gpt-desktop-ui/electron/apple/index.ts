import {BrowserWindow, Menu} from 'electron'


export function appleDesktop(win: BrowserWindow) {
    win.setMenu(null)
    Menu.setApplicationMenu(Menu.buildFromTemplate([]))
}