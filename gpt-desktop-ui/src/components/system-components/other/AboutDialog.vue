<template>
  <el-dialog
      v-model="model"
      append-to-body
      align-center
      :modal="false"
      :show-close="false"
      draggable
      style="width: 10vw;height: 15vh;-webkit-app-region: no-drag;"
  >
    <div class="fit justify-center column">
      <div class="row justify-center">
        jimuos
      </div>
      <div class="row justify-center">
        0.0.0
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
const model = defineModel({default: false, required: true})
</script>


<style scoped>

</style>