<template>
  <div>
    <div class="row justify-between">
      <div>
        <q-chip
            size="md"
            :icon="plugin.currentPlugin.icon"
            style="cursor: default;user-select: none"
            :color="toggleColer"
            class="hvr-shrink"
        >
          {{ plugin.currentPlugin.name }}
        </q-chip>
      </div>
    </div>
    <q-menu
        id="plugin-menu"
        v-model="show"
        clickable
        anchor="top start" self="bottom start"
        transition-show="scale"
        transition-hide="scale"
        style="overflow: hidden;width: 150px"
        :persistent="plugin.pluginMenuShowFlag"
    >
      <PluginView/>
    </q-menu>
  </div>
</template>

<script setup lang="ts">

import PluginView from "@/components/tool-components/chatGptTool/chat/editor-tool-bar/plugins/PluginView.vue";
import {computed, onMounted, ref, watch} from "vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {useThemeStore} from "@/components/system-components/store/theme";
import {useAiPluginStore} from "@/components/tool-components/chatGptTool/store/plugin";
import {getPlugins} from "@/components/tool-components/chatGptTool/chatRequest";

const ctx = useGptStore()
const plugin = useAiPluginStore()
const theme = useThemeStore()
const show = ref(false)

const toggleColer = computed(() => {
  return theme.dark ? "grey-10" : "grey-2"
})


watch(() => theme.dark, (value) => {

})

onMounted(async () => {
  plugin.plugins = await getPlugins()
/*  plugin.plugins = [
    {
      id: "1",
      name: "AI 助手",
      code: "default",
      icon: "jimu-ChatGPT",
      model: "qwen2:7b",
      floatView: "1",
      props: "{}",
      status: true,
      createTime: "",
    },
    {
      id: "2",
      name: "AI 助手",
      code: "programming",
      icon: "jimu-code",
      model: "qwen2:7b",
      floatView: "ProgrammingAssistantPanelView",
      props: "{}",
      status: true,
      createTime: "",
    },
    {
      id: "3",
      name: "知识库",
      code: "knowledge",
      icon: "jimu-zhishi",
      model: "qwen2:7b",
      floatView: "KnowledgePanelView",
      props: "{}",
      status: true,
      createTime: "",
    },
  ]*/
  // 默认选中第一个插件
  if (plugin.plugins.length > 0) {
    plugin.currentPlugin = plugin.plugins[0]
  }
})

</script>


<style scoped>
.hvr-bounce-to-right2 {
  border-radius: 15px;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  position: relative;
  -webkit-transition-property: color;
  transition-property: color;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
}
.hvr-bounce-to-right2:before {
  border-radius: 15px;
  content: "";
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1976D2;
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
  -webkit-transform-origin: 0 50%;
  transform-origin: 0 50%;
  -webkit-transition-property: transform;
  transition-property: transform;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
  -webkit-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
}
.hvr-bounce-to-right2:hover, .hvr-bounce-to-right:focus, .hvr-bounce-to-right:active {
  border-radius: 15px;
  color: white;
}
.hvr-bounce-to-right2:hover:before, .hvr-bounce-to-right:focus:before, .hvr-bounce-to-right:active:before {
  border-radius: 15px;
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
  -webkit-transition-timing-function: cubic-bezier(0.52, 1.64, 0.37, 0.66);
  transition-timing-function: cubic-bezier(0.52, 1.64, 0.37, 0.66);
}
</style>