<template>
  <div class="full-width">
    <div v-if="info.content!=''" ref="typingBox" class="full-width" style="position: relative;min-height: 40px">
      <div ref="typing" class="markdown-message gpt-message" :theme="theme.dark?'dark':''" v-html="info.content"
           v-height="height"></div>
      <div ref="cursor" v-show="showCursor" :theme="theme.dark?'dark':''" class="typing-cursor"></div>
    </div>
    <div v-else>
      <q-skeleton animation="wave" style="min-width: 100px;height: 40px"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {AppChatMessageItem} from "@/components/tool-components/chatGptTool/model/model";
import {onMounted, onUpdated, reactive, ref} from "vue";
import {Stream} from "@/components/system-components/stream/stream";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {useThemeStore} from "@/components/system-components/store/theme";
import {getMessage} from "@/components/tool-components/chatGptTool/chatRequest";
import {updateTheme} from "@/components/tool-components/chatGptTool/style/update";
import md from "@/components/tool-components/chatGptTool/chat/gptMarkDownMessagePreview";
import emitter from "@/plugins/event";
import {SendActionScroll, TypewriterScrollMove} from "@/plugins/evenKey";

const props = defineProps<{
  // 消息
  message: AppChatMessageItem,
  index: number
}>()

const emit = defineEmits({
  // 打字容器高度变化事件,主要用于通知上层元素,对消息的折叠判断
  heightChange: function (value) {
  }
})

const typingBox = ref<HTMLElement>()
const typing = ref<HTMLElement>()
const cursor = ref<HTMLElement>()
// 是否显示打字光标
const showCursor = ref(false)
// 打字机 光标显示位置
const pos = reactive({
  x: 0,
  y: 0,
})
const stream = ref<Stream>()

const ctx = useGptStore()
const theme = useThemeStore()

// 渲染消息文本存储
const info = ref({...props.message!})
// 初始化默认渲染数据
info.value.content = md.render(info.value.content)
// 存储流消息拼接文本
const content = ref('')

// 标识当前消息是否是用户发送的
const send = ref(false)

// 获取消息发送标识,处理发送消息内容方向
send.value = props.message.role === 'user'

// 自定义指令监听dvi的高度变化
const vHeight = {
  updated(el, binding, vnode, prevVnode) {
    if (typeof binding.value === 'function') {
      binding.value(el.clientHeight);
    }
  },
}

function height(value: number) {
  emit('heightChange', value)
}

function beginTyping() {
  // 非用户身份 使用 stream 加载流消息
  setTimeout(async () => {
    if (!send.value && info.value.content === "") {
      ctx.ui.replying = true
      showCursor.value = true
      const response = info.value.stream;
      stream.value = new Stream(response)
      ctx.ui.currentStream = stream.value
      stream.value.setHandler((data, status) => {
        if (data.message.content) {
          // 保存原始消息
          content.value += data.message.content
          // 渲染 md 消息进行展示
          info.value.content = md.render(content.value);
          // 发送滚动条滚动指令
          emitter.emit(TypewriterScrollMove)
        }
      })
      stream.value.setComplete((data, status) => {
        console.log("stream complete")
        setTimeout(async () => {
          await updateSelfMessage()
          end()
        }, 200)
      })
      stream.value.setEnd((data, status) => {
        console.log("stream end")
        setTimeout(async () => {
          await updateSelfMessage()
          end()
        }, 200)
      })
      await stream.value.listen()
    }
  }, 300);
}


function end() {
  // 关闭正在回复状态
  ctx.ui.replying = false
  // 打字结束取消光标展示
  showCursor.value = false
  // 重置取消回复标识
  ctx.ui.stop = false
  ctx.ui.currentStream = null
  console.log("Refresh status")
}

async function updateSelfMessage() {
  let message = await getMessage(props.message.id);
  ctx.UpdateConversationLastMsg(props.message.conversationID, message)
  ctx.CurrentChat.messageList[props.index] = message
}

/*
* @description: 找到打字容器最后一个字符位置
* */
function getLastTextNode(dom: HTMLElement) {
  if (dom.childNodes.length === 0) {
    return null;
  }
  if (dom.childNodes.length === 1) {
    return dom.childNodes[0];
  }
  for (let i = dom.childNodes.length - 1; i >= 0; i--) {
    let node = dom.childNodes[i];
    if (node.nodeType === Node.TEXT_NODE && /\S/.test(node.nodeValue)) {
      node.nodeValue = node.nodeValue.replace(/\s+$/, '')
      return node;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      let last = getLastTextNode(node as HTMLElement);
      if (last) {
        return last;
      }
    }
  }
  return null;
}

/*
* @description: 计算打字容器光标显示位置
* */
function updateCursor() {
  let el = typing.value
  if (!el) {
    return
  }
  let lastTextNode = getLastTextNode(typing.value);
  // 创建一个不可显示字符
  let textNode = document.createTextNode("\u200b")
  // 根据最后一个节点的情况 把字符添加到容器或者最后一个节点上 用于占位
  if (lastTextNode) {
    lastTextNode.parentElement.appendChild(textNode)
  } else {
    typing.value.appendChild(textNode)
  }
  // 计算占位的距离
  const domRect = typing.value.getBoundingClientRect()
  let range = document.createRange()
  range.setStart(textNode, 0)
  range.setEnd(textNode, 0)
  let rect = range.getBoundingClientRect()
  // 更新光标位置到占位符号
  pos.x = rect.left - domRect.left
  pos.y = rect.top - domRect.top
  // 移除占位符号
  textNode.remove()
}

/*
* @description: 如果消息是gpt消息则加载周期事件
* */
if (!send.value) {
  onMounted(() => {
    updateCursor()
    beginTyping()
  })
  onUpdated(updateCursor)
}

if (theme.dark) {
  updateTheme(theme.dark)
}

</script>


<style scoped>
.typing-cursor[theme="dark"] {
  background: #fff !important;
}

.typing-cursor {
  content: '';
  position: absolute;
  width: 10px;
  height: 18px;
  background: black;
  animation: toggle 0.5s linear infinite;
  opacity: 0;
  left: calc(v-bind('pos.x') * 1px);
  top: calc(v-bind('pos.y') * 1px);
}

@keyframes toggle {
  30% {
    opacity: 1;
  }
}
</style>