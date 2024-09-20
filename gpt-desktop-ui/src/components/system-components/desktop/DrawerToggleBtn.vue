<script setup lang="ts">
import {useAppStore} from "@/components/system-components/store/app";

const app = useAppStore()
</script>

<template>
  <q-btn dense flat :icon="!app.ui.drawer.leftDrawerOpen?'jimu-arrow-double-right':'jimu-arrow-double-left'"
         @click.stop="app.ui.drawer.leftDrawerOpen = !app.ui.drawer.leftDrawerOpen"
         style="margin-left: 5px;margin-right: 5px;-webkit-app-region: no-drag;"/>
</template>

<style scoped>

</style>