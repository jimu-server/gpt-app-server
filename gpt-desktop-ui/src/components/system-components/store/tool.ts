import {defineStore} from "pinia";
import router, {modules} from "@/route";
import {rootPathName} from "@/variable";
import {getUserAuthToolMenu} from "@/components/system-components/request";
import {userStore} from "@/components/system-components/store/user";
import pina from "@/pinia";
import {Router, Tool, Tree} from "@/components/system-components/model/system";
import {ToolLayout} from "@/components/system-components/model/enum";

export const useToolStore = defineStore('tool', {
    state: () => {
        return {
            baseWidth: 300,
            left: {
                width: 300,
                buttons: [] as Tool[],
                ctx: {} as Tool,
                isOpen: false
            },
            right: {
                width: 57,
                buttons: [] as Tool[],
                ctx: {} as Tool,
                isOpen: false
            },
            buttons: [] as Tool[],
            buttons_router: {} as Map<string, Tree<Router>[]>
        }
    },
    persist: true,
    getters: {},
    actions: {
        /*
        * @description: 注册工具栏的路由
        * */
        async UpdateToolRoute() {
            // 加载 工具路由
            let store = userStore(pina)
            // 获取所有已授权的路由
            let menus = await getUserAuthToolMenu()
            this.buttons_router = {}
            for (const button of this.buttons) {
                // 用与初始化 工具的子路由的 父级路由名称 如果工具本身没有路由 , 子路由的父级路由将是  rootPathName
                let routerName = rootPathName
                // 判断 当前的工具栏受否是路由类型 不是路由类型 就不需要添加路由
                if (button.type == 1) {
                    const component = modules[`./${button.component}.vue`]
                    if (button.path === '' || button.name === '') {
                        continue
                    }
                    router.addRoute(
                        rootPathName,
                        {
                            path: button.path,
                            name: button.routerName,
                            component: component
                        }
                    )
                    routerName = button.routerName
                }
                // 查找道歉的工具中是否存在菜单 如果存在菜单 就初始化
                for (const menu of menus) {
                    if (menu.entity.toolId === button.id) {
                        if (!this.buttons_router[button.id]) {
                            this.buttons_router[button.id] = [] as Tree<Router>[]
                        }
                        this.buttons_router[button.id].push(menu)
                        this.UpdateToolMenuRouter(routerName, [menu])
                    }
                }
            }
        },
        /*
        * @description: 注册工具栏存在的子路由
        * */
        UpdateToolMenuRouter(parent: string, menus: Tree<Router>[]) {
            for (const menu of menus) {
                const component = modules[`./${menu.entity.component}.vue`]
                if (menu.entity.path !== '' || menu.entity.component !== '') {
                    router.addRoute(
                        parent,
                        {
                            path: menu.entity.path,
                            name: menu.entity.name,
                            component: component
                        }
                    )
                }
                this.UpdateToolMenuRouter(parent, menu.children)
            }
        },

        /*
        * @description 工具栏点击按钮操作,执行对更具蓝窗口视图的更新控制,点击相同的工具栏按钮会触发关闭(即拖拽宽度恢复到初始52状态),切换到其他工具栏按钮则不关闭
        * */
        OpenToolWindow(ctx: any, btn: Tool) {
            console.log("ctx: ", ctx.ctx)
            console.log("btn: ", btn)
            if (ctx.ctx.id == btn.id) {
                if (ctx.isOpen) {
                    ctx.isOpen = false
                    ctx.width = 57
                    // 清空 侧边栏对于的当前组件上下文
                    ctx.ctx = {}
                    console.log("close tool")
                    return

                }
            }
            ctx.ctx = btn
            if (!ctx.isOpen) {
                ctx.isOpen = true
                ctx.width = 300
                console.log("open tool")
            }
        },

        /*
        * @description: 初始化工具栏,对工具位置进行分类
        * */
        init(buttons: Tool[]) {
            this.buttons = []
            this.left.buttons = []
            this.right.buttons = []
            for (const button of buttons) {
                switch (button.position) {
                    case ToolLayout.Left:
                        this.left.buttons.push(button)
                        break
                    case ToolLayout.Right:
                        this.right.buttons.push(button)
                        break
                }
            }
            this.buttons.push(...buttons)
        },

        alterWidth(ctx: any, width: number) {
            let btn = ctx.ctx as Tool
            if (btn.position == ToolLayout.Left) {
                this.left.width = this.baseWidth + width
            } else {
                this.right.width = this.baseWidth + width
            }
        },

        clear() {
            this.left = {
                width: 57,
                buttons: [],
                ctx: {} as Tool,
                isOpen: false
            }
            this.right = {
                width: 57,
                buttons: [],
                ctx: {} as Tool,
                isOpen: false
            }
            this.buttons = []
            this.buttons_router = {}
        },
    },
})