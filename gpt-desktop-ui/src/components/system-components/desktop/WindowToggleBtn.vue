<script setup lang="ts">
import {desktop_max} from "@/components/system-components/desktop/desktop";
import {usePlatformStore} from "@/components/system-components/store/platform";
const platform = usePlatformStore()
</script>

<template>
  <q-btn :replace="false" dense square flat class="window-minimize" icon="jimu-window-maximize" @click.stop="desktop_max"
         :ripple="false" style="height: 100%;width: 43px;-webkit-app-region: no-drag;font-size: 10px"/>
</template>

<style scoped>

.window-minimize:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

</style>