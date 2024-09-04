<template>
  <q-card
      style="width: 25vw;height: 15vh"
      class="column"
  >
    <div class="fit column" style="padding: 5px">
      <div class="full-width row justify-between">
        <div>
          助手偏好
        </div>
        <div>
          <q-chip dense icon="jimu-15qingkong-1" label="清空" clickable outline color="primary" @click="clear"/>
        </div>
      </div>
      <div class="programming-assistant">
        <q-scroll-area class="fit">
          <q-chip
              square
              outline
              v-for="(item,index) in plugin.ctx.programming.list"
              v-model:selected="item.selected"
              :color="item.bgColor"
              :icon="item.icon"
              :icon-selected="item.icon"
              :label="item.name"
              @click="select(item,index)"
          />
        </q-scroll-area>
      </div>
    </div>

  </q-card>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import {useAiPluginStore} from "@/components/tool-components/chatGptTool/store/plugin";

const props = defineProps<{
  data: any
}>()


const plugin = useAiPluginStore()

function select(value: any, index: number) {
  if (value.selected) {
    plugin.ctx.programming.list[index].bgColor = 'primary'
  } else {
    plugin.ctx.programming.list[index].bgColor = ''
  }
}

function clear() {
  plugin.ctx.programming.list.forEach((item: any) => {
    item.selected = false
    item.bgColor = ''
  })
}

</script>


<style scoped>
.programming-assistant {
  flex-grow: 1;
}
</style>