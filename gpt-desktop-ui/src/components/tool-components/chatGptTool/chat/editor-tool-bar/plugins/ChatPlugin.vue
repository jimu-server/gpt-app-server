<template>
  <div>
    <div class="row justify-between">
      <div>
        <q-chip
            size="md"
            :icon="plugin.currentPlugin.icon"
            style="cursor: default;user-select: none"
            :color="toggleColer"
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

</style>