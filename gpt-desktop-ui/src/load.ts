
import {App} from "vue";
import FriendInfoAndSetting from "./components/desktop/friend/FriendInfoAndSetting.vue";

const all: any[] = [
    FriendInfoAndSetting
]

export function register(app:App) {
    all.forEach(item => {
        app.component(item.__name, item)
    })
}