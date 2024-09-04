<template>
  <div class="edit fit">
    <div class="edit-tool row">
      <ToolWidget>
        <ChatPlugin/>
      </ToolWidget>

      <ToolWidget>
        <ClearHistory/>
      </ToolWidget>



      <q-space/>
      <!--  消息上下文携带配置按钮    -->
      <div class="column justify-center">
        <q-toggle v-model="ctx.ui.autoHistory" size="md" color="primary" checked-icon="jimu-shijian-2">
          <q-tooltip :offset="[0, 0]">
            {{ ctx.ui.autoHistory ? '取消上下文' : '开启上下文' }}
          </q-tooltip>
        </q-toggle>
      </div>
      <!--  消息折叠配置按钮    -->
      <div class="column justify-center">
        <q-toggle v-model="ctx.ui.autoFold" size="md" color="primary">
          <q-tooltip :offset="[0, 0]">
            {{ ctx.ui.autoFold ? '取消折叠新消息' : '自动折叠新消息' }}
          </q-tooltip>
        </q-toggle>
      </div>
      <!--   终止gpt回答   -->
      <ToolWidget v-show="ctx.ui.replying">
        <div class="row">
          <div class="full-height column justify-center">
            <q-spinner-comment
                color="primary"
                size="md"
            />
            <q-tooltip :offset="[0, 0]">回复中</q-tooltip>
          </div>
          <div>
            <q-btn dense flat icon="jimu-daochu1024-16" color="red" @click="stopReplying"/>
          </div>
        </div>
      </ToolWidget>

      <ToolWidget>
        <q-icon size="20px" class="edit-tool-option" name="jimu-shijian-2"
                >
        </q-icon>
      </ToolWidget>
      <ToolWidget style="margin-right: 5px">
        <q-icon size="20px" class="edit-tool-option" :name="isMax?'jimu-zuixiaohua':'jimu-zuidahua'"
                @click.stop="max">
        </q-icon>
      </ToolWidget>
    </div>
    <div class="edit-box">
      <Editor
          ref="editRef"
          v-model:characters="characters"
          :shame="shame"
          @input="input"
          @send="sendAction"
      />
    </div>
    <div class="send-box row reverse">
      <div class="column justify-center">
        <q-btn-dropdown  :ripple="false" split no-caps align="left" dense color="primary" label="发 送 "
                        icon="jimu-send"
                        @click="sendMessage"
                         :disable="ctx.ui.replying || ctx.ui.sendDisable"
                        dropdown-icon="jimu-xiangxia-2"
                        style="height:30px;width: 109px;margin-right: 10px"
                        content-class="send-box-dropdown">

        <q-list dense>
            <menu-item text="Enter" @click="shape='Enter'">
              <template #option>
                <q-radio dense v-model="shape" val="Enter"/>
              </template>
            </menu-item>
            <menu-item text="Ctrl+Enter" @click="shape='Ctrl+Enter'">
              <template #option>
                <q-radio dense v-model="shape" val="Ctrl+Enter"/>
              </template>
            </menu-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {colors} from "quasar";
import Editor from "./Editor.vue";
import {IsEmpty} from "@/components/system-components/utils/systemutils";
import {ChatMessageEntity, MessageType} from "@/components/tool-components/chatGptTool/model/chat";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import ClearHistory from "@/components/tool-components/chatGptTool/chat/editor-tool-bar/clear-history/ClearHistory.vue";
import ToolWidget from "@/components/tool-components/chatGptTool/chat/editor/tool/ToolWidget.vue";
import ChatPlugin from "@/components/tool-components/chatGptTool/chat/editor-tool-bar/plugins/ChatPlugin.vue";



const {getPaletteColor} = colors

const props = defineProps({
  // ats 属性传递给底层 CKEditor 编辑器 用于提示 @用户的列表
  ats: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits({
  // 发送消息事件 通知外部 ChatEditor 编辑器 需要发送消息
  send: (messages: ChatMessageEntity[]) => {
  },
  // 最大化编辑器事件 需要动态调整布局高度
  MaxEditor: () => {
  },
})

const text = ref('')

// shape 默认 回车按键发送消息
const shape = ref()
const editRef = ref()
const characters = ref(0)
const shame = ref(false)
const ctx = useGptStore()
const isMax = ref(false)
if (!ctx.ui.send) {
  shape.value = 'Enter'
} else {
  shape.value = 'Ctrl+Enter'
}

function stopReplying() {
  if (ctx.ui.currentStream) {
    ctx.ui.currentStream.Stop()
    ctx.ui.stop = true
  }
}

function max(event) {
  emits('MaxEditor')
}

/*
* description: 编辑器输入事件
* */
function input(data: string) {
  let current = ctx.CurrentChat.Current
  // 更新当前的聊天会话消息编辑草稿
  if (!IsEmpty(current)) {
    ctx.chat_editor_content[current.Conversation.id] = data
  }
}

/*
* @description 选择表情
* */
function selectE(data: any) {
  editRef.value.insert({
    contentType: MessageType.TextMessage,
    data: data
  })
}

function sendMessage() {
  let msg = editRef.value.Message()
  emits("send", msg)
  editRef.value.Clear()
  let current = ctx.CurrentChat.Current
  ctx.chat_editor_content[current.Conversation.id] = ''
}

/*
* @description 编辑器触发快捷发送消息动作
* */
function sendAction(data: ChatMessageEntity[]) {
  emits("send", data)
  editRef.value.Clear()
  let current = ctx.CurrentChat.Current
  ctx.chat_editor_content[current.Conversation.id] = ''
}


watch(() => shape.value, (value) => {
  if (value === 'Ctrl+Enter') {
    ctx.ui.send = true
  } else {
    ctx.ui.send = false
  }
})

onMounted(() => {
})

</script>


<style scoped>

.edit {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.edit-tool {
  margin-top: 2px;
}

.edit-box {
  width: 100%;
  flex-grow: 1;
  overflow: auto;
}

.send-box {
  width: 100%;
  min-height: 40px !important;
}

.edit-tool-option {
  margin-left: 10px;
}

.edit-tool-option:hover {
  color: v-bind('getPaletteColor("primary")');
}



</style>

<style>
.q-menu--dark {
  box-shadow: none;
}
.send-box-dropdown {
  border-radius: 0;
}
</style>