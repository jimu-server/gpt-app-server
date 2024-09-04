import axiosForServer from "@/plugins/axiosForServer";
import {
    AppSetting,
    Org,
    Page,
    Result,
    Role,
    Router,
    Tool,
    Tree,
    User
} from "@/components/system-components/model/system";


export function defaultLogin(account: string, password: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>("/public/login", {
            account: account,
            password: password
        }).then((res) => {
            resolve(res.data);
        })
    })
}

/*
* @description 获取用户信息
* */
export function getUserInfo() {
    return new Promise<User>(resolve => {
        axiosForServer.get("/api/user/info")
            .then(({data}) => {
                if (data.code != 200) {
                    resolve({})
                    return
                }
                resolve(data.data)
            })
    })
}

/*
* @description 获取用户默认首选 组织 和组织默认角色
* */
export function getUserDefaultInfo() {
    return new Promise<any>(resolve => {
        axiosForServer.get("/api/user/default/info")
            .then(({data}) => {
                if (data.code != 200) {
                    resolve({})
                    return
                }
                resolve(data.data)
            })
    })
}

export function getUserOrgDefaultRole(orgId: string) {
    return new Promise<Role>(resolve => {
        axiosForServer.get("/api/user/default/org/role", {
            params: {
                orgId: orgId
            }
        })
            .then(({data}) => {
                if (data.code != 200) {
                    resolve({})
                    return
                }
                resolve(data.data)
            })
    })
}

/*
* @description 获取用户所有授权的工具按钮
* */
export function getUserAuthTool() {
    return new Promise<Tool[]>(resolve => {
        axiosForServer.get('/api/user/auth/tool')
            .then(({data}) => {
                if (data.code != 200) {
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

export function getUserAuthToolMenu() {
    return new Promise<Tree<Router>[]>(resolve => {
        axiosForServer.get('/api/user/auth/tool/menu')
            .then(({data}) => {
                if (data.code != 200) {
                    resolve([])
                    return
                }
                resolve(data.data)
            })
    })
}


/*
* @description 获取用户前端所有的路由授权路径 包括工具栏 和所有菜单栏
* */
export function getUserAllRoute(orgId: string, roleId: string) {
    return new Promise<string[]>(resolve => {
        axiosForServer.get('/api/user/all_auth_route', {
            params: {
                orgId: orgId,
                roleId: roleId
            }
        })
            .then(({data}) => {
                if (data.code != 200) {
                    resolve([])
                    return
                }
                resolve(data.data)
            })
    })
}


/*
* @description 获取用户加入过的所有组织
* */
export function getUserJoinOrgList() {
    return new Promise<Org[]>(resolve => {
        axiosForServer.get('/api/user/org/list')
            .then(({data}) => {
                if (data.code != 200) {
                    resolve([])
                    return
                }
                resolve(data.data)
            })
    })
}

/*
* @description 获取用户加入组织的所有角色
* */
export function getUserJoinOrgRoleList(orgId: string) {
    return new Promise<Role[]>(resolve => {
        axiosForServer.get('/api/user/org/list/role', {
            params: {
                orgId: orgId
            }
        })
            .then(({data}) => {
                if (data.code != 200) {
                    resolve([])
                    return
                }
                resolve(data.data)
            })
    })
}

export function getDicts() {
    return new Promise<any>(resolve => {
        axiosForServer.get<Result<any>>('/api/dictionary')
            .then(({data}) => {
                if (data.code != 200) {
                    resolve([])
                    return
                }
                resolve(data.data)
            })
    })
}


export function getOrgRoleList(orgId: string, page: number, size: number) {
    return new Promise<Page<Role>>(resolve => {
        axiosForServer.get<Result<Page<Role>>>('/api/org/role/list', {
            params: {
                orgId: orgId,
                page: page,
                pageSize: size
            }
        })
            .then(({data}) => {
                if (data.code != 200) {
                    resolve(null)
                    return
                }
                resolve(data.data)
            })
    })
}

export function updateUserBaseInfo(any: any) {
    return new Promise<any>(resolve => {
        axiosForServer.post<Result<any>>('/api/user/update', any)
            .then(({data}) => {
                resolve(data)
            })
    })
}


export function updateUserOrgRole(orgId: string, oldRoleId: string, newRoleId: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/api/user/org/update/role', {
            orgId: orgId,
            oldRoleId: oldRoleId,
            newRoleId: newRoleId
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function updateUserOrg(oldOrgId: string, newOrgId: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/api/user/org/update/org', {
            oldOrgId: oldOrgId,
            newOrgId: newOrgId
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function getSecure() {
    return new Promise<any>(resolve => {
        axiosForServer.get<Result<any>>('/api/user/secure')
            .then(({data}) => {
                if (data.code != 200) {
                    resolve({})
                    return
                }
                resolve(data.data)
            })
    })
}


export function getPhoneCode(phone: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.get<Result<any>>('/public/login_code', {
            params: {
                phone: phone
            }
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}


export function updatePassword(password: string, newPassword: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/api/user/secure/update/password', {
            password: password,
            newPassword: newPassword
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function updatePhone(phone: string, code: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/api/user/secure/update/phone', {
            phone: phone,
            code: code
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function updateEmail(email: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/api/user/secure/update/email', {
            email: email
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function verifyEmail(value: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/public/secure/email/' + value)
            .then(({data}) => {
                resolve(data)
            })
    })
}


export function getSecurePhoneCode(phone: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.get<Result<any>>('/api/user/secure/update/phone/code', {
            params: {
                phone: phone
            }
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function checkPassword(password: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/api/user/secure/check/password', {
            password: password
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function getForgetCode(email: string, phone: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.get<Result<any>>('/public/forget/code', {
            params: {
                email: email,
                phone: phone
            }
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}

export function checkForgetCode(email: string, phone: string, code: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/public/forget/code/check', {
            phone: phone,
            email: email,
            code: code
        })
            .then(({data}) => {
                resolve(data)
            })
    })
}


export function doResetPassword(phone: string, email: string, password: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/public/forget/reset', {
            phone: phone,
            email: email,
            password: password
        }).then(({data}) => {
            resolve(data)
        })
    })
}

export function registerUser(data: any) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/public/register', data).then(({data}) => {
            resolve(data)
        })
    })
}

export function appSetting(tools: string[]) {
    return new Promise<Tree<AppSetting<any>>[]>(resolve => {
        axiosForServer.post<Result<Tree<AppSetting<any>>[]>>('/api/settings', {
            tools: tools
        }).then(({data}) => {
            if (data.code != 200) {
                resolve(null)
                return
            }
            resolve(data.data)
        })
    })
}



