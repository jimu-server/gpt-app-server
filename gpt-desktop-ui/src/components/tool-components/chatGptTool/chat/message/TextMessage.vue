<template>
  <div class="text-message user-message">
    {{ message.content }}
  </div>
</template>


<script setup lang="ts">
import {ref} from "vue";
import {AppChatMessageItem} from "@/components/tool-components/chatGptTool/model/model";



const props = defineProps<
    {
      // 消息
      message: AppChatMessageItem,
      index: number
    }
>()
let info = props.message!
const send = ref(false)
send.value = props.message.role === 'user'

</script>

<style scoped>

</style>