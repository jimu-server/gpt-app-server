<template>
  <q-bar class="row bg-transparent justify-between" style="padding: 0;">
    <div class="column justify-center"
         style="cursor: default;user-select: none;width: 100%;overflow: hidden">
      <div class="row justify-start" style="padding-left: 5px">
        {{ title }}
      </div>
    </div>
    <q-btn dense square flat class="close-btn" icon="close" @click.stop="close"
           style="height: 100%;width: 40px;-webkit-app-region: no-drag;"/>
  </q-bar>
</template>
<script setup lang="ts">

const props = defineProps({
  close: Function,
  title: String
})
</script>


<style scoped>
.close-btn:hover {
  color: red;
}
</style>