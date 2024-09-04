<template>
  <div class="fit column" style="overflow: hidden">
    <!-- 用户头像及其在线状态 -->
    <q-toolbar
        style="height: 40px;width: 100%;border-bottom: rgba(140,147,157,0.34) 1px solid;padding: 0;-webkit-app-region: drag;">
      <div class="row" style="margin-left: 10px;height: 100%;-webkit-app-region: no-drag">
        <div class="column justify-center" style="margin-left: 5px">
          <div class="row">
            <div style="margin-left: 5px;margin-right:10px;user-select: none;">
              {{ ctx.CurrentChat.Current.Conversation.title }}
            </div>
          </div>
        </div>
      </div>
      <q-space/>
      <HeaderToolBar/>
      <WindowBtnGroup/>
    </q-toolbar>
    <div ref="messageList" class="column relative-position" style="flex-grow:1;overflow-x: hidden;">
      <q-scroll-area
          ref="scrollAreaRef"
          id="messageScrollArea"
          class="fit"
          :visible="false"
          @scroll="scroll"
          style="overflow-x: hidden;">
        <!--        &lt;!&ndash; 更具实际布局对照,消息大于多少条时切换到 &ndash;&gt;
                <q-infinite-scroll v-if="ctx.CurrentChat.messageList.length>10" :visible="false" :offset="0" reverse
                                   style="width: 100%"
                                   @load="loadMessage">
                  <q-intersection
                  >
                    <template v-for="(item,index) in ctx.CurrentChat.messageList">
                      <chat-message :message="item" :index="index"/>
                    </template>
                  </q-intersection>
                  &lt;!&ndash;          <template v-for="(item,index) in ctx.CurrentChat.messageList">
                              <chat-message :message="item" :index="index"/>
                            </template>&ndash;&gt;
                  <template v-slot:loading>
                    <div class="row justify-center q-my-md">
                      <q-spinner-ios color="primary" size="20px"/>
                    </div>
                  </template>
                </q-infinite-scroll>
                &lt;!&ndash; 不显示滚动加载消息操作 &ndash;&gt;
                <div v-else>
                  <template v-for="(item,index) in ctx.CurrentChat.messageList">
                    <chat-message :message="item" :index="index"/>
                  </template>
                </div>-->
        <!--        <q-virtual-scroll
                    scroll-target="#messageScrollArea > .scroll"
                    :items="ctx.CurrentChat.messageList"
                    v-slot="{ item, index }"
                >
                  <chat-message :message="item" :index="index"/>
                </q-virtual-scroll>-->
        <template v-for="(item,index) in ctx.CurrentChat.messageList">
          <chat-message :message="item" :index="index"/>
        </template>
      </q-scroll-area>
      <q-btn
          v-show="showBackBottom"
          class="absolute-bottom-right"
          rounded color="primary"
          flat
          dense
          icon="jimu-a-ziyuan207"
          @click="move_scroll_bottom"
          style="margin-right: 7px;margin-bottom: 5px"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import {computed, onUnmounted, ref, watch} from "vue";
import emitter from "@/plugins/event";
import {MessageObserver, ScrollMove, ScrollToBottom, SendActionScroll, TypewriterScrollMove} from "@/plugins/evenKey";
import {useThemeStore} from "@/components/system-components/store/theme";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {updateTheme} from "@/components/tool-components/chatGptTool/style/update";
import ChatMessage from "@/components/tool-components/chatGptTool/chat/message/ChatMessage.vue";
import MessageHeaderBar from "@/components/tool-components/chatGptTool/chat/message/MessageHeaderBar.vue";
import HeaderToolBar from "@/components/system-components/desktop/HeaderToolBar.vue";
import WindowBtnGroup from "@/components/system-components/desktop/WindowBtnGroup.vue";

const scrollAreaRef = ref()
const ctx = useGptStore()
const previousScrollTop = ref(0)
const messageList = ref()
// 记录滚动方向 true:向下,false:向上
const scrollDirection = ref(true)
defineExpose({
  MoveScrollBottom,
})


const showBackBottom = computed(() => {
  if (scrollAreaRef.value) {
    let percentage = scrollAreaRef.value.getScrollPercentage();
    if (percentage.top < 0.7 && scrollDirection.value) {
      return true;
    }
  }
  return false
})

function scroll(value) {
  if (scrollAreaRef.value) {
    const scrollTarget = scrollAreaRef.value.getScrollTarget()
    // 获取当前滚动条位置
    const currentScrollTop = scrollTarget.scrollTop
    if (currentScrollTop > previousScrollTop.value) {
      console.log('Scrolling down')
      scrollDirection.value = true
    } else {
      console.log('Scrolling up')
      scrollDirection.value = false
    }
    previousScrollTop.value = currentScrollTop
  }
}

