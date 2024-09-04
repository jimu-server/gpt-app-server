import {NotifyMsgType, NotifyStatus} from "@/components/system-tool/notifyTool/template";

export interface User {
    id?: string
    name?: string
    account?: string
    email?: string
    phone?: string
    gender?: number
    age?: string
    picture?: string // 头像
    status?: boolean
    creatTime?: string
}

export interface Token {
    token: string   // 生份认证
    refreshToken: string // 刷新token
    user: User      // 用户信息
    orgList: Org[]       // 所属组织
    roleList: Role[]      // 组织角色
    org: Org     //当前操作组织
    role: Role    //当前操作角色
    defaultOrg: string  //当前用户默认组织
    defaultRole: string //当前用户默认组织的默认角色
}

export interface Tool {
    id: string
    // 工具栏名
    name: string
    // 工具栏路由注册名称
    routerName: string
    // 工具栏显示图标
    icon: string
    component: string

    // type 工具类型 1:工具自身带路由
    type: number
    // btn 工具显示侧边栏的按钮组件名称
    btn: string
    // websocket 消息地址
    ws: string
    // 消息拉取接口
    pull: string
    path: string
    tip: string
    status?: boolean
    position: number
}

export interface Router {
    id: string
    pid: string
    title: string
    icon: string
    name: string
    path: string
    component: string
    remark: string
    status: boolean
    toolId: string
    createTime: string
}

// 动态路由缓存类型
export class RouterCache {
    root: string
    path: string
    name: string
    component: string
}

// 树形结构
export interface Tree<T> {
    entity: T
    children: Tree<T>[]
}


// 功能路由
export class FuncRouter {
    id: number
    method: string   // 请求类型
    name: string     // 功能名称
    path: string     // 请求路径
    status: boolean  // 功能状态
}

export interface Role {
    id?: string
    name?: string
    roleKey?: string
    status?: boolean
    createTime?: string
}

export interface Org {
    id: string
    pid: string
    name: string
    createTime: string
}

export class RouterAuth {
    fullPath: string
}


export class WindowLabel {
    public path: string
    public title: string
    public windowType: number
    public check: boolean
    public icon: string

    constructor(path: string, title: string, icon: string, check: boolean) {
        this.path = path
        this.title = title
        this.icon = icon
        this.check = check
    }
}

// 请求数据解析 接口
export interface Result<T> {
    code: number  // 业务状态码
    msg: string   // 附加消息内容
    data: T       // 响应数据
}

export interface Page<T> {
    count: number
    rows: Array<T>
}

export interface Records {
    id: string      // 消息id
    pubId: string   // 发布者
    subId: string   // 消费者
    title: string   // 标题
    msgType: NotifyMsgType // 消息类型
    text: string    // 消息文本
    status: NotifyStatus  // 消息状态
    template: string
    param: string
    isDelete: boolean     // 删除标记
    createTime: string // 消息生成时间
    updateTime: string //消息处理时间
}


export interface Dict {
    id?: number
    name?: string
    status?: number
    type?: string
    createTime?: string
}

export interface ActionMenu {
    name?: string
    icon?: string
    action?: Function
}


export interface Progress {
    status?: number
    msg?: string
    percent?: number
}


export interface AppSetting<T> {
    id: string
    name: string
    value: string
    setting: T
}

export interface AccountList {
    account: string
    password: string
}

