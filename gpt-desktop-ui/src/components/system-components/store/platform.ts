import {defineStore} from "pinia";
import {Platform} from "@/components/system-components/model/enum";

export const usePlatformStore = defineStore('platform', {
    state: () => {
        return {}
    },
    actions: {
        isDesktop() {
            console.log(import.meta.env.VITE_APP_PLATFORM)
            if (import.meta.env.VITE_APP_PLATFORM === Platform.Desktop) {
                return true
            }
            return false
        }
    }
})