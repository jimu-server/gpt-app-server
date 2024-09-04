<template>
  <q-item
      class="row justify-between plugin"
      dense
      style="padding: 0;height: 40px;"
      @mouseenter="infoShow = true" @mouseleave="infoOut"

  >
    <div class="row full-width"
         @mouseover="checkColor='white'"
         @mouseleave="checkColor='primary'"
    >
      <div class="row plugin-item full-width" @click.stop="check">
        <div class="column justify-center" style="margin-left: 5px">
          <q-icon :name="data.icon"/>
        </div>
        <div class="column justify-center" style="margin-left: 5px">
          {{ data.name }}
        </div>
      </div>
    </div>
    <div class="column justify-center" style="margin-right: 5px">
      <q-radio
          ref="radioRef"
          dense
          v-model="plugin.currentPlugin"
          :val="data"
          :keep-color="false"
          :color="checkColor"
          @mouseover="checkColor='white'"
          @mouseleave="checkColor='primary'"
      />
    </div>
    <q-menu
        v-model="infoShow" @mouseenter="enterMenu" @mouseleave="leaveMenu"
        anchor="top end" self="top start"
        :offset="[5,0]"
    >
      <template v-if="data.floatView!=''">
        <component :is="data.floatView" :data="data.props"/>
      </template>
    </q-menu>
  </q-item>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {AppChatPlugin} from "@/components/tool-components/chatGptTool/model/model";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {colors} from 'quasar'
import {useAiPluginStore} from "@/components/tool-components/chatGptTool/store/plugin";

const {getPaletteColor} = colors

const ctx = useGptStore()
const plugin = useAiPluginStore()
const props = defineProps<{
  data: AppChatPlugin;
}>()

const infoShow = ref(false)
const infoShowOut = ref(false)
const radioRef = ref(null)
const checkColor = ref('')
// 初始化选中状态

if (plugin.currentPlugin){
  if (plugin.currentPlugin.id === props.data.id) {
    plugin.currentPlugin = props.data
  }
}

// 选中操作
function check() {
  radioRef.value.set()
}


function enterMenu() {
  infoShowOut.value = true
  plugin.pluginMenuShowFlag = true
}

function leaveMenu() {
  infoShow.value = false
  infoShowOut.value = false
  plugin.pluginMenuShowFlag = false
}

function overColor() {

}

function infoOut() {
  setTimeout(() => {
    if (!infoShowOut.value) {
      infoShow.value = false
    }
  }, 200)
}
</script>


<style scoped>
.plugin-item {
  padding: 5px;
  user-select: none;
}

.plugin:hover {
  cursor: pointer;
  background-color: v-bind('getPaletteColor('primary')') !important;
  color: white !important;
}
</style>