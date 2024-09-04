<!-- 系统默认工具按钮 -->
<template>
  <ToolButton :btn="btn" @receive="receive" :position="position"/>
</template>


<script setup lang="ts">
import {useQuasar} from "quasar";
import {Tool} from "../../system-components/model/system";

const $q = useQuasar()
const props = defineProps<{
  btn: Tool
  position: number
}>()


function receive(data) {
  console.log(data)
}

</script>


<style scoped>

</style>