import App from './App.vue'
import {createApp} from 'vue'
import './styles/style.css'
// 导入自定义图标
import './assets/icons/iconfont.css'
// 动画库
import 'animate.css';
import 'highlight.js/styles/github.css';

import {Dialog, Notify, Quasar} from 'quasar'
import quasarLang from 'quasar/lang/zh-CN'
import quasarIconSet from 'quasar/icon-set/svg-themify'
// Import Quasar css
import 'quasar/src/css/index.sass'

import router from "./route";
import pina from "./pinia";
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './styles/el-light.scss'
import './styles/el-dark.scss'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import {init} from "@/init";

//default styles
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

import '@/components/tool-components/chatGptTool/style/md.css'
import '@/components/tool-components/chatGptTool/style/md-dark.css'
import '@/components/tool-components/chatGptTool/chat/initPrism'


const app = createApp(App)

app.use(Quasar, {
    config: {},
    plugins: {
        Dialog,
        Notify
    }, // import Quasar plugins and add here
    lang: quasarLang,
    iconSet: quasarIconSet,
})
app.use(pina)
app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

init(app)
app.mount('#app')
