<template>
  <div class="chat-message message-entity" :id="message.id">
    <!--  消息头像  -->
    <div class="chat-avatar">
      <q-avatar rounded size="40px"
                class="text-white">
        <img :src="header==''?ctx.gptDefaultAvatar:header" style="width: 40px;height: 40px"/>
        <q-menu
            touch-position
            context-menu
        >
          <q-list dense>
            <q-separator/>
          </q-list>
        </q-menu>
      </q-avatar>
    </div>
    <div class="chat-message-body">
      <!--  消息头   -->
      <div class="chat-header">
        <slot name="header">
          <span>
            {{ name }}
          </span>
        </slot>
      </div>
      <!--   消息正文   -->
      <div ref="bodyRef" class="chat-body" @mouseover="overMessage=true"
           @mouseleave="outOverMessage">
        <!--   用户消息展示     -->
        <TextMessage v-if="message.role=='user'" :message="message" :index="index"/>
        <!--   gpt消息展示     -->
        <MarkDownMessage v-if="message.role!=='user'" :message="message" :index="index" @height-change="isFold"/>
        <!--        <MarkDownMessage v-if="message.role=='assistant'" :message="message" :index="index"/>-->
      </div>
      <!-- 消息页角 该部分对用户暂时不要使用 v-if 进行屏蔽 不显示展位 -->
      <div class="chat-footer" @mouseover="overFooter=true" @mouseleave="outOverFooter">
        <!--  gpt消息操作      -->
        <template v-if="!send">
          <!--    消息折叠遮罩      -->
          <div v-show="foldFlag" class="gpt-fold" :theme="theme.dark?'dark':''"></div>
          <!--    消息操作按钮      -->
          <div class="full-width row reverse" style="margin-top: 5px">
            <MessageAction v-show="isShowAction">
              <q-icon class="msg-option" size="15px" dense flat name="jimu-fuzhi">
                <q-tooltip :offset="[0, 10]">
                  复制
                </q-tooltip>
              </q-icon>
            </MessageAction>

            <MessageAction v-show="isShowAction">
              <q-icon class="msg-option" size="15px" dense flat name="jimu-diancai">
                <q-tooltip :offset="[0, 10]">
                  踩
                </q-tooltip>
              </q-icon>
            </MessageAction>

            <MessageAction v-show="isShowAction">
              <q-icon class="msg-option" size="15px" dense flat name="jimu-dianzan">
                <q-tooltip :offset="[0, 10]">
                  赞
                </q-tooltip>
              </q-icon>
            </MessageAction>

            <MessageAction v-show="isShowAction">
              <q-icon v-if="!doRetry" class="msg-option" size="15px" dense flat name="jimu-a-zhongshi1" @click="retry">
                <q-tooltip :offset="[0, 10]">
                  重试
                </q-tooltip>
              </q-icon>
              <q-spinner-ios
                  v-else
                  class="msg-option"
                  color="primary"
                  size="15px"
                  :thickness="2"
              />
            </MessageAction>

            <MessageAction v-show="isShowAction">
              <q-icon v-show="isShowFoldAction" class="msg-option" size="15px" dense flat
                      :name="foldFlag?'jimu-zhankai':'jimu-shouqi'"
                      @click="check_fold">
                <q-tooltip :offset="[0, 10]">
                  {{ foldFlag ? '展开' : '收起' }}
                </q-tooltip>
              </q-icon>
            </MessageAction>
          </div>
        </template>
        <!--  用户消息操作      -->
        <template v-if="send">
          <div class="full-width row" style="margin-top: 5px">

          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";


import {userStore} from "@/components/system-components/store/user";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {AppChatMessageItem} from "@/components/tool-components/chatGptTool/model/model";
import {retryMessage} from "@/components/tool-components/chatGptTool/gptutil";
import MarkDownMessage from "@/components/tool-components/chatGptTool/chat/message/MarkDownMessage.vue";
import {useThemeStore} from "@/components/system-components/store/theme";
import MessageAction from "@/components/tool-components/chatGptTool/chat/message/MessageAction.vue";
import {deleteMsg} from "@/components/tool-components/chatGptTool/chatRequest";
import {ElMessage} from "element-plus";
import TextMessage from "@/components/tool-components/chatGptTool/chat/message/TextMessage.vue";

const theme = useThemeStore()
const ctx = useGptStore()
const user = userStore()
const bodyRef = ref<HTMLElement>()

