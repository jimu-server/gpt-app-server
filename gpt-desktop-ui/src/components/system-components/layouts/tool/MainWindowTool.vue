<template>
  <div :class="position==ToolLayout.Left?layout_l:layout_r">
    <ToolSidebar>
      <div class="fit column">
        <ConversationUi/>
      </div>
    </ToolSidebar>
    <template v-if="toolShow">
      <ToolSidebarView :id="position" :toolCtx="toolCtx" :position="position" style="-webkit-app-region: no-drag;"/>
      <!--  在工具窗口打开时才可以拖拽宽度  -->
      <Slide :class="position==ToolLayout.Left?slide_line_l:slide_line_r" @widthChange="widthChange"
             style="-webkit-app-region: no-drag;"/>
    </template>
  </div>
</template>

<script setup lang="ts">

import ToolSidebarView from "@/components/system-components/layouts/tool/ToolSidebarView.vue";
import ToolSidebar from "@/components/system-components/layouts/tool/ToolSidebar.vue";
import {computed, onMounted, ref, watch} from "vue";
import {useToolStore} from "@/components/system-components/store/tool";
import {userStore} from "@/components/system-components/store/user";
import {Tool} from "@/components/system-components/model/system";
import {ToolLayout} from "@/components/system-components/model/enum";
import MessagePanel from "@/components/tool-components/chatGptTool/chat/message/MessagePanel.vue";
import SearchInput from "@/components/tool-components/chatGptTool/widget/SearchInput.vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {ConversationEntity} from "@/components/tool-components/chatGptTool/model/chat";
import {IsEmpty} from "@/components/tool-components/chatGptTool/chat/chatutils";
import {ElMessage} from "element-plus";
import ConversationUi from "@/components/tool-components/chatGptTool/conversation-ui/ConversationUi.vue";

const tool = useToolStore()
const user = userStore()


const props = defineProps<{
  toolCtx: Tool,
  position: number
}>()

const toolShow = computed(() => {
  switch (props.position) {
    case ToolLayout.Left:
      return tool.left.isOpen
    case ToolLayout.Right:
      return tool.right.isOpen
    default:
      return false
  }
})


let widthChange = null
//'tool fit bg-transparent row justify-lg-between'
let layout_l = ref(['fit', 'bg-transparent', 'row', 'justify-lg-between', 'tool', 'l_tool'])
let layout_r = ref(['fit', 'bg-transparent', 'row', 'justify-lg-between', 'reverse', 'tool', 'r_tool'])

// 处理侧边栏拖拽线的布局
let slide_line_l = ref(['drag', 'absolute-right']) // 左边
let slide_line_r = ref(['drag', 'absolute-left']) // 右边

// 处理侧边栏按钮的布局
let slide_btn_l = ref(['absolute-left'])
let slide_btn_r = ref(['absolute-right'])


const ctx = useGptStore()


function search(value: string) {
  ctx.ui.search = value
}

function selectChat(data: ConversationEntity, index: number) {
  if (!IsEmpty(ctx.CurrentChat.Current) && ctx.CurrentChat.Current.Conversation.id === data.Conversation.id) {
    return;
  }
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
}


switch (props.position) {
  case 1:
    widthChange = leftWidthChange
    break
  case 2:
    widthChange = rightWidthChange
    break
}


function leftWidthChange(movement) {
  let w = document.documentElement.clientWidth / 3
  if (movement < 0 && tool.left.width >= w) {
    return;
  }
  if (movement > 0 && tool.left.width <= tool.baseWidth) {
    return
  }
  tool.left.width -= movement;
}

// 设置分割线拖动修改窗口宽度
function rightWidthChange(movement) {
  let w = document.documentElement.clientWidth / 3

  if (movement > 0 && tool.right.width >= w) {
    return;
  }
  if (movement < 0 && tool.right.width <= tool.baseWidth) {
    return
  }
  tool.right.width += movement;
}


function check(value: Tool): boolean {
  console.log(value)
  if (!value) return false
  return value.position == props.position
}

onMounted(async () => {

})

// 处理拖拽线 卡顿,拖动过快大小超出预设值 重置 侧边栏的宽度
watch(() => tool.left.width, (value) => {
  if (value <= 56) {
    tool.left.width = 56
  }
})
// 处理拖拽线 卡顿,拖动过快大小超出预设值 重置 侧边栏的宽度
watch(() => tool.right.width, (value) => {
  if (value <= 56) {
    tool.right.width = 56
  }
})

</script>


<style scoped>
.tool {
  justify-content: space-between;
  padding-top: 2px;
  padding-bottom: 2px;
  overflow: hidden;
}

</style>