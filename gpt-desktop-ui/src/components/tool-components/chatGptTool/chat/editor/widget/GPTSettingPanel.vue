<template>
  <div>
    <q-icon size="20px" class="edit-tool-option" name="jimu-shezhi001">
      <q-tooltip :offset="[0, 0]">
        配置
      </q-tooltip>
    </q-icon>
    <q-menu
        anchor="top start" self="bottom start"
        transition-show="scale"
        transition-hide="scale"
    >
      <div style="width: 500px;height: 200px;overflow: hidden">
        <q-list dense>
          <q-item>
            <q-item-section avatar>
              <q-icon name="jimu-shijian-2">
              </q-icon>
            </q-item-section>
            <q-item-section>
              <el-slider v-model="ctx.ui.marks" range :min="0" :max="ctx.CurrentChat.messageList.length"
                         size="small"
                         :show-tooltip="false"
                         :marks="ctx.ui.marks"
                         @input="sliderInput"
              />
            </q-item-section>
            <q-item-section avatar>
              {{ sliderChange }}
            </q-item-section>
          </q-item>
        </q-list>

      </div>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";



const ctx = useGptStore()

function sliderInput(value) {
  if (value[0] > value[1]) {
    ctx.ui.marks[0] = value[1]
    ctx.ui.marks[1] = value[0]
  }
}

const sliderChange = computed(() => {
  let star = ctx.ui.marks[0] + 1
  let end = 1
  if (ctx.ui.marks[0] == ctx.CurrentChat.messageList.length) {
    star = ctx.CurrentChat.messageList.length - 1
  }
  if (ctx.ui.marks[1] > 0) {
    end = ctx.ui.marks[1] - 1
  }
  return `${star} -- ${end}`
})
</script>


<style scoped>

</style>