/*
* @description: 移动滚动条到最底部
* */
function MoveScrollBottom() {
  move_scroll_bottom()
}

function move_scroll_bottom() {
  setTimeout(() => {
    if (ctx.ui.showChat && scrollAreaRef.value) {
      let scrollTarget = scrollAreaRef.value.getScrollTarget()
      let height = scrollTarget.scrollHeight
      scrollAreaRef.value.setScrollPosition('vertical', height)
    }
  }, 200)
}


function typewriter_move_scroll() {
  if (scrollAreaRef.value) {
    let percentage = scrollAreaRef.value.getScrollPercentage();
    if (percentage.top <= 1) {
      let scrollTarget = scrollAreaRef.value.getScrollTarget()
      let height = scrollTarget.scrollHeight
      scrollAreaRef.value.setScrollPosition('vertical', height)
    }
  }
}


/*
* @description: 接收消息触发消息滚动
* */
function MoveScroll() {
  if (ctx.ui.showChat) {
    setTimeout(() => {
      // 获取当前滚动条所处位置的比例
      let percentage = scrollAreaRef.value.getScrollPercentage();
      if (percentage.top > 0.6) {
        let scrollTarget = scrollAreaRef.value.getScrollTarget()
        let height = scrollTarget.scrollHeight
        scrollAreaRef.value.setScrollPosition('vertical', height)
      }
    }, 200)
  }
}

/*
* @description 发送消息触发 消息面板消息滚动
* */
function SendActionMoveScroll() {
  // 必须延迟跟新,否则 api 无法感知到 ui 高度变化
  setTimeout(() => {
    let scrollTarget = scrollAreaRef.value.getScrollTarget()
    let height = scrollTarget.scrollHeight
    scrollAreaRef.value.setScrollPosition('vertical', height)
  }, 100)
}

let options = {
  root: document.getElementById("messageScrollArea"),
};
let observer = null

function beginObserver() {
  // 当前消息数量 小于50条数据不需要进行优化,不执行元素观察优化
  /*  if (ctx.CurrentChat.messageList.length < 50) {
      return
    }*/

  // 创建元素观察器
  if (observer != null) {
    observer.disconnect()
  }
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      let perId = ((entry.target.previousSibling) as HTMLElement).id
      let id = entry.target.id
      let nextId = ((entry.target.nextSibling) as HTMLElement).id
      if (entry.isIntersecting) {
        // 显示当前节点
        if (id && !ctx.view.includes(id)) {
          ctx.view.push(id)
        }
        // 根据滚动条的方向来判断是向下滚动还是向上滚动,分别处理应该加载的数据
        if (scrollDirection.value) {
          // 向下滚动,提前显示下一个节点
          if (entry.target.nextSibling) {
            if (nextId && !ctx.view.includes(nextId)) {
              ctx.view.push(nextId)
            }
          }
        } else {
          // 提前显示上一个节点
          if (entry.target.previousSibling) {
            if (perId && !ctx.view.includes(perId)) {
              ctx.view.push(perId)
            }
          }
        }
      } else {
        /*        if (id && !ctx.view.includes(id)) {
                  let index = ctx.view.findIndex(item => {
                    return item === id
                  });
                  if (index != -1) {
                    ctx.view.splice(index, 1);
                  }
                }*/

        setTimeout(() => {
          if (scrollDirection.value) {
            if (entry.target.previousSibling) {
              let index = ctx.view.findIndex(item => {
                return item === perId
              });
              if (index != -1) {
                ctx.view.splice(index, 1);
              }
            }
          } else {
            if (entry.target.nextSibling) {
              let index = ctx.view.findIndex(item => {
                return item === nextId
              });
              if (index != -1) {
                ctx.view.splice(index, 1);
              }
            }
          }
        }, 300)

      }
    });
  }, options);

  let elements = document.querySelectorAll('.message-entity');
  elements.forEach(element => {
    observer.observe(element)
  })
}

const theme = useThemeStore()
setTimeout(() => {
  updateTheme(theme.dark)
}, 500)
watch(() => theme.dark, (value) => {
  updateTheme(value)
})

emitter.on(MessageObserver, beginObserver)
emitter.on(ScrollMove, MoveScroll)
emitter.on(SendActionScroll, SendActionMoveScroll)
emitter.on(TypewriterScrollMove, typewriter_move_scroll)
emitter.on(ScrollToBottom, MoveScrollBottom)
onUnmounted(() => {
  emitter.off(ScrollMove, MoveScroll)
  emitter.off(SendActionScroll, SendActionMoveScroll)
  emitter.off(TypewriterScrollMove, typewriter_move_scroll)
})


</script>

<style scoped>

</style>