<template>
  <div id="login-page" class="fit row justify-center">
    <div class="fit column justify-center">
      <div class=" fit row justify-center">
        <div class="fit column">
          <q-bar class="bg-transparent" style="padding: 0;-webkit-app-region: drag; height: 40px">
            <q-space/>
            <WindowMinimizeBtn/>
            <WindowCloseBtn/>
          </q-bar>
          <q-card flat id="login" ref="logRef" class="login-box" style="flex-grow: 1">
            <div class="fit" id="loginBox">
              <!-- 账号登录 -->
              <transition
                  enter-active-class="animate__animated animate__flipInY"
              >
                <div v-if="showPanel=='login'" class="fit row justify-center">
                  <div class=" full-height column justify-center">
                    <q-form class="input  justify-center" autofocus autocorrect="off" autocomplete="off" autocapitalize="off" spellcheck="false">
                      <div>
                        <q-tabs
                            v-model="tab"
                            indicator-color="transparent"
                            active-color="primary"
                            class="bg-transparent"
                        >
                          <q-tab name="default" :ripple="false" label="账号密码"/>
                          <q-tab name="phone" :ripple="false" label="短信登录"/>
                        </q-tabs>
                        <q-tab-panels v-model="tab" animated>
                          <q-tab-panel name="default">
                            <div class="full-width row justify-center">
                              <q-input table-index
                                       :ref="el=> loginInputRef[0]=el"
                                       dense
                                       outlined
                                       v-model="account.curent.account"
                                       placeholder="账号/手机/邮箱"
                                       :error="false"
                                       style="width: 260px"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="jimu-yonghuming" size="20px"/>
                                </template>
                                <AccountMenuList v-if="account.list.length>0"/>
                              </q-input>
                            </div>
                            <div class="full-width row justify-center">
                              <q-input table-index :ref="el=> loginInputRef[1]=el" dense outlined
                                       v-model="account.curent.password"
                                       type="password"
                                       :error="false"
                                       style="width: 260px"
                                       placeholder="密码"
                              >
                                <template v-slot:prepend>
                                  <q-icon name="jimu-mima" size="20px"/>
                                </template>
                                <template v-slot:append>
                                  <el-link type="primary" @click="showPanel='forget'">忘记密码?</el-link>
                                </template>
                              </q-input>
                            </div>
                          </q-tab-panel>
                          <q-tab-panel name="phone">
                            <div class="full-width row justify-center">
                              <q-input table-index
                                       :ref="el=> loginInputRef[0]=el"
                                       dense
                                       outlined
                                       v-model="phone"
                                       placeholder="手机"
                                       :error="false"
                                       style="width: 260px"
                              >
                                <template v-slot:before>
                                  <q-select v-model="area" :options="areaOptions"
                                            dense
                                            options-dense
                                            dropdown-icon=""
                                            outlined
                                            style="width: 50px"
                                  />
                                </template>
                              </q-input>
                            </div>
                            <div class="full-width row justify-center">
                              <q-input table-index :ref="el=> loginInputRef[1]=el" dense outlined v-model="code"
                                       :error="false"
                                       style="width: 260px"
                                       placeholder="验证码"
                              >
                                <template v-slot:append>
                                  <q-btn flat dense no-caps :disable="phone==''||flag" @click="sendCode">
                                    <template v-if="!flag">
                                      发送验证码
                                    </template>
                                    <template v-else>
                                      {{ timepiece }}
                                    </template>
                                  </q-btn>
                                </template>
                              </q-input>
                            </div>
                          </q-tab-panel>
                        </q-tab-panels>
                      </div>
                      <div>
                        <div class="row justify-between" style="padding-right: 8px;margin-bottom: 10px">
                          <q-checkbox size="xs" v-model="account.keep" @update:model-value="keepChange" val="xs"
                                      label="记住账号"/>
                          <q-space/>
                          <div><span @click="showPanel='register'" class="register-but text-primary">注册账号</span>
                          </div>
                        </div>

                        <div class="full-width row justify-center">
                          <q-btn unelevated color="primary" style="width: 96%" @click="login" :loading="loading" :disable="loading">
                            登录
                            <template v-slot:loading>
                              <q-spinner style="margin-right: 5px"/>
                              登录
                            </template>
                          </q-btn>
                        </div>
                        <div class="row" style="margin-top: 10px;padding-right: 1px" @click="clause=!clause">
                          <q-checkbox size="xs" v-model="clause" val="xs"/>
                          <div class="column justify-center">
                            <div style="user-select: none">
                              已阅读并同意：&nbsp;
                              <span class="clause-opt text-blue" @click.stop>隐私政策</span>&nbsp;、
                              <span class="clause-opt text-blue" @click.stop>产品服务协议</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-form>
                  </div>
                </div>
              </transition>
              <!-- 注册账号 -->
              <transition
                  enter-active-class="animate__animated animate__flipInY"
              >
                <div v-if="showPanel=='register'" class="row justify-center" style="width:100%;height: 100%">
                  <div class="column justify-center" style="width: 70%">
                    <el-form ref="registerRef" :model="registerForm" size="large" :rules="rules">
                      <el-form-item prop="account">
                        <el-input v-model="registerForm.account" placeholder="账号"></el-input>
                      </el-form-item>
                      <el-form-item prop="name">
                        <el-input v-model="registerForm.name" placeholder="昵称"></el-input>
                      </el-form-item>
                      <el-form-item prop="password">
                        <el-input type="password" v-model="registerForm.password" placeholder="密码"></el-input>
                      </el-form-item>
                      <el-form-item prop="confirmPassword">
                        <el-input type="password" v-model="registerForm.confirmPassword"
                                  placeholder="确认密码"></el-input>
                      </el-form-item>
                    </el-form>
                    <div class="row justify-between" style="margin-top: 10px">
                      <q-btn unelevated v-if="step==1" @click="cleanRegister" label="取消"/>
                      <q-btn unelevated v-show="step == 1" @click="doRegister" color="primary" label="注册"/>
                    </div>
                  </div>
                </div>
              </transition>
              <!--     忘记密码       -->
              <transition
                  enter-active-class="animate__animated animate__flipInY"
              >
                <div v-if="showPanel=='forget'" class="fit column justify-center"
                     style="padding-top: 10px;margin-bottom: 10px">
                  <q-option-group
                      v-model="group"
                      :options="options"
                      @@update:model-value="groupChange"
                      color="primary"
                      inline
                  />
                  <div class="full-width row justify-center" style="flex-grow: 1">
                    <template v-if="group=='phone'">
                      <ForGetPassword ref="phoneForget" title="手机号"/>
                    </template>
                    <template v-if="group=='email'">
                      <ForGetPassword ref="emailForget" title="邮箱号"/>
                    </template>
                  </div>
                  <div class="full-width column">
                    <div class="row justify-center" style="margin-bottom: 10px">
                      <q-btn unelevated dense color="primary" @click="doReset" style="width: 90%;height: 36px">
                        提交
                      </q-btn>
                    </div>
                    <div class="row justify-center" style="margin-bottom: 10px">
                      <q-btn unelevated dense @click="showPanel='login'" style="width: 90% ;height: 36px">
                        取消
                      </q-btn>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </q-card>
        </div>

      </div>
    </div>
    <el-dialog
        v-model="centerDialogVisible"
        title="提示"
        width="210"
        center
        :show-close="false"
        :append-to-body="false"
        :append-to="loginBox"
    >
      <span class="row">
        登陆前请先阅读并同意：&nbsp;
        <span class="clause-opt text-blue" @click.stop>隐私政策</span>&nbsp;、
        <span class="clause-opt text-blue" @click.stop>产品服务协议</span>
      </span>
      <template #footer>
        <div class="full-width row justify-between">
          <el-button @click="centerDialogVisible = false">返回</el-button>
          <el-button type="primary" @click="agree">同意并登录</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">

