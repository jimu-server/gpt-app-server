<template>
  <q-dialog
      v-model="model"
      id="create"
  >
    <q-card

    >
      <div class="fit column justify-between">
        <div class="full-width row justify-center" style="flex-grow: 1;padding: 5px">
          <el-form style="margin-top: 20px">
            <el-form-item>
              <el-input
                  v-model="name"
                  placeholder="名称"
                  style="width: 300px;"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="full-width row reverse">
          <div style="margin-bottom: 5px;margin-right: 5px">
            <el-button type="primary" @click="submit">创建</el-button>
            <el-button @click="model=false">取消</el-button>
          </div>
        </div>
      </div>
    </q-card>

  </q-dialog>
</template>
<script setup lang="ts">


import {ref, watch} from "vue";
import {ElMessage} from "element-plus";
import {genKnowledge} from "@/components/tool-components/chatGptTool/chatRequest";

const model = defineModel({default: false, required: true})
const props = defineProps<{
  title: string,
}>()


const emits = defineEmits({
  close: function () {

  },
  success: function (name: string) {

  }
})
const name = ref('')

async function submit() {
  let htmlElement = document.getElementById('create');
  if (name.value == '') {
    ElMessage(
        {
          message: '请输入名称',
          type: 'warning',
          plain: true,
          grouping: true,
          appendTo: htmlElement,
        }
    )
    return
  }
  // 打开生成进度信息
  model.value = false
  emits('success', name.value)
}


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