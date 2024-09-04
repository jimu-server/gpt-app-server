<template>
  <q-page-sticky position="bottom-right" :offset="fabPos">
    <q-card
        v-touch-pan.prevent.mouse="moveFab"
    >
      1111
    </q-card>
  </q-page-sticky>
</template>

<script setup lang="ts">
import {ref} from "vue";

const flag = ref(true)
const draggingFab = ref(true)
const fabPos = ref([18, 18])

function moveFab(ev) {
  draggingFab.value = ev.isFirst !== true && ev.isFinal !== true
  fabPos.value = [
    fabPos.value[0] - ev.delta.x,
    fabPos.value[1] - ev.delta.y
  ]
}
</script>


<style scoped>

</style>