import {computed, onMounted, onUnmounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {homePath} from "@/variable";
import {userStore} from "@/components/system-components/store/user";
import {ElMessage, FormInstance, FormItemRule, FormRules} from "element-plus";
import {getPassword, loadUserInfo} from "@/components/system-components/utils/userutil";
import {defaultLogin, doResetPassword, getPhoneCode, registerUser} from "@/components/system-components/request";
import ForGetPassword from "@/components/system-components/ForGetPassword.vue";
import WindowMinimizeBtn from "@/components/system-components/desktop/WindowMinimizeBtn.vue";
import WindowCloseBtn from "@/components/system-components/desktop/WindowCloseBtn.vue";
import {desktop_login} from "@/components/system-components/desktop/desktop";
import {ipcRenderer} from "electron";
import AccountMenuList from "@/components/system-components/AccountMenuList.vue";
import {useAccountStore} from "@/components/system-components/store/account";

const user = userStore()
const router = useRouter()
const centerDialogVisible = ref(false)
const logRef = ref()

const loading = ref(false)
const tab = ref('default')
const area = ref('+86')
const areaOptions = [
  '+86',
  '+87',
  '+88',
  '+89',
  '+90',
  '+91',
]
const step = ref(1)
const showPanel = ref('login')
const keep = ref(false);
const clause = ref(false);
const phone = ref('')
const code = ref('')
const value = ref(30)
const flag = ref(false)
const account = useAccountStore()
let count
const registerForm = ref({
  account: '',
  name: '',
  password: '',
  confirmPassword: '',
})

const loginBox = ref()
const loginInputRef = ref([])
const registerRef = ref<FormInstance>()
const group = ref('phone')
const phoneForget = ref()
const emailForget = ref()
const options = [
  {
    label: '手机找回',
    value: 'phone'
  },
  {
    label: '邮箱找回',
    value: 'email'
  },
]

function groupChange(value) {

}

function keepChange(value) {

}

const timepiece = computed(() => {
  return `${value.value} s后可重发`
})

const accountList = ref(false)


function agreeAction() {

}

function agree() {
  centerDialogVisible.value = false
  clause.value = true
  setTimeout(() => {
    login()
  }, 100)
}

function sendCode() {
  getPhoneCode(phone.value).then(res => {
    if (res.code == 200) {
      ElMessage({
        message: res.data,
        type: 'success',
        duration: 2000,
        plain: true,
      })
      flag.value = true
      count = setInterval(() => {
        if (value.value > 1) {
          value.value--
        } else {
          flag.value = false
          value.value = 30
          clearInterval(count)
        }
      }, 1000)
    } else {
      ElMessage.error('发送失败')
    }
  })
}

/*
* @desc 回车登录
* */
function loginAction(event) {
  if (event.keyCode == 13) {
    if (router.currentRoute.value.path == "/login") {
      login()
    }
  }
}

// 执行登录
function login() {
  switch (tab.value) {
    case 'phone':
      phoneLoginAction()
      break
    case 'default':
      defaultLoginAction()
      break
  }
}

function phoneLoginAction() {
  if (phone.value.length == 0) {
    ElMessage({
      message: '请输入手机号码',
      type: 'warning',
      plain: true,
      grouping: true,
      appendTo: document.getElementById('loginBox')
    })
    return
  }
  if (code.value.length == 0) {
    ElMessage({
      message: '请输入验证码',
      type: 'warning',
      plain: true,
      grouping: true,
      appendTo: document.getElementById('loginBox')
    })
    return
  }
  if (!clause.value) {
    centerDialogVisible.value = true
    return;
  }
}

function defaultLoginAction() {
  if (account.curent.account == '' || account.curent.password == '') {
    ElMessage({
      message: '输入账号密码',
      type: 'warning',
      duration: 1000,
      plain: true,
      grouping: true,
      appendTo: document.getElementById('loginBox')
    })
    return
  }
  if (!clause.value) {
    centerDialogVisible.value = true
    return;
  }
  loading.value = true
  defaultLogin(account.curent.account, account.curent.password).then(async (data) => {
    if (data.code == 200) {
      // 更新 token
      user.info.token = data.data.token
      setTimeout(async () => {
        desktop_login()
        loading.value = false
        if (!account.keep) account.curent.password = ''
        // 更新当先账号的信息到 session 存储
        account.addAccount({
          account: account.curent.account,
          password: account.curent.password,
        })

      }, 1000)
      return
    }
    setTimeout(() => {
      loading.value = false
    }, 500)
  })
}

async function doRegister() {
  if (!registerRef) return
  await registerRef.value.validate(async (valid) => {
    if (valid) {
      let result = await registerUser(registerForm.value)
      if (result.code == 200) {
        ElMessage({
          message: result.msg,
          type: 'success',
          duration: 2000,
          plain: true,
          grouping: true,
          appendTo: document.getElementById('loginBox')
        })
        showPanel.value = 'login'
      }
    } else {
    }
  })
}

async function doReset() {
  let password = ''
  let phone = ''
  let email = ''
  if (group.value == 'phone') {
    password = phoneForget.value.getPassword()
    phone = phoneForget.value.getAccount()
  } else {
    email = phoneForget.value.getAccount()
    password = emailForget.value.getPassword()
  }
  console.log(phone, email, password)
  let result = await doResetPassword(phone, email, password)
  if (result.code == 200) {
    ElMessage({
      message: '重置成功',
      type: 'success',
      duration: 1000,
      plain: true,
      grouping: true,
      appendTo: document.getElementById('loginBox')
    })
    setTimeout(() => {
      showPanel.value = 'login'
    }, 500)
  }
}

const accountCheck = (rule: FormItemRule, value: string, callback: Function) => {
  if (value.length == 0) {
    callback(new Error('账号不能为空'))
    return
  }

  if (value.length < 4) {
    callback(new Error('账号长度不能小于4'))
    return
  }

  if (!/^[\w_-]*$/.test(value)) {
    callback(new Error('账号不能带特殊字符'))
    return
  }
  callback()
}
// 昵称校验规则
const nameCheck = (rule: FormItemRule, value: string, callback: Function) => {
  if (value.length == 0) {
    callback(new Error('昵称不能为空'))
    return
  }
  if (!/^[\w_-]*$/.test(value)) {
    callback(new Error('昵称不能带特殊字符'))
    return
  }
  callback()
}

const confirmPasswordCheck = (rule: FormItemRule, value: string, callback: Function) => {
  if (value.length == 0) {
    callback(new Error('确认密码不能为空'))
    return
  }
  if (value != registerForm.value.password) {
    callback(new Error('密码不一致'))
    return
  }
  callback()
}

function cleanRegister() {
  registerForm.value.account = ''
  registerForm.value.name = ''
  registerForm.value.password = ''
  registerForm.value.confirmPassword = ''
  showPanel.value = 'login'
}

const rules = reactive<FormRules<typeof registerForm>>({
  account: [{validator: accountCheck, trigger: 'blur'}],
  name: [{validator: nameCheck, trigger: 'blur'}],
  confirmPassword: [{validator: confirmPasswordCheck, trigger: 'blur'}],
})





onMounted(() => {
  loginBox.value = document.getElementById('loginBox')
  window.addEventListener('keydown', loginAction)
})

onUnmounted(() => {
  window.removeEventListener('keydown', loginAction)
})

</script>


<style scoped>

#login-page {
  display: flex;
  flex-direction: column;
  width: 360px;
  height: 400px;
  overflow: hidden;
}

