<template>
  <div class="fit" @mouseenter="focus=true" @mouseleave="focus=false">
    <div v-if="!edit" class="fit" @click="editor" :style="{
      fontSize: font,
      userSelect: 'none',
    }">
      <div class="column justify-center">
        {{ value }}
      </div>
    </div>
    <div v-else class="full-height column justify-center">
      <div class="fit row justify-between">
        <el-input ref="nameRef" v-model="value" @blur="unblur" size="small" minlength="1" style="width: 100px;"/>
        <div>
          <el-button size="small" text @click="save" type="primary">保存</el-button>
          <el-button size="small" text @click="uneditor" style="margin-left: 5px">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

defineProps({
  font: {
    type: String,
    default: '20px'
  }
})

const emits = defineEmits({
  save: (value) => {
  }
})

const model = defineModel({required: true, type: String});
const value = ref(model.value)
const edit = ref(false)
const nameRef = ref(null)
const focus = ref(false)
const change = ref(false)

function editor() {
  edit.value = true
  setTimeout(() => {
    nameRef.value.focus()
  }, 100)
}

function unblur() {
  if (!change.value) {
    value.value = model.value
  }
  if (!focus.value) {
    edit.value = false
  }
}

function uneditor() {
  value.value = model.value
  edit.value = false
}

function save() {
  if (!change.value) {
    edit.value = false
    return
  }
  emits('save', value.value)
  edit.value = false
}

watch(() => value.value, (value) => {
  if (value !== model.value) {
    change.value = true
    return
  }
  change.value = false
})
</script>


<style scoped>

</style>