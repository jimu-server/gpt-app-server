<script setup lang="ts">
import {desktop_minimize} from "@/components/system-components/desktop/desktop";
import {usePlatformStore} from "@/components/system-components/store/platform";
const platform = usePlatformStore()
</script>

<template>
  <q-btn  dense square flat class="window-minimize" icon="jimu-zuixiaohua1" @click.stop="desktop_minimize"
         style="height: 100%;width: 43px;-webkit-app-region: no-drag;"/>
</template>

<style scoped>

.window-minimize {

}

.window-minimize:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

</style>