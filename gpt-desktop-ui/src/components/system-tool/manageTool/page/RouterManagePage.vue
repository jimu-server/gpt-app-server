<template>
  <main-page>
    <div id="router" class="fit row justify-center">
      <RouterTable/>
    </div>
  </main-page>
</template>

<script setup lang="ts">
import {useAppStore} from "@/components/system-components/store/app";

const app = useAppStore()
</script>


<style scoped>
#router {
  padding: 10px;
}
</style>