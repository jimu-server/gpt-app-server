<template>
  <main-page>
    <div id="tool" class="fit row justify-center">
      <ToolTable/>
    </div>
  </main-page>
</template>

<script setup lang="ts">
import {useAppStore} from "@/components/system-components/store/app";

const app = useAppStore()
</script>

<style scoped>
#tool {
  padding: 10px;
}
</style>