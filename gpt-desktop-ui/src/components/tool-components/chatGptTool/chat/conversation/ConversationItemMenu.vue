<template>
  <q-menu
      context-menu
  >
    <q-list dense>
      <menu-item dense v-for="(item,index) in list" @click="item.action(ConversationItem)" :icon="item.icon" :text="item.name"/>
    </q-list>
  </q-menu>
</template>
<script setup lang="ts">
import MenuItem from "@/components/system-components/widget/MenuItem.vue";
import {ActionMenu} from "@/components/system-components/model/system";
import {AppChatConversationItem} from "@/components/tool-components/chatGptTool/model/model";

const props = defineProps<{
  list: ActionMenu[],
  ConversationItem: AppChatConversationItem
}>()

</script>


<style scoped>

</style>