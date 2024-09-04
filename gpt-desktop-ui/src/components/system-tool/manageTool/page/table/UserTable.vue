<template>
  <div class="fit column justify-between">
    <!--  条件过滤  -->
    <div class="filter row full-width justify-between" style="padding-bottom:10px;">
      <div class="row" style="padding-top: 10px">
        <el-button text type="danger" size="large">删除</el-button>
      </div>
    </div>
    <!--  表格数据  -->
    <div style="flex-grow: 1" class="full-width column justify-between">
      <el-table :data="roles" border style="width: 100%;height: 90%">
        <el-table-column type="selection" width="55"/>
        <el-table-column fixed prop="name" label="名称"/>
        <el-table-column prop="roleKey" label="键"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column fixed="right" label="操作" align="right">
          <template #default="scope">
            <el-button link size="large" type="warning" @click="open(scope.row.id)">
              <el-icon>
                <span class="icon iconfont jimu-quanxianguanli"></span>
              </el-icon>
            </el-button>
            <el-popconfirm title="确认删除?">
              <template #reference>
                <el-button link size="large" type="danger">
                  <el-icon>
                    <span class="icon iconfont jimu-shanchu"></span>
                  </el-icon>
                </el-button>
              </template>
            </el-popconfirm>
          </template>
          <template #header class="fit">
            <div class="fit row reverse">
              <div class="full-height column justify-center">
                <el-button text type="danger" size="small">删除</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button class="mt-4" plain style="width: 100%" @click="add=true">新增组织角色</el-button>
      </div>
    </div>
    <!--  分页组件  -->
    <div class="row justify-center" style="padding-top: 15px">
      <div class="column justify-center">
        <Pagination v-model:page="page" v-model:size="size" v-model:total="count" @action="action"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useAppStore} from "@/components/system-components/store/app";
import {onMounted, ref, watch} from "vue";
import {Role} from "@/components/system-components/model/system";

import AddToolDialog from "@/components/system-components/tool/manageTool/page/dialog/AddToolDialog.vue";

const app = useAppStore()


const roles = ref<Role[]>([])

const flag = ref(false)

const roleId = ref('')

const page = ref(1)
const size = ref(10)
const count = ref(0)

const add = ref(false)


function open(value: string) {
  roleId.value = value
  flag.value = true
}

function addTool() {
  load(page.value, size.value)
}

/*
* @description: 加载当前组织下所有用户
* */
function load(page: number = 1, size: number = 5) {

}

/*
* @description: 翻页动作
* */
function action(page: number, size: number) {
  // 加载组织下所有角色
  load(page, size)
}


onMounted(() => {
  load()
})

</script>


<style scoped>
.filter > .opt {
  margin-right: 10px;
}
</style>

<style>
.el-tabs__content {
  height: 90%;
}

.el-tab-pane {
  height: 100%;
}
</style>