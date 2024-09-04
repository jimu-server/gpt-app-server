<template>
  <main-page>
    <q-splitter
        v-model="splitterModel"
        :limits="[15,30]"
        class="fit"
    >
      <template v-slot:before>
        <div class="full-width row justify-center">
          <div class="row" style="width: 95%;margin-top: 5px;margin-bottom: 5px">
            <el-input v-model="filterText" size="large" placeholder="过滤"
                      style="width: 100%"/>
          </div>
        </div>
        <q-list>
          <el-tree
              ref="treeRef"
              :data="trees"
              :props="treeProps"
              node-key="entity.id"
              :icon="OrgNodeIcon"
              @node-click="orgClick"
              default-expand-all
              :filter-node-method="filterNode"
              table-layout="auto"
              size="large"
              highlight-current
              :expand-on-click-node="false"
          >
            <template v-slot:default="scope">
              <div class="fit row justify-between">
                <div class="column justify-center">
                  {{ scope.data.entity.name }}
                </div>
                <div v-if="currentOrg.id==scope.data.entity.id" class="column justify-center">
                  <div class="full-width row reverse">
                    <el-button link class="org-opt" type="danger" size="small"
                               @click.stop="delOrg(scope.data.entity.id)">
                      <el-icon>
                        <span class="icon iconfont jimu-shanchu"></span>
                      </el-icon>
                    </el-button>
                    <el-button link class="org-opt" type="warning" size="small">
                      <el-icon>
                        <span class="icon iconfont jimu-bianji1"></span>
                      </el-icon>
                    </el-button>
                    <el-button link class="org-opt" type="primary" @click.stop="addOrg" size="small">
                      <el-icon>
                        <span class="icon iconfont jimu-add"></span>
                      </el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </template>
          </el-tree>
        </q-list>
      </template>

      <template v-slot:after>
        <div class="fit row justify-center" style="overflow: hidden">
          <el-tabs
              v-model="tab"
              style="width: 99%"
              class="full-height"
          >
            <el-tab-pane name="user">
              <template #label>
                <span style="margin-left: 5px">用户</span>
              </template>
              <OrgUserTable :org-id="currentOrg.id"/>
            </el-tab-pane>
            <el-tab-pane label="角色" name="role">
              <OrgRoleTable :org-id="currentOrg.id"/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </q-splitter>
    <AddOrgDialog v-model="addOrgFlag" :org="currentOrg" title="添加组织" @close="done"/>
  </main-page>
</template>
<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import {userStore} from "@/components/system-components/store/user";

import {Org, Tree} from "@/components/system-components/model/system";
import {useAppStore} from "@/components/system-components/store/app";

import {ElMessage} from "element-plus";
import {getOrgChildTree} from "@/components/system-tool/manageTool/manageRequest";
import OrgNodeIcon from "@/components/system-tool/manageTool/icon/OrgNodeIcon.vue";

const user = userStore()
const app = useAppStore()
const splitterModel = ref(15)
const tab = ref('user')
const trees = ref<Tree<Org>[]>([])
const expandedKeys = ref<string[]>([])
const currentOrg = ref(user.info.org)

const filterText = ref('')
const treeRef = ref()
const addOrgFlag = ref(false)

let treeProps = {
  label: function (data, node) {
    return data.entity.name
  },
}

function addOrg() {
  addOrgFlag.value = true
  console.log(currentOrg.value)
}

function done() {
  getOrgChildTree(user.info.org.id).then((data) => {
    trees.value = data
  })
}

function delOrg(value: string) {
  // 不能删除用户当前所选中组织
  if (value == user.info.org.id) {
    ElMessage({
      type: 'warning',
      message: '无法删除当前组织,切换组织后再次尝试',
      plain: true,
      grouping: true
    })
  }

}

/*
* @description: 切换组织机构
* */
function orgClick(data: Tree<Org>) {
  currentOrg.value = data.entity
}


/*
* @description: 初始化页面数据
* */
function init() {
  // 加载组织
  getOrgChildTree(currentOrg.value.id).then((data) => {
    trees.value = data
  })
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: Tree<Org>) => {
  if (!value) return true
  return data.entity.name.includes(value)
}

onMounted(init)
</script>


<style scoped>
.filter > .opt {
  margin-right: 10px;
}

.org-opt {
  margin: 0;
}
</style>

<style>
/*.el-button + .el-button {
  margin-left: 0;
}*/

/*.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: rgb(27, 119, 210);
  color: #fff;
}*/
</style>
