<template>
  <main-page>
    <div class=" fit column justify-between"
         style="padding: 5px"
    >
      <!--  条件过滤  -->
      <div class="filter column full-width justify-between" style="padding-bottom:10px;">
        <div class="row justify-between">
          <div class="row ">
            <el-input class="opt" v-model="filter.account" style="width: 140px" placeholder="账号"/>
            <el-input class="opt" v-model="filter.name" style="width: 140px" placeholder="昵称"/>
            <el-select class="opt" v-model="filter.gender" label="状态" value-key="value"
                       style="width: 80px"
            >
              <el-option
                  v-for="item in genderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item">
              </el-option>
            </el-select>
            <el-input class="opt" v-model="filter.phone" style="width: 140px" placeholder="手机"/>
            <el-input class="opt" v-model="filter.email" style="width: 240px" placeholder="邮箱"/>
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
        <el-table :data="users" border style="width: 100%;height: 90%">
          <el-table-column type="selection" width="55"/>
          <el-table-column fixed prop="account" label="账号" width="100px"/>
          <el-table-column prop="name" label="昵称" width="100"/>
          <el-table-column prop="gender" label="性别" width="100px">
            <template #default="scope">
              {{ app.get('user', scope.row.gender) }}
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机" width="200px"/>
          <el-table-column prop="email" label="邮箱" width="200px"/>
          <el-table-column fixed="right" label="操作" align="right">
            <template #default="scope">
              <div class="row justify-end">
                <el-button text type="primary">
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
                  </template>
                </el-popconfirm>
              </div>
            </template>
            <template #header class="fit">
              操作
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--  分页组件  -->
      <div class="row justify-center" style="padding-top: 15px">
        <div class="column justify-center">
          <Pagination v-model:page="page" v-model:size="size" :total="count" @action="action"/>
        </div>
      </div>
    </div>
  </main-page>
</template>
<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import {userStore} from "@/components/system-components/store/user";
import {Org, Tree, User} from "@/components/system-components/model/system";
import {useAppStore} from "@/components/system-components/store/app";
import {getUserList} from "@/components/system-tool/manageTool/manageRequest";

const user = userStore()
const app = useAppStore()
// 用户当前组织
const currentOrg = ref(user.info.org)
const users = ref<User[]>([])

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

let genderOptions = [
  {value: 0, label: '男'},
  {value: 1, label: '女'},
]


const page = ref(1)
const size = ref(10)
const count = ref(0)

/*
* @description: 翻页动作
* */
function action(page: number, size: number) {
  // 加载组织下所有角色
  load(page, size)
}

/*
* @description: 加载当所有用户
* */
function load(page: number = 1, size: number = 5) {
  getUserList(page, size).then(data => {
    users.value = data.rows
    count.value = data.count
  })
}

/*
* @description: 初始化页面数据
* */
function init() {
  load()
}


const filterNode = (value: string, data: Tree<Org>) => {
  if (!value) return true
  return data.entity.name.includes(value)
}

onMounted(init)
</script>


<style scoped>
.filter .opt {
  margin-right: 10px;
}
</style>
<style>
.el-tree {
  --el-tree-node-content-height: 40px;
}

.el-checkbox__inner, .el-checkbox__inner {
  transition: none !important;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  transition: none !important;
}

.el-table--enable-row-transition .el-table__body td.el-table__cell {
  transition: none !important;
}
</style>