<template>
  <main-page class="fit">
    <div id="markdown-container" class="row justify-center"
         style="width: 500px;height: 500px;overflow: auto;position: relative">
      <div id="markdown-container">

      </div>
    </div>
  </main-page>
</template>

<script setup lang="ts">
import {h, onMounted, ref, render} from "vue";
import {useAppStore} from "@/components/system-components/store/app";

const app = useAppStore()


onMounted(() => {

})


</script>


<style scoped>
#markdown-container {
  position: absolute;
}
</style>