
import axiosForServer from "@/plugins/axiosForServer";
import {Records, Result} from "@/components/system-components/model/system";


export function getAllNotify() {
    return new Promise<Records[]>(resolve => {
        axiosForServer.get('/api/notify/pull')
            .then(({data}) => {
                if (data.code !== 200) {
                    resolve([])
                    return
                }
                if (data.data == null) {
                    resolve([])
                    return;
                }
                resolve(data.data)
            })
    })
}

export function clearNotify() {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post('/api/notify/clear')
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function readNotify(id: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/api/notify/read', {
            id: id
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function deleteNotify(id: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/api/notify/delete', {
            id: id
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}