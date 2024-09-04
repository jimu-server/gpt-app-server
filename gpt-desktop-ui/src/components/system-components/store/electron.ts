import {defineStore} from "pinia";
import {ipcRenderer} from "electron";
/*
* @description 存储 electron 渲染进程间通讯的共享变量操作 (窗口之间的参数传递)
* */
export const useElectronStore = defineStore('electron', {
    state: () => {
        return {}
    },
    actions: {
        // 获取用户桌面目录
        async getDesktopPath() {
            return await ipcRenderer.invoke('getDesktopPath')
        },
        // 获取用户桌面目录
        async getChildPath(value: string): Promise<any[]> {
            return await ipcRenderer.invoke('getChildPath', value)
        },
        // 获取用户桌面目录
        getUserDataPath() {
            return ipcRenderer.sendSync('getUserDataPath')
        },
        // 获取用户桌面目录
        getDownloadsPath() {
            return ipcRenderer.sendSync('getDownloadsPath')
        },
        // 读取文件对象
        readFiles(path: string[]) {
            return ipcRenderer.invoke('readFiles', path)
        }
    }
})
