<template>
  <Transition
      enter-active-class="animate__animated animate__zoomIn"
      leave-active-class="animate__animated animate__zoomOut"
  >
    <slot></slot>
  </Transition>
</template>
<script setup lang="ts">

</script>


<style scoped>

</style>