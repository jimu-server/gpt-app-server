<template>
  <template v-if="send">
    <div class="markdown-message gpt-message shadow-3" v-html="info.content"></div>
  </template>
  <template v-else-if="!send">
    <GptTypeWriter :index="index" :message="message" @heightChange="height"/>
  </template>
</template>


<script setup lang="ts">
import {ref} from "vue";
import {useThemeStore} from "@/components/system-components/store/theme";
import {AppChatMessageItem} from "@/components/tool-components/chatGptTool/model/model";
import {updateTheme} from "@/components/tool-components/chatGptTool/style/update";
import GptTypeWriter from "@/components/tool-components/chatGptTool/chat/message/widget/GptTypeWriter.vue";

const theme = useThemeStore()
const emit = defineEmits({
  // 打字容器高度变化时间
  heightChange: function (value) {
  }
})
const props = defineProps<{
      // 消息
      message: AppChatMessageItem,
      index: number
}>()

// 渲染消息文本存储
const info = ref({...props.message!})

// 标识当前消息是否是用户发送的
const send = ref(false)

// 获取消息发送标识
send.value = props.message.role === 'user'

function height(value: number) {
  emit('heightChange', value)
}


if (theme.dark) {
  updateTheme(theme.dark)
}

</script>

<style scoped>

</style>

<style>

</style>
