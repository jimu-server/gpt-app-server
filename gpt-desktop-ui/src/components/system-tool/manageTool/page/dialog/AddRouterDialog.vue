<template>
  <el-dialog
      v-model="model"
      :title="title"
      style="width: 400px"
      draggable
  >
    <div class="full-width row justify-center" style="overflow: auto">
      <el-form label-width="auto" label-position="left" size="large" style="width: 90%">
        <el-form-item label="标题">
          <el-input v-model="data.title"/>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="data.icon"/>
        </el-form-item>
        <el-form-item label="路由名">
          <el-input v-model="data.name"/>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="data.path"/>
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="data.component"/>
        </el-form-item>
        <el-form-item label="路由名">
          <el-input v-model="data.remark"/>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button type="primary" @click="create">创建</el-button>
      <el-button @click="model=false">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">


import {ref, watch} from "vue";
import {Router} from "@/components/system-components/model/system";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },

})

const emits = defineEmits({
  close: function () {

  }
})

const name = ref("")
const key = ref("")
const data = ref<Router>({
  component: "",
  createTime: "",
  icon: "",
  id: "",
  name: "",
  path: "",
  pid: "",
  remark: "",
  status: false,
  title: "",
  toolId: ""
});

async function create() {

}

const addToolCardRef = ref()
const tempX = ref(0)
const tempY = ref(0)
const model = defineModel({default: false, required: true})

const handleDrag = (event) => {
  addToolCardRef.value.$el.style.transform = `translate(${tempX.value + event.offset.x}px, ${tempY.value + event.offset.y}px)`;
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