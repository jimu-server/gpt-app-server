<template>
  <el-sub-menu :index="menu.entity.id">
    <template #title>
      <el-icon v-if="menu.entity.icon!=''">
        <span :class="'icon iconfont '+menu.entity.icon"></span>
      </el-icon>
      <span>{{ menu.entity.title }}</span>
    </template>
    <template v-for="item in menu.children">
      <ElSubMenuLabel v-if="item.children.length > 0" :menu="item"/>
      <ElMenuLabel v-else :menu="item"/>
    </template>
  </el-sub-menu>
</template>

<script setup lang="ts">

import {Router, Tree, WindowLabel} from "@/components/system-components/model/system";
import router from "@/route";
import {useWindowsStore} from "@/components/system-components/store/windows";

const widowsLabel = useWindowsStore()
const props = defineProps<{
  menu: Tree<Router>
}>()


/*
* @description 判断 树元素是不是路由节点
* 子节点为 0 表示 菜单是一个叶子节点点击可以被路由
* */
function isMenu(tree: Tree<Router>) {
  return tree.children.length == 0
}

function addWindows(item: Tree<Router>) {
  if (!isMenu(item)) return
  let win = new WindowLabel(item.entity.path, item.entity.title, item.entity.icon, true)
  widowsLabel.UpdateWindow(win)
  router.push(item.entity.path)
}
</script>


<style scoped>

</style>