<template>
  <el-dialog
      v-model="model"
      :title="title"
      style="width: 400px;overflow: hidden;"
      draggable
      :modal="false"
  >
    <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
        flat
        style="width: 100%;height: 200px"
    >
      <q-step
          :name="1"
          title="验证密码"
          :done="step > 1"
      >
        <el-form :model="form" label-position="left">
          <el-form-item>
            <el-input v-model="form.Password" type="password" placeholder="请输入密码"
            ></el-input>
          </el-form-item>
        </el-form>
      </q-step>

      <q-step
          :name="2"
          title="设置邮箱"
          :done="step > 2"
      >
        <el-form :model="form">
          <el-form-item>
            <el-input v-model="form.Email" placeholder="新邮箱"
            ></el-input>
          </el-form-item>
        </el-form>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <el-button v-if="step!=2" type="primary" @click="next">下一步</el-button>
          <el-button v-if="step==2" type="primary" @click="submit">完成</el-button>
          <el-button v-if="step > 1" @click="model = false">取 消</el-button>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </el-dialog>
</template>
<script setup lang="ts">


import {ref, watch} from "vue";
import {checkPassword, updateEmail} from "@/components/system-components/request";
import {ElMessage} from "element-plus";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  append: {
    type: String,
    default: "",
  }
})
const emits = defineEmits({
  success: function () {

  }
})
const form = ref({
  Password: "",
  Email: "",
  confirmPassword: "",
})
const step = ref(1)
const stepper = ref()

const appendTo = ref()

function next() {
  checkPassword(form.value.Password).then(res => {
    if (res.code === 200) {
      stepper.value.next()
    }
  })
}

function submit() {
  if (form.value.Email == '') {
    ElMessage({
      message: '请输入邮箱',
      type: 'warning',
      grouping: true,
      plain: true,
    })
    return
  }
  updateEmail(form.value.Email).then(res => {
    if (res.code === 200) {
      model.value = false
      emits('success')
    }
  })
}


const model = defineModel({default: false, required: true})


function destroy() {
  form.value.Password = ""
  form.value.Email = ""
  step.value = 1
}

function init() {
  appendTo.value = document.getElementById(props.append)
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