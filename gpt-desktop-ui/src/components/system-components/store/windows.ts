import {defineStore} from "pinia";

import {WindowLabel} from "@/components/system-components/model/system";
import {homePath} from "@/variable";
import router from "@/route";

export const useWindowsStore = defineStore('windows', {
    state: () => {
        return {
            // 菜单右键选中的窗口标签索引值
            select: 0,
            // index 当前选中的窗口标签在 windowLabels 中的索引值
            index: 0 as number,
            windowLabels: [] as WindowLabel[],
        }
    },
    persist: true,
    getters: {},
    actions: {
        // 用于切换角色时候对重新根据 auths 初始化全局标签的处理
        updateLabels(auths: string[]) {
            let arr = this.windowLabels

            // 记录当前的打开窗口信息,下面初始化窗口信息避免每次都初始化打开第一个页签
            let open = arr[this.index]
            let flag = auths.includes(open.path)
            let indexOf = this.index

            // 获取当前已授权的窗口对象
            let filter: WindowLabel[] = arr.filter((item: WindowLabel) => {
                return auths.includes(item.path)
            });

            // 暂时默认打开第一个窗口
            for (const item of filter) {
                const index = filter.indexOf(item);
                if (flag) {
                    if (item.path === open.path) {
                        item.check = true
                        router.push(item.path)
                        indexOf = index
                    }
                } else {
                    if (index == 0) {
                        item.check = true
                        router.push(item.path)
                    } else {
                        item.check = false
                    }
                }
            }
            // 如果 没有满足条件的标签打开 默认路由到 首页
            if (filter.length == 0) {
                router.push(homePath)
                indexOf = 0
            }
            this.update(filter, indexOf)
        },
        UpdateSelect(index: number) {
            this.select = index
        },
        UpdateWindow(value: WindowLabel) {
            if (value.path === homePath) {
                return;
            }
            let arr = this.windowLabels
            let index = this.index
            if (arr.length === 0) {
                arr.push(value)
                this.update(arr, 0)
                return
            }
            // 取消原来的选中
            arr[index].check = false
            let number = -1
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].path === value.path) {
                    number = i
                    break
                }
            }
            if (number === -1) {
                arr.push(value)
                // 新添加窗口，默认选中最后一个
                this.update(arr, arr.length - 1)
            } else {
                arr[number].check = true
                this.update(arr, number)
            }
        },
        openWindow(path: string, value: number) {
            if (path === homePath) {
                return;
            }
            let arr = this.windowLabels
            for (let i = 0; i < arr.length; i++) {
                arr[i].check = false
            }
            arr[value].check = true
            this.update(arr, value)
        },
        closeWindow(check: boolean, value: number) {
            let arr = this.windowLabels
            let index = this.index
            let number = value

            // 判断当前窗口是否处于打开状态，打开状态需要切换到后面一个窗口
            if (check) {
                // 删除最后一个窗口
                if (number === arr.length - 1) {
                    if (number === 0) {
                        router.push(homePath)
                        arr = []
                        index = 0
                        this.update(arr, index)
                        return
                    }
                    // 打开前面一个窗口
                    arr[number - 1].check = true
                    index = number - 1
                    router.push(arr[index].path)
                } else {
                    arr[number + 1].check = true
                    index = number
                    router.push(arr[number + 1].path)
                }
            }
            arr.splice(number, 1)
            this.update(arr, index)
        },

        //  关闭指定标签
        closeLabel() {
            // 获取选中窗口状态
            let labels: WindowLabel[] = this.windowLabels
            let label = labels[this.select]
            if (label.check) {
                // 如果当前选中的窗口是打开状态 需要调用 closeWindow
                this.closeWindow(label.check, this.select)
            } else {
                // 直接移除标签
                labels.splice(this.select, 1)
                //  移除一个未打开的标签不需要更新 index
                this.update(labels, this.index)
            }
        },
        // 关闭指定标签之外的所有标签
        closeOther() {
            let labels: WindowLabel[] = this.windowLabels
            let label = labels[this.select]
            label.check = true
            router.push(label.path)
            let arr: WindowLabel[] = [label]
            this.update(arr, 0)
        },
        // 关闭当前所有标签
        async closeAll() {
            let arr: WindowLabel[] = []
            this.update(arr, 0)
            await router.push(homePath)
        },
        update(arr: WindowLabel[], index: number) {
            this.windowLabels = arr
            this.index = index
        },
        clear() {
            let arr: WindowLabel[] = []
            this.update(arr, 0)
        },
    }
})