// 悬浮操作按钮控制标识
const overMessage = ref(false)
const overFooter = ref(false)
// 是否处于重试状态
const doRetry = ref(false)
const props = defineProps<
    {
      message: AppChatMessageItem,
      index: number
    }
>()

function outOverMessage() {
  setTimeout(() => {
    overMessage.value = false
  }, 200)
}

function outOverFooter() {
  setTimeout(() => {
    overFooter.value = false
  }, 200)
}

let info = props.message!
const send = ref(false)
const fold = ref('300px')
const foldFlag = ref(false)
const header = ref('')
if (props.message.content != '') {
  fold.value = 'none'
}

switch (props.message.role) {
  case 'user':
    header.value = user.info.user.picture
    break
}

// 消息体折叠高度阈值 超过300可以折叠
const defaultHeight = ref(300)
// 当前消息体高度
const currentHeight = ref(0)

const direction = ref('row-reverse')
const direction_text = ref('row-reverse')

send.value = props.message.role === 'user'


const bg = ref('light-green')

const text = ref('black')


if (!send.value) {
  bg.value = 'grey-1'
  text.value = 'black'
  direction.value = 'row'
  direction_text.value = 'row'
  header.value = props.message.picture
}


const name = ref(info.role)

switch (info.role) {
  case "user":
    name.value = user.info.user.name
    break
  case "assistant":
    let model = ctx.ui.modelInfo[info.modelId]
    if (model) {
      name.value = model.name
    }
    name.value = 'Assistant'
    break
}


function check_fold() {
  if (foldFlag.value) {
    un_enable_fold()
    return
  }
  enable_fold()
}


//控制消息操作按钮的显示与隐藏
const isShowAction = computed(() => {

  return overMessage.value || overFooter.value || doRetry.value
})

const isShowFoldAction = computed(() => {
  if (!bodyRef.value) return false
  return bodyRef.value.clientHeight > defaultHeight.value || currentHeight.value > defaultHeight.value
})

/*
* @description: 对当前高度进行一个延迟计算,防止计算过快导致无法正常显示折叠按钮
* */
setTimeout(() => {
  if (bodyRef.value) {
    currentHeight.value = bodyRef.value.clientHeight
  }
}, 500)

/*
*@description: 折叠消息
* */
function enable_fold() {

  fold.value = defaultHeight.value + 'px'
  foldFlag.value = true
}

/*
* @description: 取消折叠
* */
function un_enable_fold() {
  fold.value = 'none'
  foldFlag.value = false
}

function isFold(value: number) {
  currentHeight.value = value
  // 判断是否启用折叠新消息
  if (!ctx.ui.autoFold) {
    fold.value = 'none'
    return;
  }
  if (fold.value == 'none') {
    return
  }
  if (defaultHeight.value <= value) {
    fold.value = defaultHeight.value + 'px'
    foldFlag.value = true
  }
}


function retry() {
  // 如果消息怎么在回复中 则不触发 重试
  if (ctx.ui.replying) {
    return
  }
  ctx.ui.replying = true
  doRetry.value = true
  setTimeout(() => {
    // 更具当前的gpt消息找到最近的一条 user 用户消息进行发送重试
    let userMsg = null
    for (let i = props.index; i >= 0; i--) {
      let message = ctx.CurrentChat.messageList[i]
      if (message.role === 'user') {
        userMsg = message
        break
      }
    }
    if (!userMsg) {
      return
    }
    retryMessage(userMsg)
    doRetry.value = false
  }, 1000)

}

</script>


<style scoped>
.chat-message {
  margin-top: 10px;
  display: flex;
  flex-direction: v-bind('direction');
}

.chat-avatar {
  margin: 10px
}

.chat-message-body {
  max-width: 65%;
}

.chat-header {
  display: flex;
  flex-direction: v-bind('direction');
}

.chat-body {
  display: flex;
  flex-direction: v-bind('direction_text');
  max-height: v-bind('fold');
  overflow: hidden;
  border-radius: 5px;
  background: transparent;
}


.chat-footer {
  position: relative;
  display: flex;
  flex-direction: v-bind('direction');
  height: 30px;
}

.msg-option {
  margin-left: 10px;
}

.user-msg-option {
  margin-right: 10px;
}

.msg-option:hover {
  color: #64b385;
}
</style>