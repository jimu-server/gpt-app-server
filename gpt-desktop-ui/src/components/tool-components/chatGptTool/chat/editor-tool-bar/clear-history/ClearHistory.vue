<template>
  <q-chip
      icon="jimu-shanchu"
      label="清空历史"
      size="md"
      style="cursor: default;user-select: none"
      :color="toggleColer"
      @click.passive="clear"
  />
</template>
<script setup lang="ts">
import {computed} from "vue";
import {useThemeStore} from "@/components/system-components/store/theme";
import {clearMessage} from "@/components/tool-components/chatGptTool/chatRequest";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {ElMessage} from "element-plus";

const theme = useThemeStore()
const ctx = useGptStore()
const toggleColer = computed(() => {
  return theme.dark ? "grey-10" : "grey-2"
})

async function clear() {
  console.log("clear")
  if (ctx.CurrentChat.messageList.length == 0) return
  // 获取当前 对话
  let id = ctx.CurrentChat.Current.Conversation.id;
  let result = await clearMessage(id);
  if (result.code) {
    ElMessage({
      message: "清空成功",
      type: "success",
      plain: true,
      grouping: true
    })
    ctx.CurrentChat.messageList = []
    ctx.view = []
    ctx.newView = []
  }
}
</script>


<style scoped>

</style>