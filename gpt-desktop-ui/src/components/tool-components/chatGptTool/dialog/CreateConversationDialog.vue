<template>
  <el-dialog
      v-model="model"
      :title="title"
      draggable
      append-to-body
      width="400"
  >
    <div class="fit column justify-between">
      <div class="full-width row justify-center" style="flex-grow: 1;padding: 5px">
        <el-form>
          <el-form-item label="会话名">
            <el-input
                v-model="name"
                size="large"
                style="width: 300px;margin-left: 10px"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="submit">创建</el-button>
      <el-button @click="model=false">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">


import {ref, watch} from "vue";
import {ElMessage} from "element-plus";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {createConversation} from "@/components/tool-components/chatGptTool/chatRequest";


const props = defineProps<{
  title: string
}>()

const emits = defineEmits({
  success: function (id) {

  }
})

const name = ref('')
const ctx = useGptStore()

async function submit() {
  if (name.value == '') {
    ElMessage(
        {
          message: '请输入会话名称',
          type: 'warning'
        }
    )
    return
  }
  let result = await createConversation(name.value)
  if (result.code == 200) {
    emits('success', result.data)
    model.value = false
  }
}

const CardRef = ref()

const model = defineModel({default: false, required: true})

function destroy() {
  name.value = ''
}

function init() {

}

function close() {
  destroy()
}


watch(model, (newVal) => {
  if (newVal === false) {
    close()
  } else {
    init()
  }
})

</script>
<style scoped>

</style>