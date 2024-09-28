

<template>
  <template v-if="$q.platform.is.platform=='win'">
    <WindowThemeBtn/>
<!--    <WindowMinimizeBtn/>
    <WindowToggleBtn/>
    <WindowCloseBtn2/>-->
  </template>
</template>

<script setup lang="ts">

import WindowThemeBtn from "@/components/system-components/desktop/WindowThemeBtn.vue";
import WindowMinimizeBtn from "@/components/system-components/desktop/WindowMinimizeBtn.vue";
import WindowCloseBtn2 from "@/components/system-components/desktop/WindowCloseBtn2.vue";
import WindowToggleBtn from "@/components/system-components/desktop/WindowToggleBtn.vue";
import {useQuasar} from "quasar";
const $q=useQuasar()

</script>

<style scoped>

</style>