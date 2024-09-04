<template>
  <transition enter-active-class="animate__animated animate__bounceIn">
    <WindowScrollX style="height: 30px;padding-top: 4px">
      <div class="fit row">
        <draggable class="row" :list="labels.windowLabels" :force-fallback="true"
                   animation="300"
                   style="flex-wrap: nowrap"
        >
          <template #item="ctx">
            <div class="full-height column reverse">
              <WindowTag
                  :key="ctx.index"
                  :win="ctx.element"
                  :index="ctx.index"
                  @contextmenu="OpenContextmenu(ctx.index)"/>
              <q-menu context-menu fit>
                <q-list dense>
                  <menu-item icon="jimu-guanbi-2" text="关闭" @click="labels.closeLabel"/>
                  <menu-item text="关闭其他" @click="labels.closeOther"/>
                  <menu-item text="关闭所有" @click="labels.closeAll"/>
                </q-list>
              </q-menu>
            </div>
          </template>
        </draggable>
      </div>
    </WindowScrollX>
  </transition>
</template>

<script setup lang="ts">
import WindowTag from "./WindowTag.vue";
import {onMounted, onUnmounted} from "vue";
import {useWindowsStore} from "@/components/system-components/store/windows";
import draggable from 'vuedraggable'
import MenuItem from "@/components/system-components/widget/MenuItem.vue";
import emitter from "@/plugins/event";
import {UpdateAuthEvent, UpdateAuthWindowEvent} from "@/plugins/evenKey";
import {useAuthStore} from "@/components/system-components/store/auth";
import WindowScrollX from "@/components/system-components/window/tag/WindowScrollX.vue";


const labels = useWindowsStore()
const auth = useAuthStore()

/*
  @description 右键菜单跟新当前操作窗口标签的 索引已处理后面的逻辑操作
*/
function OpenContextmenu(index: number) {
  labels.UpdateSelect(index)
}
</script>

<style scoped>


/* 使用了拖拽组件化后 windows 失去对原来行排序的约束，需要在draggable 上面加上class 指定行排列*/

</style>