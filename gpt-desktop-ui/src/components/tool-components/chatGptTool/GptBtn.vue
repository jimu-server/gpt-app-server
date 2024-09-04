<template>
  <ToolButton :btn="btn" @receive="receive" :position="position" @btnClick="load"/>
</template>


<script setup lang="ts">
import {Records, Tool} from "@/components/system-components/model/system";
import {onMounted} from "vue";
import ToolButton from "@/components/system-components/layouts/tool/ToolButton.vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";

const ctx = useGptStore()
const props = defineProps<{
  btn: Tool
  position: number
}>()


function receive(data: Records) {

}

async function load() {
  // 加载会话
  await ctx.GetConversationList()
  // 加载模型
  await ctx.GetModelList()
  // 状态数据 更新 会话ui 需要对 showChat 参数进行重置
  await ctx.GetConversationList()
}

onMounted(async () => {

})


</script>


<style scoped>

</style>