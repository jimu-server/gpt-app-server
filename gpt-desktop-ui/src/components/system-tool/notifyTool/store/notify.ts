import {defineStore} from "pinia";
import {Records} from "@/components/system-components/model/system";
import {NotifyStatus, NotifyToolStatusType} from "@/components/system-tool/notifyTool/template";


export const useNotifyStore = defineStore('notify', {
    state: () => {
        return {
            list: [] as Records[],
            unread: 0,
        }
    },
    persist: true,
    getters: {
        getStatus() {
            this.unread = 0
            this.list.forEach(item => {
                if (item.status === NotifyStatus.UnRead) this.unread++
            })
            if (this.unread > 0) {
                return NotifyToolStatusType.UnReadNotify
            }
            return NotifyToolStatusType.NoNotify
        }
    },
    actions: {
        clear(){
            this.list = []
            this.unread = 0
        }
    }
})