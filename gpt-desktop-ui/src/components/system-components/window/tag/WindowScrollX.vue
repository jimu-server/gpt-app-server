<template>
  <div class="window-scroll-box full-width" v-size="sizeChange">
    <div class="window-scroll-x">
      <div class="window-scroll-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {reactive} from "vue";

const s = reactive({
  w: 0,
  h: 0,
})

const vSize = {
  updated(el, binding, vnode, prevVnode) {
    if (typeof binding.value === 'function') {
      binding.value(el.clientWidth, el.clientHeight);
    }
  },
}

function sizeChange(width: number, height: number) {
  s.w = width
  s.h = height
}
</script>


<style scoped>
.window-scroll-x {
  width: calc(v-bind('s.h') * 1px);
  height: calc(v-bind('s.w') * 1px);
  position: relative;
  overflow: auto;
  transform-origin: 0 0;
  transform: translateY(calc(v-bind('s.h') * 1px)) rotate(-90deg);
}

.window-scroll-content {
  height: calc(v-bind('s.h') * 1px);
  position: absolute;
  left: 100%;
  transform-origin: 0 0;
  transform: rotate(90deg);
}
</style>

<style>

.window-scroll-x::-webkit-scrollbar {
  width: 1px;
  height: 1px;
}

.window-scroll-x::-webkit-scrollbar-thumb {
  border-radius: 0px;
  box-shadow: none;
  background: none;
}

.window-scroll-x::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(255, 255, 255);
  border-radius: 0;
  background: rgb(255, 255, 255);
}
</style>