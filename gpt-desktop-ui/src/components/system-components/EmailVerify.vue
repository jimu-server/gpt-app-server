<template>
  <div class="fit">
    <div class="full-width row justify-center" style="margin-top: 10%">
      <template v-if="!flag && !err">
        <q-spinner
            color="primary"
            size="3em"
        />
      </template>
      <template v-else-if="flag">
        <div class="fit column">
          <div class="full-width row justify-center">
            <el-icon size="50px" color="#67C23A">
              <SuccessFilled/>
            </el-icon>
          </div>
          <div class="full-width row justify-center" style="margin-top: 10px;font-size: 30px">
            验证成功
          </div>
        </div>
      </template>
      <template v-else-if="err">
        <div class="fit column">
          <div class="full-width row justify-center">
            <el-icon size="50px" color="#F56C6C">
              <CircleCloseFilled/>
            </el-icon>
          </div>
          <div class="full-width row justify-center" style="margin-top: 10px;font-size: 30px">
            {{ msg }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {verifyEmail} from "@/components/system-components/request";

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})
const msg = ref('验证失败')
const flag = ref(false)
const err = ref(false)
setTimeout(() => {
  if (props.value == '') {
    return
  }
  verifyEmail(props.value).then(res => {
    if (res.code === 200) {
      flag.value = true
    }
    if (res.code == 1004) {
      msg.value = res.msg
      err.value = true
    }
  })
}, 2000)

</script>


<style scoped>

</style>