<template>
  <el-form ref="formRef" label-position="left" label-width="70px" :model="form" :rules="rules" size="large">
    <el-form-item :label="title" prop="account">
      <el-input v-model="form.account"
                style="width: 200px"
      ></el-input>
    </el-form-item>
    <el-form-item label="验证码">
      <div class="row">
        <el-input v-model="form.code" placeholder="验证码"
                  maxlength="6"
                  @input="inputCode"
                  style="width: 80px"
                  :disabled="!flag"
        ></el-input>
        <template v-if="!check">
          <q-btn :flat="!check" style="margin-left: 5px;" :disabled="flag" :text="flag" no-caps
                     @click="sendCode">
            <template v-if="!flag">
              获取验证
            </template>
            <template v-else>
              <el-text type="primary">
                {{ timepiece }}
              </el-text>
            </template>
          </q-btn>
        </template>
        <template v-else>
          <div class="column justify-center" style="padding-left: 5px">
            <el-icon size="20" color="#67C23A">
              <CircleCheckFilled/>
            </el-icon>
          </div>
        </template>
      </div>
    </el-form-item>
    <el-form-item label="新密码">
      <el-input :disabled="!check" v-model="form.password" placeholder="密码" type="password" show-password
                style="width: 200px"

      ></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input :disabled="!check" v-model="form.confirmPassword" placeholder="确认密码" type="password" show-password
                style="width: 200px"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {getForgetCode, getSecurePhoneCode} from "@/components/system-components/request";
import {ElMessage, FormItemRule, FormRules} from "element-plus";


const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const text = ref(30)
const flag = ref(false)
const check = ref(false)
let count

const form = ref({
  account: '',
  code: '',
  password: '',
  confirmPassword: ''
})

defineExpose({
  getAccount,
  getPassword
})

function getAccount() {
  return form.value.account
}

function getPassword() {
  return form.value.confirmPassword
}

const timepiece = computed(() => {
  return `${text.value} s`
})

function sendCode() {
  let phone = ''
  let email = ''
  if (props.title === '手机号') {
    if (form.value.account == '') {
      ElMessage({
        message: '请输入手机号',
        type: 'warning',
        duration: 1000,
        grouping: true,
        plain: true,
      })
      return;
    }
    phone = form.value.account
  } else {
    if (form.value.account == '') {
      ElMessage({
        message: '请输入邮箱号',
        type: 'warning',
        duration: 1000,
        grouping: true,
        plain: true,
      })
      return
    }
    email = form.value.account
  }
  getForgetCode(email, phone).then(data => {
    if (data.code === 200) {
      flag.value = true
      count = setInterval(() => {
        if (text.value > 1) {
          text.value--
        } else {
          flag.value = false
          clearInterval(count)
          text.value = 30
        }
      }, 1000)
    }
  })
}

function inputCode() {
  if (form.value.code.length == 6) {
    console.log(form.value.code)
    check.value = true
  }
}

const confirmPasswordCheck = (rule: FormItemRule, value: any, callback: Function) => {
  console.log(value)
  if (form.value.password == '') {
    form.value.confirmPassword = ''
    callback()
    return
  }
  if (value === form.value.password) {
    callback()
    return;
  } else {
    callback(new Error('两次密码不一致'))
  }
}

const accountCheck = (rule: FormItemRule, value: any, callback: Function) => {
  console.log(value)
  if (props.title === '手机号') {
    if (value == '' || value.length != 11) {
      callback(new Error('请输入正确的手机号'))
      return
    }
  }
  if (props.title === '邮箱号') {
    if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value)) {
      callback(new Error('请输入正确的邮箱'))
      return
    }
  }
  callback()
}

const rules = reactive<FormRules<typeof form>>({
  confirmPassword: [{validator: confirmPasswordCheck, trigger: 'blur'}],
  account: [{validator: accountCheck, trigger: 'blur'}],
})
</script>

<style scoped>

</style>