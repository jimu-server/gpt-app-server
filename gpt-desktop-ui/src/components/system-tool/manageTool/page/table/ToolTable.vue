<template>
  <div class="fit column justify-between">
    <!--  条件过滤  -->
    <div class="filter row full-width justify-between" style="padding-bottom:10px;">
      <div class="row" style="padding-top: 10px">

      </div>
    </div>
    <!--  表格数据  -->
    <div style="flex-grow: 1" class="full-width column justify-between">
      <el-table :data="tools" border>
        <el-table-column type="selection" width="55"/>
        <el-table-column fixed prop="name" width="100" label="名称">
          <template #default="scope">
            <div class="fit column justify-center">
              <div class="row">
                <div>
                  <el-icon>
                    <span :class="'icon iconfont '+scope.row.icon"></span>
                  </el-icon>
                </div>
                <div  style="margin-left: 5px">
                  <span>{{ scope.row.name }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" width="100" label="类型">
          <template #default="scope">
            <el-tag>{{ app.get('tool', scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
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
        <el-table-column prop="routerName" width="100" label="路由名称"/>
        <el-table-column label="路由路径" width="100">
          <template #default="scope">
            <el-link>
              {{ scope.row.path }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="component" width="150" label="组件名称">
          <template #default="scope" >
            <el-tooltip  placement="right" :content="scope.row.component">
              <el-tag class="text-white" color="#64b385">
                {{ componentData(scope.row.component) }}
              </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="btn" width="150" label="按钮">
          <template #default="scope">
            <el-tag class="text-white" color="#64b385">
              {{ scope.row.btn }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ws" width="100" label="消息推送">
          <template #default="scope">
            <el-link>{{ scope.row.ws }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="pull" width="100" label="消息拉取">
          <template #default="scope">
            <el-link>{{ scope.row.pull }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="tip" width="100" label="提示"/>
        <el-table-column prop="position" width="100" label="位置">
          <template #default="scope">
            <el-tag>{{ app.get('tool_position', scope.row.position) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="right" width="200">
          <template #default="scope">
            <el-button link  type="primary" @click="open(scope.row.id)">
              <el-icon>
                <span class="icon iconfont jimu-bianji1"></span>
              </el-icon>
              <span style="padding-right: 5px">编辑</span>
            </el-button>
            <el-popconfirm title="确认删除?">
              <template #reference>
                <el-button link  type="danger">
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
        <el-button class="mt-4" plain style="width: 100%;margin-top: 5px" @click="add=true">新增工具</el-button>
      </div>
    </div>
    <!--  分页组件  -->
    <div class="row justify-center" style="padding-top: 15px">
      <div class="column justify-center">
        <Pagination v-model:page="page" v-model:size="size" v-model:total="count" @action="action"/>
      </div>
    </div>
    <AddToolDialog v-model="add" title="添加工具" @close="addTool"/>
  </div>
</template>

<script setup lang="ts">
import {useAppStore} from "@/components/system-components/store/app";
import {onMounted, ref} from "vue";
import {Tool} from "@/components/system-components/model/system";

import AddToolDialog from "@/components/system-tool/manageTool/page/dialog/AddToolDialog.vue";
import {getTools} from "@/components/system-tool/manageTool/manageRequest";


const app = useAppStore()

const tools = ref<Tool[]>([])

const flag = ref(false)

const roleId = ref('')

const page = ref(1)
const size = ref(10)
const count = ref(0)

const add = ref(false)


function componentData(value: string) {
  let number = value.lastIndexOf('/')
  return value.substring(number + 1)
}

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
function load(page: number = 1, size: number = 10) {
  getTools(page, size).then(data => {
    tools.value = data.rows
    count.value = data.count
  })
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
  background: #64b385;
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