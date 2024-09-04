<template>
  <div class=" row justify-between bg-grey-1" style="height: 40px">
    <q-btn v-for="button in buttons" style="width: 50%" flat square :ripple="false" label="好友" @click="change"/>
    <q-btn style="width: 50%" flat square :ripple="false" label="群组"/>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const props = defineProps({
  buttons: {
    type: Array,
    required: true
  }
})

const view = defineModel('view', {default: ''})
const isActive = ref(false)


function change() {

}
</script>


<style scoped>

</style>