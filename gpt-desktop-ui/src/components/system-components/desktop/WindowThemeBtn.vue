<template>
  <q-btn dense square flat :icon=" $q.dark.isActive?'img:./light.png':'img:./dark.png'" @click.stop="alter"
        :ripple="false" style="height: 100%;width: 40px;-webkit-app-region: no-drag;"/>
</template>

<script setup lang="ts">
import {useThemeStore} from "@/components/system-components/store/theme";
import {desktop_theme_change} from "@/components/system-components/desktop/desktop";
import {useQuasar} from "quasar";

const theme = useThemeStore()
const $q = useQuasar()

function alter() {
  $q.dark.toggle()
  theme.setTheme($q.dark.isActive)
  // 同步修改 系统托盘主题
  desktop_theme_change($q.dark.isActive)
}

</script>

<style scoped>

</style>