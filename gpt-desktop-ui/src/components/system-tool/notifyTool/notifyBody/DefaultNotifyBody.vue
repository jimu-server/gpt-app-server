<template>
  <div>
    {{ ctx.message }}
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const props = defineProps<{
  data: string
}>()

const ctx = ref()

ctx.value = JSON.parse(props.data)

</script>


<style scoped>

</style>