<template>
  <div @mouseenter="model = true" @mouseleave="infoOut">
    <slot :flag="model" name="view"></slot>
    <q-menu
        v-model="model" @mouseenter="infoShowOut = true" @mouseleave="popupOut"
        :anchor="anchor" :self="self"
        :offset="offset"
        style="max-width: 100vw"
    >
      <slot name="menu">

      </slot>
    </q-menu>
  </div>
</template>


<script setup lang="ts">
import {ref} from "vue";

const props = defineProps(['anchor', 'self', 'offset'])

const model = defineModel({default: false, required: true})

const infoShowOut = ref(false)

function popupOut() {
  model.value = false
  infoShowOut.value = false
}

function infoOut() {
  setTimeout(() => {
    if (!infoShowOut.value) {
      model.value = false
    }
  }, 100)
}

</script>


<style scoped>

</style>

<style>
.q-menu {
  max-width: 100vw;
}
</style>