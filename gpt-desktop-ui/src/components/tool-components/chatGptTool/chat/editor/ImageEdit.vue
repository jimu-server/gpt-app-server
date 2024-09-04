<template>
  <div class="image-editor">
<!--    <img />-->
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const props = defineProps<{ file: File }>()

const src = ref('')
if (props.file != null) {

}
</script>

<style scoped>

</style>