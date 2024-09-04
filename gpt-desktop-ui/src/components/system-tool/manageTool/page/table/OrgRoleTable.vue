<template>
  <div class="fit column justify-between">
    <!--  条件过滤  -->
    <div class="filter column full-width justify-between" style="padding-bottom:10px;">
      <div class="row justify-between">
        <div class="row ">
          <el-input class="opt" v-model="filter.account" style="width: 140px"  placeholder="角色"/>
        </div>
        <div>
          <el-button text type="primary">
            <el-icon>
              <span class="icon iconfont jimu-chaxun"></span>
            </el-icon>
            <div style="margin-left: 5px">
              查询
            </div>
          </el-button>
          <el-button text type="danger">
            <div>
              <el-icon>
                <span class="icon iconfont jimu-shanchu"></span>
              </el-icon>
            </div>
            <div style="margin-left: 5px">
              删除
            </div>
          </el-button>
        </div>
      </div>
    </div>
    <!--  表格数据  -->
    <div style="flex-grow: 1" class="full-width column justify-between">
      <el-table :data="roles" border style="width: 100%;height: 90%">
        <el-table-column type="selection" width="55"/>
        <el-table-column fixed prop="name" label="名称"/>
        <el-table-column prop="roleKey" label="键"/>
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
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column fixed="right" label="操作" align="right">
          <template #default="scope">
            <el-button link type="primary" @click="open(scope.row.id)">
              <div>
                <el-icon>
                  <span class="icon iconfont jimu-bianji1"></span>
                </el-icon>
              </div>
              <div style="margin-left: 5px">
                编辑
              </div>
            </el-button>
            <el-popconfirm title="确认删除?">
              <template #reference>
                <el-button link type="danger">
                  <div>
                    <el-icon>
                      <span class="icon iconfont jimu-shanchu"></span>
                    </el-icon>
                  </div>
                  <div style="margin-left: 5px">
                    删除
                  </div>
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
        <el-button class="mt-4" plain style="width: 100%" @click="add=true">新增组织角色</el-button>
      </div>
    </div>
    <!--  分页组件  -->
    <div class="row justify-center" style="padding-top: 15px">
      <div class="column justify-center">
        <Pagination v-model:page="page" v-model:size="size" v-model:total="count" @action="action"/>
      </div>
    </div>
    <RoleDialog v-model="flag" :org-id="orgId" :role-id="roleId" title="角色权限配置"/>
    <AddOrgRoleDialog v-model="add" title="添加角色" :org-id="orgId" @close="addRole"/>
  </div>
</template>

<script setup lang="ts">
import {useAppStore} from "@/components/system-components/store/app";
import {onMounted, ref, watch} from "vue";
import {Role} from "@/components/system-components/model/system";
import {getOrgRoleList} from "@/components/system-components/request";

import AddOrgRoleDialog from "@/components/system-tool/manageTool/page/dialog/AddOrgRoleDialog.vue";

const app = useAppStore()

const props = defineProps({
  orgId: {
    type: String,
    required: true
  }
})

const roles = ref<Role[]>([])

const flag = ref(false)

const roleId = ref('')

const page = ref(1)
const size = ref(10)
const count = ref(0)

const add = ref(false)
const filter = ref({
  account: '',
  name: '',
  gender: {
    value: 0,
    label: '男'
  },
  phone: '',
  email: '',
})

function open(value: string) {
  roleId.value = value
  flag.value = true
}

function addRole() {
  load(page.value, size.value)
}

/*
* @description: 加载当前组织下所有用户
* */
function load(page: number = 1, size: number = 10) {
  getOrgRoleList(props.orgId, page, size).then(data => {
    roles.value = data.rows
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

watch(() => props.orgId, (value) => {
  load()
})

onMounted(() => {
  load()
})

</script>


<style scoped>
.filter .opt {
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