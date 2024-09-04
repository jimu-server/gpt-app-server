<template>
  <!--  <OllamaModelSelect/>-->
  <q-btn dense flat icon="jimu-caidan1" style="-webkit-app-region: no-drag">
    <q-menu
        anchor="bottom end" self="top right"
        fit
        transition-show="scale"
        transition-hide="scale"
        :offset="[13,0]"
    >
      <q-list dense>
        <menu-item icon="jimu-Model" text="我的模型" @click="userModelManageFlag=true"/>
        <menu-item icon="jimu-wenjianjia1" text="创建知识库" @click="fileManageFlag=true"/>
        <menu-item icon="jimu-shezhi-2" text="GPT设置" @click="settingFlag=true"/>
      </q-list>
    </q-menu>
  </q-btn>
  <q-btn dense flat icon="jimu-yunxiazai_o" style="-webkit-app-region: no-drag">
    <q-badge v-show="ctx.ui.downloadModelList.length>0" rounded color="red" :label="ctx.ui.downloadModelList.length"
             floating transparent/>
    <q-menu>
      <DownloadPanel/>
    </q-menu>
  </q-btn>
  <GenKnowledgeFileSelectDialog v-model="fileManageFlag"/>
  <UserModelManage v-model="userModelManageFlag"/>
  <SettingDialog v-model="settingFlag"/>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import UserModelManage
  from "@/components/tool-components/chatGptTool/chat/message-tool-bar/ollama-model-manage/UserModelManage.vue";
import GenKnowledgeFileSelectDialog
  from "@/components/tool-components/chatGptTool/chat/message-tool-bar/knowledge-manage/GenKnowledgeFileSelectDialog.vue";
import DownloadPanel from "@/components/tool-components/chatGptTool/chat/message-tool-bar/download/DownloadPanel.vue";
import MenuItem from "@/components/system-components/widget/MenuItem.vue";
import SettingDialog from "@/components/system-components/setting/SettingDialog.vue";


const fileManageFlag = ref(false)
const userModelManageFlag = ref(false)
const settingFlag = ref(false)
const ctx = useGptStore()
</script>


<style scoped>

</style>