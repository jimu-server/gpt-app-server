import {defineStore} from "pinia";
import {AppSetting, Tree} from "@/components/system-components/model/system";


export const useAppStore = defineStore('app', {
    state: () => {
        return {
            defaultAvatar: 'https://jimuos-1252940994.cos.ap-nanjing.myqcloud.com/go.jpg',
            dict: {},
            ui: {
                drawer:{
                    leftDrawerOpen:false,

                },
                page: {
                    width: 0,
                    height: 0
                },
            },
            settings: [
                {
                    id: "1",
                    name: "API",
                    value: "ApiSetting",
                    setting: '"{}"',
                }
            ] as AppSetting<any>[]
        }
    },
    persist: true,
    getters: {},
    actions: {

        /*
        * @description: 获取字典数据
        * @param {type} 字典数据类型模块
        * @param {value} 字典数据值
        * @return: 字典数据对应展示
        * */
        get(type: string, value: number): string {
            let list = this.dict[type]
            for (const element of list) {
                if (element.status == value) {
                    return element.name
                }
            }
            return ''
        },
        getSettings(value: string): AppSetting<any> {
            for (const element of this.settings) {
                if (element.entity.name == value) {
                    return element.entity
                }
                if (element.children.length > 0) {
                    let result = this.getSettings(value)
                    if (result != null) {
                        return result
                    }
                }
            }
            return null
        }
    }
})