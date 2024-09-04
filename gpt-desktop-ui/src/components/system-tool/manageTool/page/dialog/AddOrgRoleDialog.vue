<template>
  <el-dialog
      v-model="model"
      :title="title"
      width="400"
      draggable
  >
    <div class="fit column">
      <div class="full-width row justify-center" style="flex-grow: 1;padding: 5px;margin-top: 5px">
        <el-form label-width="auto" label-position="left">
          <el-form-item label="角色">
            <el-input v-model="name"
                      size="large"
                      style="width: 300px;margin-left: 10px"
            />
          </el-form-item>
          <el-form-item label="键">
            <el-input v-model="key"
                      size="large"
                      style="width: 300px;margin-left: 10px"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="create">创建</el-button>
      <el-button @click="model=false">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">


import {ref, watch} from "vue";
import {ElMessage} from "element-plus";
import {createOrgRole} from "@/components/system-tool/manageTool/manageRequest";
import {loadUserInfo} from "@/components/system-components/utils/userutil";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  orgId: {
    type: String,
    required: true,
  }
})

const emits = defineEmits({
  close: function () {

  }
})

const name = ref("")
const key = ref("")


async function create() {
  if (name.value === "" || key.value === "") {
    ElMessage({
      message: "角色名和键不能为空",
      type: "warning",
      plain: true,
      grouping: true
    })
    return
  }
  let result = await createOrgRole(props.orgId, name.value, key.value)
  if (result.code === 200) {
    ElMessage({
      message: "创建成功",
      type: "success",
      plain: true,
      grouping: true
    })
    await loadUserInfo()
    model.value = false
    emits('close')
  }
}

const addOrgCardRef = ref()
const tempX = ref(0)
const tempY = ref(0)
const model = defineModel({default: false, required: true})

const handleDrag = (event) => {
  addOrgCardRef.value.$el.style.transform = `translate(${tempX.value + event.offset.x}px, ${tempY.value + event.offset.y}px)`;
  if (event.isFinal) {
    tempX.value += event.offset.x
    tempY.value += event.offset.y
  }
}

function destroy() {
  name.value = ''
  key.value = ''
}

function init() {

}

function close() {
  tempX.value = 0;
  tempY.value = 0;
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