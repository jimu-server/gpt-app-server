<template>
  <div class="file-ui row">
    <q-item class="full-width" style="padding: 0">
      <q-item-section avatar>
        <q-checkbox v-model="checked" @update:model-value="check"/>
      </q-item-section>
      <q-item-section>
        <q-item-label @dblclick="dbClick">
          <div class=" row justify-between">
            <div class="row">
              <div class="file-icon">
                <q-icon :name="icon" size="24px"/>
              </div>
              <div class="file-name">
                {{ info.entity.fileName }}
              </div>
            </div>
          </div>
        </q-item-label>
      </q-item-section>
      <q-item-section avatar class="column justify-center">
        <q-btn flat dense icon="jimu-gengduo_shu-2" style="width: 40px">
          <q-menu>
            <q-item dense style="padding: 0" clickable v-close-popup>
              <menu-item text="删除" icon="jimu-shanchu"/>
            </q-item>
          </q-menu>
        </q-btn>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup lang="ts">
import {AppChatKnowledgeFile, AppChatKnowledgeFileType} from "@/components/tool-components/chatGptTool/model/model";
import {Tree} from "@/components/system-components/model/system";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {ref, watch} from "vue";

const props = defineProps<{
  info: Tree<AppChatKnowledgeFile>
  index: number
}>()

const emit = defineEmits({
  openFile: (file: Tree<AppChatKnowledgeFile>) => {

  },
  selectFile: (file: Tree<AppChatKnowledgeFile>, flag: boolean) => {

  }
})

const ctx = useGptStore()
const icon = ref('jimu-wenjianjia1')
const checked = ref(false)
if (props.info.entity.check) {
  checked.value = props.info.entity.check
}

switch (props.info.entity.fileType) {
  case AppChatKnowledgeFileType.File:
    icon.value = 'img:' + '/public/file-icon/docx1.png'
    break
  case AppChatKnowledgeFileType.Folder:
    icon.value = 'jimu-wenjianjia1'
    break
  default:
    break
}

function dbClick() {
  if (props.info.entity.fileType === AppChatKnowledgeFileType.File) {
    return
  }
  emit('openFile', props.info)
}

function check(value) {
  // 触发修改状态数据的勾选状态
  emit('selectFile', props.info, value)
}

watch(() => props.info.entity.check, (val) => {
  checked.value = val
})

</script>


<style scoped>
.file-ui {
  width: 100%;
  padding-left: 10px;
  border-radius: 5px;
}

.file-icon {
  align-content: center;
}

.file-name {
  height: 100%;
  align-content: center;
  padding-left: 5px;
  user-select: none;
}

.file-ui:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #6aa9f3;
}
</style>