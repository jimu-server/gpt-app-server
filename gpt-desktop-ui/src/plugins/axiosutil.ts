import {userStore} from "@/components/system-components/store/user";
import pinia from "@/pinia";


export function GetHeaders(): any {
    let token: string = GetToken()
    let org: string = GetOrg()
    let header: any = {}

    // 添加 token 头
    if (token !== '') {
        header.Authorization = token
    }
    // 添加 org 头
    if (org!== '') {
        header.orgId = org
    }
    return header
}

export function GetToken(): string {
    let token: string = ''
    let store = userStore(pinia);
    let t = store.info.token
    if (t !== '') {
        token = 'Bearer ' + t
    }
    return token
}

export function GetOrg() {
    let store = userStore(pinia);
    if (store.info.org){
        return store.info.org.id
    }
    return ''
}
