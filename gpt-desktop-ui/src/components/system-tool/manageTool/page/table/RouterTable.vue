<template>
  <div class="fit column justify-between">
    <!--  条件过滤  -->
    <div class="filter row full-width justify-between" style="padding-bottom:10px;">
      <div class="row" style="padding-top: 10px">
        <el-select
            v-model="check_tool"
            @change="changeTool"
            value-key="id"
            style="width: 200px"
            placeholder="选择工具"
        >
          <el-option
              v-for="item in tools"
              :key="item.id"
              :label="item.name"
              :value="item"
          >
            <div class="fit column justify-center">
              <div class="row">
                <div>
                  <el-icon>
                    <span :class="'icon iconfont '+item.icon"></span>
                  </el-icon>
                </div>
                <div style="margin-left: 5px">
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </div>
          </el-option>
        </el-select>
      </div>
    </div>
    <!--  表格数据  -->
    <div style="flex-grow: 1" class="full-width column justify-between">
      <el-table
          :data="router"
          border
          row-key="id"
          lazy
          :load="loadChild"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @select="select"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column fixed prop="title" width="200" label="标题" class="row"/>
        <el-table-column prop="name" width="100" label="路由名"/>
        <el-table-column prop="path" width="100" label="路径"/>
        <el-table-column prop="component" width="300" label="组件">
          <template #default="scope">
            <el-tooltip placement="right" :content="scope.row.component">
              <el-tag v-if="scope.row.component!=''" class="text-white" color="#64b385">
                {{ componentData(scope.row.component) }}
              </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="remark" width="100" label="备注"/>
        <el-table-column prop="status" label="状态" width="200px">
          <template #default="scope">
            <el-switch
                v-model="scope.row.status"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #1b77d2; --el-switch-off-color: rgba(158,160,161,0.54)"
                active-text="启用"
                inactive-text="禁用"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="right">
          <template #default="scope">
            <el-button link  type="primary">
              <el-icon>
                <span class="icon iconfont jimu-add"></span>
              </el-icon>
              <span style="padding-right: 5px">添加</span>
            </el-button>
            <el-button link  type="primary">
              <el-icon>
                <span class="icon iconfont jimu-bianji1"></span>
              </el-icon>
              <span style="padding-right: 5px">编辑</span>
            </el-button>
            <el-popconfirm title="确认删除?">
              <template #reference>
                <el-button link size="large" type="danger">
                  <el-icon>
                    <span class="icon iconfont jimu-shanchu"></span>
                  </el-icon>
                  <span style="padding-right: 5px">删除</span>
                </el-button>
              </template>
            </el-popconfirm>
          </template>
          <template #header class="fit">
           操作
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button class="mt-4" plain style="width: 100%" @click="add=true">新增路由</el-button>
      </div>
    </div>
    <!--  分页组件  -->
    <div class="row justify-center" style="padding-top: 15px">
      <div class="column justify-center">
        <Pagination v-model:page="page" v-model:size="size" v-model:total="count" @action="action"/>
      </div>
    </div>
    <AddRouterDialog v-model="add" title="添加路由" @close="addRouter"/>
  </div>
</template>

<script setup lang="ts">
import {useAppStore} from "@/components/system-components/store/app";
import {onMounted, ref} from "vue";
import {Role, Router, Tool} from "@/components/system-components/model/system";
import AddRouterDialog from "@/components/system-tool/manageTool/page/dialog/AddRouterDialog.vue";
import {getToolRouter, getToolRouterChild, getTools} from "@/components/system-tool/manageTool/manageRequest";


const app = useAppStore()


const roles = ref<Role[]>([])
const check_tool = ref<Tool>(null)
const tools = ref<Tool[]>([])
const router = ref<Router[]>([])

const flag = ref(false)


const page = ref(1)
const size = ref(10)
const count = ref(0)

const add = ref(false)


function select(list, row) {

}

function changeTool(value: Tool) {
  load(page.value, size.value)
}

function addRouter() {
  load(page.value, size.value)
}

/*
* @description: 加载当前组织下所有用户
* */
function load(page: number = 1, size: number = 10) {
  getToolRouter('', check_tool.value.id, page, size).then(res => {
    router.value = res.rows
    router.value.forEach(item => {
      if (item.path == "") {
        item.hasChildren = true
        item.children = []
      }
    })
    count.value = res.count
  })
}

function loadChild(row: Router, treeNode, resolve) {
  getToolRouterChild(row.id, check_tool.value.id).then(data => {
    data.forEach(item => {
      if (item.path === '') {
        item.children = []
        item.hasChildren = true
      }
    })
    row.children = data
    resolve(data)
  })
}

/*
* @description: 获取所有的工具列表 当前采用分页 通过 size设置更大的数量来获取更完整的数据 来获取
* */
function loadTool() {
  getTools(1, 100).then(data => {
    tools.value = data.rows
    if (tools.value.length > 0) {
      check_tool.value = tools.value[0]
      load()
    }
  })
}

function componentData(value: string) {
  let number = value.lastIndexOf('/')
  return value.substring(number + 1)
}

/*
* @description: 翻页动作
* */
function action(page: number, size: number) {
  // 加载组织下所有角色
  load(page, size)
}


onMounted(() => {
  loadTool()
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