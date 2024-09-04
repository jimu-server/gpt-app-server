<template>
  <div @mousedown="mouseDown"></div>
</template>

<script setup lang="ts">

import {onDeactivated, onMounted, ref} from "vue";
import {useThemeStore} from "@/components/system-components/store/theme";


const emits = defineEmits({
  widthChange: function (value) {

  }
})

const theme = useThemeStore()
const color = ref('transparent')

const active = ref('#3967FF')
const un_active = ref('transparent')

const Width = ref(2)
const lastX = ref()

onMounted(() => {
  document.addEventListener("mouseup", mouseUp);
})

onDeactivated(() => {
  document.removeEventListener("mouseup", mouseUp)
})

function mouseDown(event) {
  color.value = active.value
  document.addEventListener("mousemove", mouseMove);
  lastX.value = event.screenX;
  document.getElementById("html").style.userSelect = 'none'
  document.getElementById("html").style.cursor = 'e-resize'
}

function mouseMove(event) {
  emits("widthChange", lastX.value - event.screenX);
  lastX.value = event.screenX;
}

function mouseUp() {
  lastX.value = "";
  color.value = un_active.value
  document.removeEventListener("mousemove", mouseMove);
  document.getElementById("html").style.userSelect = 'auto'
  document.getElementById("html").style.cursor = 'auto'
}

function mouseOver() {
  Width.value = 3
}

function mouseLeave() {
  Width.value = 2
}

</script>

<style scoped>
.drag {
  width: 3px;
  height: 100%;
  background: v-bind('color');
  z-index: 10;
}

.drag:hover {
  background: v-bind('active');
  width: 3px;
  cursor: e-resize;
}

</style>

<style>

</style>