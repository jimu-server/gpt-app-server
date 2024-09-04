<template>
  <div class="fit" @mouseenter="infoShow = true" @mouseleave="infoOut">
    <slot></slot>
    <q-menu
        v-model="infoShow" @mouseenter="infoShowOut = true" @mouseleave="popupOut"
        :anchor="anchor" :self="self"
        :offset="offset"
    >
      <slot name="menu">

      </slot>
    </q-menu>
  </div>
</template>


<script setup lang="ts">
import {ref} from "vue";
const props=defineProps(['anchor','self','offset'])


const infoShow = ref(false)
const infoShowOut = ref(false)

function popupOut() {
  infoShow.value = false
  infoShowOut.value = false
}

function infoOut() {
  setTimeout(() => {
    if (!infoShowOut.value) {
      infoShow.value = false
    }
  }, 100)
}

</script>


<style scoped>

</style>