#login {

}


.login-box {

}

.login-box:hover {
  cursor: default;
}

.register-but {

}

.register-but:hover {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: #6aa9f3;
  text-underline-offset: 4px;
}

.clause-opt:hover {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: #6aa9f3;
  text-underline-offset: 4px;
}

</style>
<style>
#login-page .q-splitter__separator {
  background-color: transparent !important;
}

#loginBox > .el-overlay {
  position: absolute !important;
}

#loginBox > .el-overlay > .el-overlay-dialog {
  position: absolute !important;
}

#loginBox > .el-overlay > .el-overlay-dialog > .el-dialog {
  margin: 0;
  top: 20%;
  left: 22%;
}

#loginBox .q-tab-panels.q-panel-parent.shadow-2.rounded-borders {
  box-shadow: none !important;
}

#loginBox body.desktop .q-focusable:focus > .q-focus-helper, body.desktop .q-manual-focusable--focused > .q-focus-helper, body.desktop .q-hoverable:hover > .q-focus-helper {
  background: none;
  opacity: 0;
}

#loginBox #loginBox body.desktop .q-focusable:focus > .q-focus-helper, body.desktop .q-manual-focusable--focused > .q-focus-helper, body.desktop .q-hoverable:hover > .q-focus-helper {
  background: none;
  opacity: 0;
}

#loginBox .q-focusable:focus > .q-focus-helper, body.desktop .q-manual-focusable--focused > .q-focus-helper {
  background: none;
  opacity: 0;
}

#loginBox .q-focusable:focus > .q-focus-helper, body.desktop .q-manual-focusable--focused > .q-focus-helper, body.desktop .q-hoverable:hover > .q-focus-helper {
  background: none;
  opacity: 0;
}

</style>