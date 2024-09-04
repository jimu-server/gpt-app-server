/*
* @description 转化后端数据适配 ElTree 组件使用
* */
import {Tree} from "@/components/system-components/model/system";

export function initializeElTree<T>(tree: Tree<T>[]): any[] {
    let arr = []
    for (let i = 0; i < tree.length; i++) {
        let item = tree[i]
        let obj = {...item.entity, children: []}
        if (item.children.length > 0) {
            let chaild = initializeElTree(item.children)
            obj.children = chaild
        }
        arr.push(obj)
    }
    return arr
}

/*
* @description 转化前端数据适配 ElTree node-key 属性使用
* */
export function getIds(tree: Tree<any>[]): string[] {
    let ids: string[] = []
    for (let i = 0; i < tree.length; i++) {
        let item = tree[i]
        ids.push(item.entity.id)
        if (item.children.length > 0) {
            ids = ids.concat(getIds(item.children))
        }
    }
    return ids
}


/*
* @description 获取用户路由的授权状态映射
* */
export function getUserRouterAuthMapping(tree: Tree<any>[]): Map<string, boolean> {
    let map = new Map<string, boolean>()
    for (let i = 0; i < tree.length; i++) {
        let item = tree[i]
        map.set(item.entity.id, item.entity.status)
        if (item.children.length > 0) {
            let chaild = getUserRouterAuthMapping(item.children)
            for (let [key, value] of chaild) {
                map.set(key, value)
            }
        }
    }
    return map
}

export function updateTreeStatus(tree: Tree<any>[], status: Map<string, boolean>) {
    if (tree == null) {
        return
    }
    for (let i = 0; i < tree.length; i++) {
        let item = tree[i]
        item.entity.status = status.get(item.entity.id)
        if (item.children.length > 0) {
            updateTreeStatus(item.children, status)
        }
        item.entity.status = true
    }
}

export function getTreeIds(tree: any[]): string[] {
    let ids: string[] = []
    for (let i = 0; i < tree.length; i++) {
        let item = tree[i]
        ids.push(item.id)
        if (item.children.length > 0) {
            ids = ids.concat(getIds(item.children))
        }
    }
    return ids
}

/*
* @description 更具初始权限和修改之后的权限，计算中间的新增和移除的权限
* @param change_before 初始权限
* @param change_after 修改之后的权限
* */
export function computingAuthorization<T>(change_before: T[], change_after: T[]) {
    let before = (new Set(change_before))
    let after = new Set(change_after)
    // 新增授权的权限
    let auth_ids = new Set([...after].filter(x => !before.has(x)))
    // 删除已授权项
    let sub_ids = new Set([...after].filter(x => !auth_ids.has(x)))
    // 移除授权的权限
    let unauth_ids = new Set([...before].filter(x => !sub_ids.has(x)))
    return {
        auth_ids,
        unauth_ids
    }
}


/*
* @description 获取树列表中所有有子节点的节点id
* */
export function getTreeRootNodeIds(tree: any[]) {
    let ids: string[] = []
    for (let i = 0; i < tree.length; i++) {
        let item = tree[i]
        if (item.children.length > 0) {
            ids.push(item.id)
            ids.push(...getTreeRootNodeIds(item.children))
        }
    }
    return ids
}