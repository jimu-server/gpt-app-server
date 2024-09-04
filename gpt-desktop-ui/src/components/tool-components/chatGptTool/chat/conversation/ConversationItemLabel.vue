<template>
  <q-item
      :key="item.Conversation!.id"
      :focused="item!.focused"
      :active="item!.active"
      clickable
      @click="selectChat(item,index)"
      :active-class="item.active? 'chat-active text-white':'text-black'"
      style="border-radius: 3px;margin-top: 5px;width: 100%"
      :class="item.active?'chat-active text-white':'chat-unactive'"
      :theme="theme.dark?'dark':'light'"
  >
    <!--    好友头像     -->
    <q-item-section avatar>
      <q-avatar>
        <img :src="item.Conversation!.picture===''?ctx.gptDefaultAvatar:item.Conversation!.picture"
             alt="" style="user-select: none"/>
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label style="white-space: nowrap">
        <div class="full-width row justify-between" style="overflow: hidden;white-space: nowrap;">
          <!--    会话名称      -->
          <div class="ellipsis" style="user-select: none">
            {{ item.Conversation!.title }}
          </div>
          <!--    会话时间戳      -->
          <div :class="item.active? 'ellipsis text-white' : 'ellipsis text-grey-6'"
               style="user-select: none;overflow: hidden">
            {{ formatTime(item.Conversation.lastTime) }}
          </div>
        </div>
      </q-item-label>
      <q-item-label>
        <div class="full-width row ellipsis">
          <!-- 会话最后一条消息 -->
          <div :class="item.active? 'ellipsis text-white' : 'ellipsis text-grey-7'" style="flex: 1;user-select: none">
            {{ latestMsg(item.Conversation) }}
          </div>
          <!--          <div>
                      <q-badge label="10"/>
                    </div>-->
        </div>
      </q-item-label>
    </q-item-section>
    <ConversationItemMenu :list="list" :ConversationItem="item.Conversation"/>
  </q-item>
</template>

<script setup lang="ts">

import {formatTime} from "@/components/system-components/utils/systemutils";


import {ref} from "vue";

import {ElMessage} from "element-plus";
import {ConversationEntity} from "@/components/tool-components/chatGptTool/model/chat";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {IsEmpty} from "@/components/tool-components/chatGptTool/chat/chatutils";
import {AppChatConversationItem} from "@/components/tool-components/chatGptTool/model/model";
import {delConversation, getConversation} from "@/components/tool-components/chatGptTool/chatRequest";
import {useThemeStore} from "@/components/system-components/store/theme";
import {colors} from "quasar";
import ConversationItemMenu from "@/components/tool-components/chatGptTool/chat/conversation/ConversationItemMenu.vue";

const {getPaletteColor} = colors

defineProps<{
  item: ConversationEntity,
  index: number
}>()

const emits = defineEmits(
    {
      select: (item: ConversationEntity, index: number) => void {}
    }
)

const ctx = useGptStore()
const theme = useThemeStore()
const list = ref([
  {
    name: "删除会话",
    icon: "jimu-shanchu",
    action: (Conversation: AppChatConversationItem) => {
      let flag = false
      if (!IsEmpty(ctx.CurrentChat.Current)) {
        // 判断当前删除的会话是否是当前会话
        flag = ctx.CurrentChat.Current.Conversation!.id === Conversation.id
      }
      delConversation(Conversation.id).then(data => {
        if (data.code === 200) {
          ElMessage({
            message: "删除会话成功",
            type: "success",
            plain: true,
          })
          getConversation().then(data => {
            ctx.setConversation(data)
            if (flag) {
              // 设置一个默认选中会话
              if (ctx.CurrentChat.conversationList.length > 0) {
                ctx.SetCurrentChat(ctx.CurrentChat.conversationList[0], 0)
              }
            }
          })
        }
      })
    }
  }
])


async function selectChat(data: ConversationEntity, index: number) {
  emits('select', data, index)
}

/*
*  @description 处理渲染当前聊天的最后一条消息
* */
function latestMsg(conver: AppChatConversationItem) {
  if (conver.lastMsg.length == 50) {
    return conver.lastMsg.substring(0, 50) + '...'
  }
  return conver.lastMsg
}
</script>


<style scoped>

</style>
<style>
.chat-active {
  background-color: v-bind('getPaletteColor("primary")');
  color: #ffffff;
}

.chat-unactive {
  background-color: rgba(234, 234, 234, 0.92);
}

.chat-unactive[theme="dark"] {
  background-color: rgb(34, 34, 43);
}

</style>