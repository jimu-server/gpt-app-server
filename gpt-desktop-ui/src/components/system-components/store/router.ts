import {defineStore} from "pinia";
import Axios from "@/plugins/axiosForServer";
import {Router, Result, RouterCache} from "@/components/system-components/model/system";
import router, {modules} from "@/route";
import {nextTick} from "vue";


export const useRouterStore = defineStore('router', {
    state: () => {
        return {
            // 定义 状态数据
            cache: [] as RouterCache[],
            // menu_route: MenuToolRoute()
        }
    },
    persist: true,
    actions: {
        async AddRouteCache(value: RouterCache) {
            let index = -1
            // 缓存中存在数据 则跳过
            index = this.cache.findIndex(item => {
                return item.root === value.root && item.path === value.path
            })
            if (index !== -1) {
                console.log("register route cache: ", value.root, value.path, " 已存在...  ")
                return
            }
            console.log("register route cache: ", value.root, value.path, " 开始注册...  ")
            // 注册
            const component = modules[`./${value.component}.vue`]
            router.addRoute(
                value.root,
                {
                    path: value.path,
                    name: value.name,
                    component: component,
                }
            )
            this.cache.push(value)
        },
        reload() {
            this.cache.forEach(element => {
                const component = modules[`./${element.component}.vue`]
                router.addRoute(
                    element.root,
                    {
                        path: element.path,
                        name: element.name,
                        component: component,
                    }
                )
            })
        }
    }
})


export async function MenuToolRoute() {
    return await getMenuRoute()
}

function getMenuRoute() {
    return new Promise<Router[]>(resolve => {
        Axios.get('/menu').then(response => {
            let data: Result<Router[]> = response.data
            if (data.code === 200) {
                resolve(data.data)
            } else {
                resolve([])
            }
        }).catch(error => {
            resolve([])
        })
    })
}