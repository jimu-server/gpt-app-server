<template>
  <el-dialog
      v-model="model"
      :title="title"
      draggable
      width="400"
  >
    <div class="fit column justify-between">
      <div class="full-width row justify-center" style="flex-grow: 1;padding: 5px">
        <el-form>
          <el-form-item label="上级组织">
            <el-input
                v-model="org.name"
                size="large"
                style="width: 300px;margin-left: 10px"
                disabled
            />
          </el-form-item>
          <el-form-item label="组织名称">
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
import {Org} from "@/components/system-components/model/system";
import {CreateOrg} from "@/components/system-tool/manageTool/manageRequest";
import {ElMessage} from "element-plus";

const props = defineProps<{
  title: string
  org: Org
}>()

const emits = defineEmits({
  close: function () {

  }
})
const name = ref('')
async function submit() {
  if (name.value == '') {
    ElMessage(
        {
          message: '请输入组织名称',
          type: 'warning'
        }
    )
    return
  }
  let result = await CreateOrg(props.org.id, name.value)
  if (result.code == 200) {
    ElMessage(
        {
          message: '创建成功',
          type: 'success'
        }
    )
    emits('close')
    model.value = false
  }
}
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