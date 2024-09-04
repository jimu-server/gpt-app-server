<template>
  <el-dialog
      v-model="model"
      :title="title"
      style="width: 400px;"
      draggable
  >
    <div class="row fit justify-center" style="overflow: auto;">
      <el-form
          ref="ruleFormRef"
          label-width="auto"
          label-position="left"
          size="large"
          style="width: 90%;height: 300px"
          :model="data"
          :rules="rules"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="data.name"/>
        </el-form-item>
        <el-form-item label="按钮" prop="btn">
          <el-input v-model="data.btn"/>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <div class="fit row">
            <el-select
                v-model="data.icon"
                placeholder="请选择图标"
                :teleported="false"
                popper-class="iconClass"
            >
              <template #prefix>
                <el-icon>
                  <span :class="'icon iconfont '+data.icon"></span>
                </el-icon>
              </template>
              <el-option
                  v-for="item in icons"
                  :key="item.el_icon"
                  :label="item.name"
                  :value="item.class">
                <div class="fit column justify-center">
                  <div class="row full-width">
                    <div>
                      <el-icon>
                        <span :class="item.el_icon"></span>
                      </el-icon>
                    </div>
                    <el-text truncated style="margin-left: 15px">
                      {{ item.name }}
                    </el-text>
                  </div>
                </div>
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
              v-model="data.type"
              :teleported="false"
          >
            <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="位置" prop="position">
          <el-select
              v-model="data.position"
              :teleported="false"
          >
            <el-option
                v-for="item in positionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <template v-if="data.type==1">
          <el-form-item label="名称" prop="routerName">
            <el-input v-model="data.routerName"/>
          </el-form-item>
          <el-form-item label="路径" prop="path">
            <el-input v-model="data.path"/>
          </el-form-item>
          <el-form-item label="组件" prop="component">
            <el-input v-model="data.component"/>
          </el-form-item>
        </template>
        <el-form-item label="消息" prop="pull">
          <el-input v-model="data.pull"/>
        </el-form-item>
        <el-form-item label="WS" prop="ws">
          <el-input v-model="data.ws"/>
        </el-form-item>
        <el-form-item label="备注" prop="tip">
          <el-input v-model="data.tip"/>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button type="primary" @click="create(ruleFormRef)">创建</el-button>
      <el-button @click="model=false">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">


import {reactive, ref, watch} from "vue";
import {Tool} from "@/components/system-components/model/system";
import {getIcon} from "@/components/system-components/utils/systemutils";
import {FormInstance, FormRules} from "element-plus";

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

const icons = ref(getIcon())
const ruleFormRef = ref<FormInstance>(null)
const data = ref<Tool>({
  btn: "",
  name: "",
  type: 1,
  component: "",
  icon: "",
  id: "",
  path: "",
  position: 1,
  pull: "",
  routerName: "",
  tip: "",
  ws: "",
})

const typeOptions = ref([
  {
    value: 1,
    label: "路由工具"
  },
  {
    value: 2,
    label: "窗口工具"
  },
])

const positionOptions = ref([
  {
    value: 1,
    label: "左侧"
  },
  {
    value: 2,
    label: "右侧"
  },
])


const checkType = (rule: FormRules, value: any, callback: Function) => {
  if (data.value.type == 1) {
    if (value == '') {
      callback(new Error('必填项'))
    } else {
      callback()
    }
  }
  callback()
}

const rules = reactive<FormRules<Tool>>({
  name: [
    {required: true, message: "请输入名称", trigger: "blur"},
  ],
  btn: [
    {required: true, message: "请输入按钮", trigger: "blur"},
  ],
  icon: [
    {required: true, message: "请输入图标", trigger: "blur"},
  ],
  type: [
    {required: true, message: "请输入类型", trigger: "blur"},
  ],
  position: [
    {required: true, message: "请输入位置", trigger: "blur"},
  ],
  pull: [
    {required: true, message: "请输入消息", trigger: "blur"},
  ],
  routerName: [
    {validator: checkType, trigger: "blur"}
  ],
  tip: [
    {required: true, message: "请输入备注", trigger: "blur"},
  ],
  ws: [
    {required: true, message: "请输入WS", trigger: "blur"},
  ],
  component: [
    {validator: checkType, trigger: "blur"}
  ],
  path: [{validator: checkType, trigger: "blur"}]
})

async function create(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
  emits("close")
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

}

function init() {
  let icon = getIcon();
  console.log(icon)
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
<style>
.iconClass {
  height: 200px !important;
}
</style>