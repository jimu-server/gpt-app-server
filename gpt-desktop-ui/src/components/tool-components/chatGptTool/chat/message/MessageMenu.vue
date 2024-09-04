<!--
  消息操作菜单
-->
<template>
  <q-menu
      context-menu
  >
    <q-list dense>
      <q-item dense v-for="(item,index) in list" clickable v-close-popup @click="item.action"
              style="padding: 0"
      >
        <menu-item :icon="item.icon" :text="item.name"/>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup lang="ts">

import {ref} from "vue";

import {MessageRef} from "@/plugins/evenKey";


import emitter from "@/plugins/event";
import MenuItem from "@/components/system-components/widget/MenuItem.vue";
import {MessageItem} from "@/components/tool-components/chatGptTool/model/chat";


const props = defineProps<{ message?: MessageItem }
>()


const list = ref([
  {
    name: "复制",
    icon: "content_copy",
    action: () => {

    }
  },
  {
    name: "引用",
    icon: "online-huifu",
    action: () => {
      emitter.emit(MessageRef, props.message)
    }
  },
  {
    name: "撤回",
    icon: "online-chehui",
    action: () => {

    }
  },
  {
    name: "删除",
    icon: "online-shanchu",
    action: () => {

    }
  }
])


</script>


<style scoped>

</style>