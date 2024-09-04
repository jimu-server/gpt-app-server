<template>
  <main-page>
    <q-splitter
        v-if="ctx.ui.showChat "
        v-model="splitterModel2"
        :limits="splitterModel2Limit"
        horizontal
        reverse
        separator-class="separator"
        style="overflow: hidden"
        class="fit"
    >
      <!--    消息展示面板    -->
      <template v-slot:before>
        <MessagePanel ref="messageListRef"/>
      </template>

      <!--     消息输入面板     -->
      <template v-slot:after>
        <ChatEditorPlus @send="send" @max-editor="maxInput"/>
      </template>
    </q-splitter>
  </main-page>
</template>


<script setup lang="ts">
import {ref} from "vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {ChatMessageEntity} from "@/components/tool-components/chatGptTool/model/chat";
import {getSendCtx} from "@/components/tool-components/chatGptTool/gptutil";
import {AiPlugin} from "@/components/tool-components/chatGptTool/variable";
import {sendDefaultMessage} from "@/components/tool-components/chatGptTool/send_message";
import MessagePanel from "@/components/tool-components/chatGptTool/chat/message/MessagePanel.vue";
import ChatEditorPlus from "@/components/tool-components/chatGptTool/chat/editor/ChatEditorPlus.vue";
import MainPage from "@/components/system-components/layouts/MainPage.vue";



const ctx = useGptStore()
const splitterModel2 = ref(25)
const splitterModel2Limit = ref([25, 50])

/*
* @description: 正常消息编辑器发送消息
* */
async function send(message: ChatMessageEntity[]) {
  let sendCtx = getSendCtx();
  switch (sendCtx.plugin.code) {
    case AiPlugin.Programming:
      sendDefaultMessage(sendCtx, message)
      break
    case AiPlugin.Knowledge:
      sendDefaultMessage(sendCtx, message)
      break
    case AiPlugin.Default:
      sendDefaultMessage(sendCtx, message)
      break
  }
}

/*
* @description 编辑器最大化事件触发
* */
function maxInput() {
  if (splitterModel2.value != 100) {
    splitterModel2.value = 100
    splitterModel2Limit.value = []
    return
  }
  splitterModel2.value = 30
  splitterModel2Limit.value = [30, 50]
}

</script>


<style scoped>

</style>