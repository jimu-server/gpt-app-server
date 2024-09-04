import {createPinia, Pinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
let pina:Pinia=createPinia()


// 自动缓存插件
pina.use(piniaPluginPersistedstate)

export default  pina