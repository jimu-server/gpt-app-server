import axiosForServer from "@/plugins/axiosForServer";
import {Org, Page, Result, Role, Router, Tool, Tree, User} from "@/components/system-components/model/system";


/*
* @description: 获取组织及其下属组织
* */
export function getOrgChildTree(orgId: string) {
    return new Promise<Tree<Org>[]>(resolve => {
        axiosForServer.get('/api/user/org/listTree', {
            params: {
                orgId: orgId
            }
        }).then(({data}) => {
            if (data.code != 200 || data.data == null) {
                resolve([])
                return
            }
            resolve(data.data)
        })
    })
}

/*
* @description: 获取组织下的用户
* */
export function getOrgUserList(orgId: string, page: number, size: number) {
    return new Promise<Page<User>>(resolve => {
        axiosForServer.get<Result<Page<User>>>('/api/org/user/list', {
            params: {
                orgId: orgId,
                page: page,
                pageSize: size,
            }
        }).then(({data}) => {
            if (data.code != 200 || data.data == null) {
                resolve(null)
                return
            }
            resolve(data.data)
        })
    })
}

/*
* @description 获取所有用户列表
* */
export function getUserList(page: number, size: number) {
    return new Promise<Page<User>>(resolve => {
        axiosForServer.get<Result<Page<User>>>('/api/org/user/all', {
            params: {
                page: page,
                pageSize: size,
            }
        }).then(({data}) => {
            if (data.code != 200 || data.data == null) {
                resolve(null)
                return
            }
            resolve(data.data)
        })
    })
}


/*
* @description: 获取组织指定用户的角色授权列表
* */
export function getOrgUserRole(orgId: string, userId: string) {
    return new Promise<Role[]>(resolve => {
        axiosForServer.get<Result<Role[]>>('/api/org/user/role', {
            params: {
                userId: userId,
                orgId: orgId,
            }
        }).then(({data}) => {
            if (data.code != 200 || data.data == null) {
                resolve([])
                return
            }
            resolve(data.data)
        })
    })
}


/*
* @description: 获取指定用户指定角色的已授权的工具
* */
export function getOrgUserTool(orgId: string, userId: string, roleId: string) {
    return new Promise<Tool[]>(resolve => {
        axiosForServer.get<Result<Tool[]>>('/api/org/user/tool', {
            params: {
                userId: userId,
                orgId: orgId,
                roleId: roleId,
            }
        }).then(({data}) => {
            if (data.code != 200 || data.data == null) {
                resolve([])
                return
            }
            resolve(data.data)
        })
    })
}

/*
* @description 给用户添加角色授权
* */
export function OrgUserAuthRole(orgId: string, userId: string, auths: string[], unAuth: string[]) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<void>>('/api/org/role/auth', {
            orgId: orgId,
            userId: userId,
            auths: auths,
            unAuth: unAuth
        }).then(({data}) => {
            resolve(data)
        })
    })
}


export function OrgUserAuthTool(orgId: string, userId: string, roleId: string, auths: string[], unAuth: string[]) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<void>>('/api/org/role/auth/tool', {
            orgId: orgId,
            userId: userId,
            roleId: roleId,
            auths: auths,
            unAuth: unAuth
        }).then(({data}) => {
            resolve(data)
        })
    })
}

export function OrgUserAuthToolRouter(orgId: string, userId: string, roleId: string, toolId: string, auths: string[], unAuth: string[]) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<void>>('/api/org/role/auth/tool/route', {
            orgId: orgId,
            userId: userId,
            roleId: roleId,
            routerId: toolId,
            toolId: toolId,
            auths: auths,
            unAuth: unAuth
        }).then(({data}) => {
            resolve(data)
        })
    })
}


/*
* @description: 获取组织角色的已授权工具列表
* */
export function OrgRoleTool(orgId: string, roleId: string) {
    return new Promise<Tool[]>(resolve => {
        axiosForServer.get<Result<Tool[]>>('/api/role/tool/list', {
            params: {
                roleId: roleId,
                orgId: orgId,
            }
        }).then(({data}) => {
            if (data.code != 200 || data.data == null) {
                resolve([])
                return
            }
            resolve(data.data)
        })
    })
}


