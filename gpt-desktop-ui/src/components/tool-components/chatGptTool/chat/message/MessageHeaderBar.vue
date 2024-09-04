<template>

</template>

<script setup lang="ts">

import MenuItem from "@/components/system-components/widget/MenuItem.vue";
import {ref} from "vue";
import KnowledgeFileManage from "@/components/tool-components/chatGptTool/widget/knowledge/KnowledgeFileManage.vue";
import UserModelManage
  from "@/components/tool-components/chatGptTool/chat/message-tool-bar/ollama-model-manage/UserModelManage.vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import SystemFileSelectDialog from "@/components/system-components/system-file-manage/SystemFileSelectDialog.vue";
import GenKnowledgeFileSelectDialog
  from "@/components/tool-components/chatGptTool/chat/message-tool-bar/knowledge-manage/GenKnowledgeFileSelectDialog.vue";
import DownloadPanel from "@/components/tool-components/chatGptTool/chat/message-tool-bar/download/DownloadPanel.vue";
import WindowThemeBtn from "@/components/system-components/desktop/WindowThemeBtn.vue";
import WindowMinimizeBtn from "@/components/system-components/desktop/WindowMinimizeBtn.vue";
import WindowCloseBtn2 from "@/components/system-components/desktop/WindowCloseBtn2.vue";
import WindowToggleBtn from "@/components/system-components/desktop/WindowToggleBtn.vue";

const fileManageFlag = ref(false)
const userModelManageFlag = ref(false)
const ctx = useGptStore()

</script>


<style scoped>

</style>