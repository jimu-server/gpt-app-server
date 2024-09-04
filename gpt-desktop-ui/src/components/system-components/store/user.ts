import {defineStore} from "pinia";
import {Org, Role, Token, User} from "@/components/system-components/model/system";


export const userStore = defineStore('user', {
    state: () => {
        return {
            // 定义 状态数据
            info: {
                token: '',
                refreshToken: '',
                user: {
                    name: "user",
                    picture: 'https://im-1252940994.cos.ap-nanjing.myqcloud.com/go.jpg',
                } as User,
                // 用户当前所加入的组织
                orgList: [] as Org[],
                // 用户当前组织下分配的角色
                roleList: [] as Role[],
                org: {} as Org,
                role: {} as Role,
                defaultOrg: '',
                defaultRole: '',
            } as Token,
        }
    },
    persist: true,
    getters: {},
    actions: {
        clear() {
            this.info = {
                token: '',
                refreshToken: '',
                user: {} as User,
                // 用户当前所加入的组织
                orgList: [] as Org[],
                // 用户当前组织下分配的角色
                roleList: [] as Role[],
                org: {} as Org,
                role: {} as Role,
                defaultOrg: '',
                defaultRole: '',
            } as Token
        }
    }
})