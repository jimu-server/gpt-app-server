<template>
  <el-dialog
      v-model="model"
      :title="title"
      style="width: 400px;overflow: hidden;"
      draggable
      :modal="false"
  >
    <el-form :model="form" label-position="left" label-width="60px">
      <el-form-item label="手机">
        {{ phone }}
      </el-form-item>
      <el-form-item label="验证码">
        <div class="row">
          <el-input v-model="form.code" placeholder="验证码"
                    maxlength="6"
                    @input="inputCode"
                    style="width: 100px"
                    :disabled="!flag"
          ></el-input>
          <template v-if="!check">
            <el-button type="primary" style="margin-left: 5px;" :disabled="flag" :text="flag"
                       @click="sendCode">
              <template v-if="!flag">
                短信验证
              </template>
              <template v-else>
                <el-text type="warning">
                  {{ timepiece }}
                </el-text>
              </template>
            </el-button>
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
      <el-form-item label="手机号">
        <el-input v-model="form.newPhone" placeholder="新手机"
                  style="width: 200px"
                  :disabled="!check"
                  maxlength="11"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
         <el-button type="primary" @click="submit" :disabled="!check">确 定</el-button>
        <el-button @click="model = false">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">


import {computed, ref, watch} from "vue";
import {ElMessage} from "element-plus";
import {getSecurePhoneCode, updatePhone} from "@/components/system-components/request";
import {userStore} from "@/components/system-components/store/user";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  }
})
const emits = defineEmits({
  success: function () {

  }
})

const form = ref({
  code: '',
  newPhone: ''
})
const text = ref(30)
const flag = ref(false)
const check = ref(false)
const user = userStore()

const timepiece = computed(() => {
  return `${text.value} s后可重发`
})
let count


function submit() {
  if (form.value.newPhone === '') {
    ElMessage({
      message: '请输入手机号',
      type: 'warning',
      grouping: true,
      plain: true,
    })
    return
  }
  if (form.value.newPhone === user.info.user.phone) {
    ElMessage({
      message: '请勿重复绑定',
      type: 'warning',
      grouping: true,
      plain: true,
    })
    return
  }
  updatePhone(form.value.newPhone, form.value.code).then(data => {
    if (data.code === 200) {
      model.value = false
      emits('success')
    }
  })
}

function sendCode() {
  getSecurePhoneCode(form.value.newPhone).then(data => {
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


const model = defineModel({default: false, required: true})


function destroy() {
  form.value.code = ""
  form.value.newPhone = ""
  check.value = false
  if (count) {
    clearInterval(count)
    text.value = 30
    flag.value = false
  }
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