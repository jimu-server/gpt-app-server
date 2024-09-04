<template>
  <div ref="scrollX" class="scroll-box full-width" v-size-s="sizeChange">
    <div class="scroll-x">
      <div class="scroll-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {onMounted, onUnmounted, reactive, ref} from "vue";

const scrollX = ref()
const s = reactive({
  w: 0,
  h: 0,
})

const vSizeS = {
  updated(el, binding, vnode, prevVnode) {
    if (typeof binding.value === 'function') {
      binding.value(el.clientWidth, el.clientHeight);
    }
  },
}

function sizeChange(width: number, height: number) {
  console.log(width, height)
  s.w = width
  s.h = height
}

onMounted(() => {

  setTimeout(() => {
    s.w = scrollX.value.clientWidth
    s.h = scrollX.value.clientHeight
    console.log(s.w, s.h)
  }, 200)
})

onUnmounted(() => {
  console.log(s.w, s.h)
})
</script>


<style scoped>
.scroll-x {
  width: calc(v-bind('s.h') * 1px);
  height: calc(v-bind('s.w') * 1px);
  position: relative;
  overflow: auto;
  transform-origin: 0 0;
  transform: translateY(calc(v-bind('s.h') * 1px)) rotate(-90deg);
}

.scroll-content {
  height: calc(v-bind('s.h') * 1px);
  position: absolute;
  left: 100%;
  transform-origin: 0 0;
  transform: rotate(90deg);
}
</style>

<style>

.scroll-x::-webkit-scrollbar {
  width: 1px;
  height: 1px;
}

.scroll-x::-webkit-scrollbar-thumb {
  border-radius: 0px;
  box-shadow: none;
  background: none;
}

.scroll-x::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(255, 255, 255);
  border-radius: 0;
  background: rgb(255, 255, 255);
}
</style>