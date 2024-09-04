<template>
  <div :class="position==ToolLayout.Left?layout_l:layout_r" style="flex: 1;overflow: hidden">
    <div class="full-width" style="flex-grow: 1;overflow: hidden">
      <component :is="toolCtx.component" :btn="toolCtx"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useToolStore} from "@/components/system-components/store/tool";
import {Tool} from "@/components/system-components/model/system";
import {ToolLayout} from "@/components/system-components/model/enum";
import {onMounted, ref, watch} from "vue";
import {useThemeStore} from "@/components/system-components/store/theme";


const tool = useToolStore()
const theme = useThemeStore()
const props = defineProps<{
  toolCtx: Tool
  position: ToolLayout
}>()

let layout_l = ref(['fit', 'column', 'l_tool', 'tool_body'])
let layout_r = ref(['fit', 'column', 'r_tool', 'tool_body'])


watch(() => theme.dark, (value) => {
  let byClassName = document.getElementsByClassName('tool_body');
  if (value) {
    for (let i = 0; i < byClassName.length; i++) {
      byClassName[i].setAttribute("theme", "dark")
    }
  } else {
    for (let i = 0; i < byClassName.length; i++) {
      byClassName[i].setAttribute("theme", "light")
    }
  }
})

onMounted(() => {
  if (theme.dark) {
    let byClassName = document.getElementsByClassName('tool_body');
    for (let i = 0; i < byClassName.length; i++) {
      byClassName[i].setAttribute("theme", "dark")
    }
  }
})

</script>


<style scoped>
.tool_body {
  user-select: none;
}
.l_tool {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}

.r_tool {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.l_tool[theme=dark] {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  border-color: rgba(255, 255, 255, 0.28);
}

.r_tool[theme=dark] {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-color: rgba(255, 255, 255, 0.28);
}


@keyframes wipe-in-down {
  from {
    clip-path: inset(0 0 100% 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

[transition-style="in:wipe:down"] {
  animation: 2.5s cubic-bezier(.25, 1, .30, 1) wipe-in-down both;
}

</style>