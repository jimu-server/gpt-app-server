import {defineStore} from "pinia";
import {AccountList} from "@/components/system-components/model/system";


export const useAccountStore = defineStore('account', {
    state: () => {
        return {
            curent: {} as AccountList,
            keep: false,
            list: [] as AccountList[]
        }
    },
    persist: true,
    getters: {},
    actions: {
        addAccount(account: AccountList) {
            let number = this.list.findIndex(item => {
                return item.account === account.account
            });
            if (number === -1) {
                this.list.push(account)
                return
            }
            this.list[number] = account
        },
        deleteAccount(account: AccountList) {
            let number = this.list.findIndex(item => {
                return item.account === account.account
            });
            if (number === -1) {
                return
            }
            this.list.splice(number, 1)
        }
    }
})