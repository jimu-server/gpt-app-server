<template>
  <div id="taskpage" class="fit">
    <div class="column justify-center" style="height: 5%">
      <q-bar
          class="bg-transparent fit"
      >
        <q-date
            v-model="date"
            minimal
            flat
            square
        />
      </q-bar>
    </div>
    <div style="height: 95%">
      <TaskTable :data="date"/>
    </div>
<!--    <q-splitter
        v-model="splitterModel"
        :limits="[30,70]"
        :style="{height:ctx.ui.page.height}"
    >

      <template v-slot:before>

      </template>

      <template v-slot:after>
        <div class="fit">

        </div>
      </template>
    </q-splitter>-->
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";

import {colors} from 'quasar'

import TaskTable from "@/components/system-components/widget/TaskTable.vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";

const {getPaletteColor} = colors

const ctx = useGptStore()

const splitterModel = ref(30)
const date = ref(new Date())


onMounted(() => {

})


</script>


<style scoped>

</style>

<style>
#taskpage .q-date__calendar-weekdays.row.items-center.no-wrap{
  display: none !important;
}

#taskpage .q-date__calendar-days-container.relative-position.overflow-hidden{
  display: none !important;
}

#taskpage .q-date__view.q-date__calendar {
  padding: 0 !important;
  margin: 0 !important;
  min-height: 0 !important;
  width: 100% !important;
}


</style>