/*
* @description: 获取组织角色对应工具的已授权列表
* */
export function OrgRoleToolRouter(orgId: string, roleId: string, toolId: string) {
    return new Promise<Tree<Router>[]>(resolve => {
        axiosForServer.get<Result<Tree<Router>[]>>('/api/role/tool/router/tree', {
            params: {
                roleId: roleId,
                orgId: orgId,
                toolId: toolId,
            }
        }).then(({data}) => {
            if (data.code != 200 || data.data == null) {
                resolve([])
                return
            }
            resolve(data.data)
        })
    })
}


export function OrgRoleToolAuth(orgId: string, roleId: string, auths: string[], unAuth: string[]) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<void>>('/api/role/tool/auth', {
            orgId: orgId,
            roleId: roleId,
            auths: auths,
            unAuth: unAuth
        }).then(({data}) => {
            resolve(data)
        })
    })
}

export function OrgRoleToolRouterAuth(orgId: string, roleId: string, toolId: string, auths: string[], unAuth: string[]) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<void>>('/api/role/tool/router/auth', {
            orgId: orgId,
            roleId: roleId,
            toolId: toolId,
            auths: auths,
            unAuth: unAuth
        }).then(({data}) => {
            resolve(data)
        })
    })
}

export function CreateOrg(pid: string, name: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/api/org/create', {
            pid: pid,
            name: name
        }).then(({data}) => {
            resolve(data)
        })
    })
}


export function createOrgRole(orgId: string, name: string, key: string) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/api/org/role/create', {
            orgId: orgId,
            name: name,
            roleKey: key
        }).then(({data}) => {
            resolve(data)
        })
    })
}

export function getTools(page: number, size: number) {
    return new Promise<Page<Tool>>(resolve => {
        axiosForServer.get<Result<Page<Tool>>>('/api/tool/list', {
            params: {
                page: page,
                pageSize: size,
            }
        }).then(({data}) => {
            if (data.code != 200 || data.data == null) {
                resolve({count: 0, rows: []})
                return
            }
            resolve(data.data)
        })
    })
}

export function getOrgUserToolRouter(orgId: string, userId: string, roleId: string, toolId: string) {
    return new Promise<Tree<Router>[]>(resolve => {
        axiosForServer.get<Result<Tree<Router>[]>>('/api/org/user/tool/router', {
            params: {
                orgId: orgId,
                userId: userId,
                roleId: roleId,
                toolId: toolId,
            }
        }).then(({data}) => {
            if (data.code != 200 || data.data == null) {
                resolve(null)
                return
            }
            resolve(data.data)
        })
    })
}


/*
* @description: 获取指定工具栏下的所有路由信息
* */
export function getToolRouter(pid: string, toolId: string, page: number, size: number) {
    return new Promise<Page<Router>>(resolve => {
        axiosForServer.get<Result<Page<Router>>>('/api/tool/router/list', {
            params: {
                pid: pid,
                toolId: toolId,
                page: page,
                pageSize: size,
            }
        }).then(({data}) => {
            if (data.code != 200 || data.data == null) {
                resolve({count: 0, rows: []})
                return
            }
            resolve(data.data)
        })
    })
}

/*
* @description: 获取指定工具栏下的所有路由信息
* */
export function getToolRouterChild(pid: string, toolId: string) {
    return new Promise<Router[]>(resolve => {
        axiosForServer.get<Result<Router[]>>('/api/tool/router/list', {
            params: {
                pid: pid,
                toolId: toolId,
                page: 1,
                pageSize: 10,
            }
        }).then(({data}) => {
            if (data.code != 200 || data.data == null) {
                resolve([])
                return
            }
            resolve(data.data)
        })
    })
}


export function createTool(data: Tool) {
    return new Promise<Result<any>>(resolve => {
        axiosForServer.post<Result<any>>('/api/tool/create', data).then(({data}) => {
            resolve(data)
        })
    })
}