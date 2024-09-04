<template>
  <div class="fit column">
    <div v-if="!collapse" class="ellipsis full-width" style="padding: 5px">
      {{ btn.name }}
    </div>
    <div v-else class="full-width row justify-center">
      <el-icon class="row justify-center" size="56px" style="padding: 0 5px">
        <span class="iconfont jimu-caidan1 fit row justify-center"></span>
      </el-icon>
    </div>
    <div class="full-width" style="flex-grow: 1">
      <ElMenuTree
          :collapse="collapse"
          :menus="tree"
      />
    </div>
    <div class="full-width row justify-center">
      <el-button text style="width: 98%" @click="onCollapse">
        <el-icon>
          <span :class="collapse?'iconfont jimu-arrow-double-right':'iconfont jimu-arrow-double-left'"></span>
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {Router, Tool, Tree} from "@/components/system-components/model/system";
import {useToolStore} from "@/components/system-components/store/tool";
import ElMenuTree from "@/components/system-tool/manageTool/menu/ElMenuTree.vue";


const props = defineProps<{
  btn: Tool
}>()
const tool = useToolStore()
const tree = ref<Tree<Router>[]>(tool.buttons_router[props.btn.id])
const collapse = ref(false)

function onCollapse() {
  collapse.value = !collapse.value
  if (collapse.value) {
    tool.alterWidth(tool.left, 67)
  } else {
    tool.alterWidth(tool.left, 243)
  }
}


</script>


<style scoped>

</style>
<style>
.el-menu{
  border-style: none !important;
}
</style>