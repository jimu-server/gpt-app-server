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
        color="fit primary"
        animated
        flat
    >
      <q-step
          :name="1"
          title="验证密码"
          :done="step > 1"
      >
        <el-form :model="form" label-position="left" style="height: 100px">
          <el-form-item>
            <el-input v-model="form.oldPassword" type="password" placeholder="密码"/>
          </el-form-item>
        </el-form>
      </q-step>

      <q-step
          :name="2"
          title="设置密码"
          :done="step > 2"
      >
        <el-form :model="form">
          <el-form-item prop="newPassword">
            <el-input v-model="form.newPassword" type="password" placeholder="新密码"
                      show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码"
                      show-password
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
import {checkPassword, updatePassword} from "@/components/system-components/request";
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

const form = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
})
const step = ref(1)
const stepper = ref()

const appendTo = ref()


function next() {
  // 校验密码
  checkPassword(form.value.oldPassword).then(data => {
    if (data.code === 200) {
      stepper.value.next()
    }
  })
}

function submit() {
  if (form.value.newPassword == '' || form.value.confirmPassword == '') {
    ElMessage({
      message: "密码不能为空",
      type: "warning",
      grouping: true,
      plain: true
    })
    return
  }
  if (form.value.newPassword !== form.value.confirmPassword) {
    ElMessage({
      message: "两次密码不一致",
      type: "error",
      grouping: true,
      plain: true
    })
    return
  }
  updatePassword(form.value.oldPassword, form.value.newPassword).then(res => {
    if (res.code === 200) {
      ElMessage({
        message: "修改成功",
        type: "success",
        grouping: true,
        plain: true
      })
      model.value = false
    }
  })
}


const model = defineModel({default: false, required: true})


function destroy() {
  step.value = 1
  form.value.oldPassword = ""
  form.value.newPassword = ""
  form.value.confirmPassword = ""
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