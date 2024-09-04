<template>
  <img draggable="false" :src="src"/>
</template>

<script setup lang="ts">

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})
</script>


<style scoped>

</style>