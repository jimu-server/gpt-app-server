/*
* @description: 重新加载用户信息
* */
import {userStore} from "@/components/system-components/store/user";
import pina from "@/pinia";
import {useToolStore} from "@/components/system-components/store/tool";
import {
    appSetting,
    getDicts,
    getUserAllRoute,
    getUserAuthTool,
    getUserDefaultInfo,
    getUserInfo,
    getUserJoinOrgList,
    getUserJoinOrgRoleList
} from "@/components/system-components/request";
import {useAuthStore} from "@/components/system-components/store/auth";
import {useNotifyStore} from "@/components/system-tool/notifyTool/store/notify";
import {useAppStore} from "@/components/system-components/store/app";
import {getAllNotify} from "@/components/system-tool/notifyTool/notifyRequest";
import CryptoJS from 'crypto-js'

export async function loadUserInfo() {
    let user = userStore(pina)
    let tool = useToolStore(pina)
    let auth = useAuthStore(pina)
    let notify = useNotifyStore(pina)
    let app = useAppStore(pina)
    await orgInfo()
    // todo 获取用户个人信息
    await baseInfo()
    // todo 加载用户已授权的工具栏按钮
    tool.init(await getUserAuthTool())
    // todo 注册工具按钮 路由
    await tool.UpdateToolRoute()
    // todo 加载用户当前组织当前角色的所有前端路由权限列表
    auth.auth = await getUserAllRoute(user.info.org.id, user.info.role.id)
    // todo 主动拉取所有通知
    notify.list = await getAllNotify()
    // todo 拉取所有字典信息
    app.dict = await getDicts()
    // 拉取配置项信息
    let tools = []
    tool.buttons.forEach(element => {
        tools.push(element.id)
    })
    // app.settings = await appSetting(tools)
}

export async function baseInfo() {
    let user = userStore(pina)
    user.info.user = await getUserInfo()
}

export async function orgInfo() {
    let user = userStore(pina)
    // todo 获取用户默认组织 和组织默认角色
    let info = await getUserDefaultInfo()
    // 默认组织
    user.info.org = info.org
    // 默认组织的默认角色
    user.info.role = info.role
    user.info.defaultOrg = info.org.id
    user.info.defaultRole = info.role.id
    // todo 获取用户加入的所有组织
    user.info.orgList = await getUserJoinOrgList()
    // todo 获取默认组织下的所有角色
    user.info.roleList = await getUserJoinOrgRoleList(user.info.org.id)
}

export function getPassword(password: string) {
    const hash = CryptoJS.SHA512(password).toString()
    return hash
}