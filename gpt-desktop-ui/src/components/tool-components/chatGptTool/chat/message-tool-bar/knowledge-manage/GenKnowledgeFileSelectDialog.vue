<template>
  <q-dialog
      v-model="model"
      bordered
      persistent
      ret="fileSelect"
  >
    <q-card
        class="system-file-select-dialog"

    >
      <div class="fit column" style="padding: 5px">
        <div class="tool-bt full-width row justify-between">
          <div>
            选择知识库文件
          </div>
          <div>
            <q-btn dense flat class="close-btn" icon="jimu-guanbi" @click="model=false"/>
          </div>
        </div>
        <div style="flex-grow: 1">
          <SystemFileSelect ref="select" :filter="['docx','pdf']"/>
        </div>
        <div class="file-footer row reverse">
          <div class=" column justify-center">
            <el-button type="primary" @click="openCreate">
              生成知识库
            </el-button>
          </div>
        </div>
      </div>
    </q-card>
    <CreateKnowledge v-model="createKnowledgeFlag" title="新建知识库" @success="openGenUI"/>
    <GenKnowledgeUI ref="gen" v-model="genKnowledgeFlag"/>
  </q-dialog>
</template>

<script setup lang="ts">

import {ref, watch} from "vue";
import SystemFileSelect from "@/components/system-components/system-file-manage/SystemFileSelect.vue";
import CreateKnowledge
  from "@/components/tool-components/chatGptTool/chat/message-tool-bar/knowledge-manage/CreateKnowledge.vue";
import {ElMessage} from "element-plus";
import GenKnowledgeUI
  from "@/components/tool-components/chatGptTool/chat/message-tool-bar/knowledge-manage/GenKnowledgeUI.vue";


const model = defineModel({default: false})
const fileSelect = ref()
const select = ref()
const gen = ref()
const genKnowledgeFlag = ref(false)
const createKnowledgeFlag = ref(false)
const files = ref<any[]>([])

async function openCreate() {
  // 获取选中的文件
  files.value =await select.value.getFiles()
  if (files.value.length == 0) {
    ElMessage({
      message: '请选择文件',
      type: 'warning',
      plain: true,
      grouping: true,
      appendTo: fileSelect.value,
    })
    return
  }

  createKnowledgeFlag.value = true
}

function openGenUI(name: string) {
  genKnowledgeFlag.value = true
  gen.value.beginGenFile(name, files.value)
  files.value = []
}


watch(model, async (val) => {
  if (val) {

  }
})


</script>

<style scoped>
.system-file-select-dialog {
  width: 35vw !important;
  height: 50vh !important;
}

.close-btn:hover {
  background-color: red;
  color: white;
}

.file-selector {
  margin-top: 5px;
}

.file-view {
  flex-grow: 1 !important;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}


.file-footer {
  height: 40px;
}
</style>
<style>

</style>