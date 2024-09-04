<template>
  <div class="account-secure-opt fit row justify-between">
    <div class="column justify-center" style="width: 20%;user-select: none">
      <div class="row">
        <div>

        </div>
        <div>
          {{ label }}
        </div>
      </div>
    </div>
    <div class="column justify-center text-grey-7" style="width: 50%;user-select: none">
      <slot name="value" :value="value">
        {{ value }}
      </slot>
    </div>
    <div class="row justify-end" style="width: 20%">
      <slot name="button" :value="value">
        <el-button size="small" type="primary" text>
          设置
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: String,
  },
  BtnText: {
    type: String,
  },
  label: {
    type: String,
  }
})
</script>


<style scoped>
.account-secure-opt {
  margin-bottom: 10px;
}
</style>