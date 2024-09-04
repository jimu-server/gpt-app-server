<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>
<script lang="ts" setup>
import {onMounted} from "vue";
import {ipcRenderer} from "electron";

import {useQuasar} from "quasar";
import {useThemeStore} from "./components/system-components/store/theme";
import {useAppStore} from "@/components/system-components/store/app";

import {desktop_open_dev} from "@/components/system-components/desktop/desktop";
import {useRouter} from "vue-router";
import route from "@/route";

const app = useAppStore()
const theme = useThemeStore()
const router = useRouter()
const $q = useQuasar()


window.onresize = function () {
  let byId = document.getElementById("page-view");
  if (byId) {
    let h = byId.style.minHeight.substring(0, byId.style.minHeight.length - 2);
    app.ui.page.height = parseInt(h)
  }
}


/*
* @description 退出登录触发,使用事件通知是为了优化用户体验效果
* */
ipcRenderer.on('login', async (event, arg) => {
  await router.push('/login')
})


$q.iconMapFn = (iconName) => {
  // iconName 是来自 QIcon 中 "name" 属性的值
  // 您的自定义方法，以下只是一个示例：
  if (iconName.startsWith('jimu-') === true) {
    return {
      cls: 'icon iconfont ' + iconName
    }
  }
}


onMounted(() => {
  // 屏蔽 浏览器菜单
  window.oncontextmenu = (event) => {
    event.preventDefault()
    return false;
  }
  let byId = document.getElementById("page-view");
  if (byId) {
    let h = byId.style.minHeight.substring(0, byId.style.minHeight.length - 2);
    app.ui.page.height = parseInt(h)
  }
  // 获取当前操作系统的主题
  const match = matchMedia('(prefers-color-scheme: dark)');
  // 设置Quasar的主题
  $q.dark.set(match.matches)
  // 设置app主题
  theme.setTheme(match.matches)
  // 添加变化监听
  match.addEventListener('change', () => {
    $q.dark.set(match.matches)
    theme.setTheme(match.matches)
  })

  window.onkeydown = function (event) {
    if (event.key == "F12") {
      desktop_open_dev()
    }
  }
})

</script>
<style></style>
