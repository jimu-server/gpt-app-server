<template>
  <q-page id="page-view" class="full-width column">
    <slot>

    </slot>
  </q-page>
</template>

<script setup lang="ts">
import {useAppStore} from "@/components/system-components/store/app";
const app = useAppStore()
</script>


<style scoped>
#page-view {
  overflow: hidden;
  height: calc(v-bind('app.ui.page.height') * 1px);
}
</style>