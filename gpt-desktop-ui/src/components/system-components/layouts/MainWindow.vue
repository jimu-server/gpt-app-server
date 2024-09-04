<template>
  <q-layout view="lHr lpR fFf">
    <q-header
        v-if="!gpt.ui.showChat"
        :class="theme.header.className"
        style="-webkit-app-region: drag;"
    >
      <slot name="header">
        <q-toolbar class="bg-transparent row"
                   :style="{
            padding:0,
            height:'40px'
          }">
          <q-space/>
          <!--          <WindowThemeBtn/>
                    <WindowMinimizeBtn/>
                    <WindowToggleBtn/>
                    <WindowCloseBtn2/>-->
          <HeaderToolBar/>
          <WindowBtnGroup/>
        </q-toolbar>
      </slot>
    </q-header>
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" behavior="desktop" bordered :width=" tool.left.width"
              class="app-drawer">
      <MainWindowTool :position="ToolLayout.Left" :tool-ctx="tool.left.ctx"/>
    </q-drawer>
    <!--  聊天窗口 目标的信息窗口,单聊显示 好友信息及其好友设置,群聊则显示群信息和群设置  -->
    <!--  主视图  -->
    <q-page-container class="column justify-center" v-size="sizeChange">
      <MessageUi/>
    </q-page-container>
    <AboutDialog v-model="showAboutDialog"/>
    <SettingDialog v-model="showSettingDialog"/>
  </q-layout>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import {useQuasar} from "quasar";
import {UserLogout} from "@/plugins/evenKey";
import emitter from "@/plugins/event";
import {useToolStore} from "@/components/system-components/store/tool";
import MainWindowTool from "@/components/system-components/layouts/tool/MainWindowTool.vue";
import {ToolLayout} from "@/components/system-components/model/enum";
import AboutDialog from "@/components/system-components/other/AboutDialog.vue";
import SettingDialog from "@/components/system-components/setting/SettingDialog.vue";
import {useAppStore} from "@/components/system-components/store/app";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import MessageUi from "@/components/tool-components/chatGptTool/message-ui/MessageUi.vue";
import WindowCloseBtn2 from "@/components/system-components/desktop/WindowCloseBtn2.vue";
import WindowToggleBtn from "@/components/system-components/desktop/WindowToggleBtn.vue";
import WindowMinimizeBtn from "@/components/system-components/desktop/WindowMinimizeBtn.vue";
import WindowThemeBtn from "@/components/system-components/desktop/WindowThemeBtn.vue";
import {useThemeStore} from "@/components/system-components/store/theme";
import HeaderToolBar from "@/components/system-components/desktop/HeaderToolBar.vue";
import WindowBtnGroup from "@/components/system-components/desktop/WindowBtnGroup.vue";

const tool = useToolStore()
const $q = useQuasar()
const theme = useThemeStore()
const leftDrawerOpen = ref(false)
const showAboutDialog = ref(false)
const showSettingDialog = ref(false)

const app = useAppStore()
const ctx = useGptStore()
const gpt = useGptStore()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const vSize = {
  updated(el, binding, vnode, prevVnode) {
    if (typeof binding.value === 'function') {
      binding.value(el.clientWidth, el.clientHeight);
    }
  },
}

function sizeChange(width: number, height: number) {
  let byId = document.getElementById("page-view");
  if (byId) {
    let h = byId.style.minHeight.substring(0, byId.style.minHeight.length - 2);
    app.ui.page.height = parseInt(h)
  }
}

async function logout() {
  setTimeout(async () => {
    emitter.emit(UserLogout)
  }, 100)
}

async function load() {
  // 加载会话
  await ctx.GetConversationList()
  // 加载模型
  await ctx.GetModelList()
  // 状态数据 更新 会话ui 需要对 showChat 参数进行重置
  await ctx.GetConversationList()
}

onMounted(async () => {
  await load()
})

onUnmounted(async () => {

})

</script>

<style scoped>
.app-windows {
  width: 100%;
  height: 100%;
}

.userinfo:hover {
  cursor: default;
}

.drawer-opt {
  margin-top: 5px;
}

#suspension-menu {
  position: fixed;
  top: 300px;
  left: 0;
  width: 70px;
  height: 100px;
  background: #dddddf;
}


</style>

<style>
.app-drawer {
  overflow: hidden;
  min-width: 57px;
}
</style>