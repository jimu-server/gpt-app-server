import {ipcRenderer} from "electron";


export function desktop_login() {
    ipcRenderer.send('login')
}

export function desktop_logout() {
    ipcRenderer.send('logout')
}

export function desktop_minimize() {
    ipcRenderer.send('window-min')
}

export function desktop_close() {
    ipcRenderer.send('window-quite')
}

export function desktop_max() {
    ipcRenderer.send('window-max')
}

export function desktop_exit() {
    ipcRenderer.send('window-exit')
}


export function desktop_open_dev() {
    ipcRenderer.send('DevTools')
}


export function desktop_theme_change(flag: boolean) {
    ipcRenderer.send('theme', flag)
}

export function desktop_toggle() {
    console.log("desktop_toggle")
    ipcRenderer.send('toggle')
}