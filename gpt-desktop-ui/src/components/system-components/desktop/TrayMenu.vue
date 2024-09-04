<template>
  <div ref="tray" class="column justify-center fit " style="user-select: none">
    <q-list dense>
      <MenuItem icon="jimu-exit" text="退出" @click="desktop_exit"/>
    </q-list>
  </div>
</template>

<script setup lang="ts">


import {onMounted, ref} from "vue";
import {ipcMain, ipcRenderer} from "electron";
import MenuItem from "@/components/system-components/widget/MenuItem.vue";
import {desktop_exit} from "@/components/system-components/desktop/desktop";
import {useAppStore} from "@/components/system-components/store/app";
import {useThemeStore} from "@/components/system-components/store/theme";

const tray = ref()
const app = useAppStore()
const theme = useThemeStore()

ipcRenderer.on("open", () => {
  // 打开系统托盘时候获取焦点
  tray.value.focus()
})

ipcRenderer.on("theme-change", (event, args) => {
  theme.setTheme(args)
})

// 菜单失去焦点时候隐藏

onMounted(() => {
  tray.value.addEventListener("blur", () => {
    ipcRenderer.send("close-tray")
  })
})

</script>


<style scoped>

</style>