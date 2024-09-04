<template>
  <el-menu
      :collapse="collapse"
      :collapse-transition="false"
      style="user-select: none">
    <template v-for="item in menus">
      <ElSubMenuLabel v-if="item.children.length>0" :menu="item"/>
      <ElMenuLabel v-else :menu="item"/>
    </template>
  </el-menu>
</template>
<script setup lang="ts">
import {Router, Tree} from "@/components/system-components/model/system";
import ElSubMenuLabel from "@/components/system-tool/manageTool/menu/ElSubMenuLabel.vue";
import ElMenuLabel from "@/components/system-tool/manageTool/menu/ElMenuLabel.vue";


const props = defineProps<{
  menus: Tree<Router>[]
  collapse: boolean
}>()
</script>


<style scoped>

</style>