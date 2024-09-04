<template>
  <div style="padding: 5px">
    <q-input outlined dense v-model="text"/>
  </div>
  <div class="full-width" style="flex-grow: 1">
    <q-tabs
        v-model="model"
        vertical
        class="fit"
        active-bg-color="primary"
        active-color="white"
        :no-caps="true"
        indicator-color="transparent"
        @update:modelValue="select"
    >
      <q-tab v-for="item in list" :name="item.id" :label="item.name" :ripple="false"/>
    </q-tabs>
  </div>

</template>

<script setup lang="ts">
import {AppSetting, Tree} from "@/components/system-components/model/system";
import {ref} from "vue";

const model = defineModel('tab', {default: ''})
const text = ref('')
const props = defineProps<{
  list: AppSetting<any>[]
}>()
const emit = defineEmits({
  check: (item: AppSetting<any>) => {

  }
})

function select(value) {
  console.log(value)
}
</script>


<style scoped>

</style>