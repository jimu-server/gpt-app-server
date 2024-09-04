<template>
  <q-dialog
      v-model="model"
  >
    <q-card
        ref="CardRef"
        style="max-width:100vw;width: 400px;height: 300px"
    >
      <div class="fit column">
        <div style="height: 10%">
          <q-bar class="bg-transparent" v-touch-pan.prevent.mouse="handleDrag">
            <div class="text-h6">{{ title }}</div>
            <q-space/>
            <q-btn dense flat icon="jimu-guanbi-2" @click.stop="model=false"/>
          </q-bar>
        </div>
        <div class="full-width" style="flex-grow: 1;padding: 5px">

        </div>
        <div class="full-width row reverse" style="margin-bottom: 10px">
          <div class="row justify-between" style="margin-right: 10px;width: 130px">
            <el-button type="primary" @click="submit">创建</el-button>
            <el-button @click="model=false">取消</el-button>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">


import {ref, watch} from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  }
})


function submit() {

}

const CardRef = ref()
const tempX = ref(0)
const tempY = ref(0)
const model = defineModel({default: false, required: true})

const handleDrag = (event) => {
  CardRef.value.$el.style.transform = `translate(${tempX.value + event.offset.x}px, ${tempY.value + event.offset.y}px)`;
  if (event.isFinal) {
    tempX.value += event.offset.x
    tempY.value += event.offset.y
  }
}

function destroy() {
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