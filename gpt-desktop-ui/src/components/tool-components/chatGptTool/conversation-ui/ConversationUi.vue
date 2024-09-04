<template>
  <div ref="conversationListRef" class="full-height column" style="overflow: hidden;">
    <div class="row justify-center" style="padding: 7px">
      <search-input width="100%" v-model="ctx.ui.search" @search="search"/>
    </div>
    <div class="full-width" style="overflow:hidden;flex-grow: 1;">
      <q-scroll-area :visible="false" class="fit">
        <q-list class="full-width" padding style="padding: 5px;position: absolute">
          <ConversationItemLabel
              v-for="(item,index) in ctx.sortConversation"
              :item="item"
              :index="index"
              @select="selectChat"
              style="transition: all 0.5s ease;"
          />
        </q-list>
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchInput from "@/components/tool-components/chatGptTool/widget/SearchInput.vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {ConversationEntity} from "@/components/tool-components/chatGptTool/model/chat";
import {ElMessage} from "element-plus";
import ConversationItemLabel
  from "@/components/tool-components/chatGptTool/chat/conversation/ConversationItemLabel.vue";
import {ref} from "vue";
import emitter from "@/plugins/event";
import {ScrollToBottom} from "@/plugins/evenKey";


const ctx = useGptStore()
const conversationListRef = ref()


function search(value: string) {
  ctx.ui.search = value
}

function selectChat(data: ConversationEntity, index: number) {
  // 当前消息处于回复状态,禁止切换会话
  if (ctx.ui.replying) {
    ElMessage({
      message: 'GPT消息回复中,请停止或中断回话后切换',
      type: 'warning',
      duration: 2000,
      showClose: true,
      grouping: true,
      plain: true
    })
    return
  }
  // 切换当前会话消息选中状态
  ctx.SetCurrentChat(data, index)
  emitter.emit(ScrollToBottom)
}
</script>


<style scoped>

</style>