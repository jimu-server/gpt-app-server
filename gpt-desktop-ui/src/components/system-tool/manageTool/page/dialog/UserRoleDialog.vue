<template>
  <el-dialog
      v-model="model"
      :title="title"
      draggable
      append-to-body
      style="max-width:100vw;width: 700px;height: 700px"
  >
    <div class="fit column">
      <div class="full-width row" style="padding-left: 10px">
        <div class="column justify-center" style="margin-right: 10px;">
          角色授权
        </div>
        <!--   根据当前登陆者可操作的角色范围,给当前用户进行角色授权    -->
        <el-select
            v-model="roles"
            value-key="id"
            placeholder="选择"
            multiple
            :teleported="false"
            :disabled="current"
            size="large"
            style="width: 50%"
        >
          <el-option
              v-for="item in user.info.roleList"
              :key="item.id"
              :label="item.name"
              :value="item"
          >
            <template #default>
              <div class="fit row justify-between" style="padding-right: 5px">
                <span>{{ item.name }}</span>
                <div @click.stop>
                  <el-switch
                      v-model="item.status"
                      class="ml-2"
                      inline-prompt
                      style="--el-switch-on-color: #1b77d2; --el-switch-off-color: rgba(158,160,161,0.54)"
                      active-text="启用"
                      inactive-text="禁用"
                  />
                </div>
              </div>
            </template>
          </el-option>
        </el-select>
        <div>
          <el-button v-if="check_roles" plain type="primary" size="large" @click.stop="addUserAuthRole"
                     style="margin-left: 10px">保存
          </el-button>
        </div>
      </div>
      <!--   授权面板     -->
      <div class="full-width" style="flex-grow: 1;padding: 5px">
        <div class="full-width row justify-center">
          <el-tabs
              v-model="activeName"
              @tab-change="change"
              style="width: 90%"
          >
            <el-tab-pane label="工具权限" name="tool">
              <div class=" fit row justify-center pans ">
                <div class="fit column justify-between">
                  <div style="margin-bottom: 10px">
                    <!--  选择用户已授权的角色,对对应的工具进行路由授权  -->
                    <el-select
                        ref="toolRef"
                        :teleported="false"
                        v-model="tool_role"
                        @change="toolRoleChange"
                        value-key="id"
                        size="large"
                        style="width: 200px;"
                        placeholder="选择角色"
                    >
                      <el-option
                          v-for="item in roles_after"
                          :key="item.id"
                          :label="item.name"
                          :value="item"
                      />
                    </el-select>
                  </div>
                  <div class="row justify-center" style="flex-grow: 1">
                    <el-transfer
                        v-model="tools_check_after"
                        filterable
                        filter-placeholder="State Abbreviations"
                        :data="tool_buttons"
                        :titles="['可授权', '已授权']"
                        :props="{key:'id'}"
                        style="width: 100%"
                    >
                      <template #default="{option}">
                        <div class="column justify-center">
                          <div class="full-width row justify-between">
                            <div class="row">
                              <div class="column justify-center">
                                <el-icon>
                                  <span :class="'icon iconfont '+option.icon"></span>
                                </el-icon>
                              </div>
                              <div style="margin-left: 2px" class="column justify-center">{{ option.name }}</div>
                            </div>
                            <div style="padding-right: 10px">
                              <el-switch
                                  v-model="option.status"
                                  class="ml-2"
                                  inline-prompt
                                  style="--el-switch-on-color: #1b77d2; --el-switch-off-color: rgba(158,160,161,0.54)"
                                  active-text="启用"
                                  inactive-text="禁用"
                              />
                            </div>
                          </div>
                        </div>
                      </template>
                    </el-transfer>
                  </div>
                  <div class="row justify-end" style="margin-top: 5px;margin-bottom: 5px">
                    <el-button type="primary" :disabled="current" @click.stop="saveTool">保存</el-button>
                    <el-button @click.stop="model=false">取消</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="路由权限" name="rout">
              <div class=" fit row justify-center pans ">
                <div class="fit column justify-between">
                  <div class="row" style="margin-bottom: 10px">
                    <!--  路由权限的角色选择来自 当前操作用户已授权的角色  -->
                    <el-select
                        ref="routRoleRef"
                        :teleported="false"
                        v-model="route_role"
                        @change="routeRoleChange"
                        clearable
                        value-key="id"
                        size="large"
                        style="width: 200px;"
                        placeholder="选择角色"
                    >
                      <el-option
                          v-for="item in roles_after"
                          :key="item.id"
                          :label="item.name"
                          :value="item"
                      />
                    </el-select>
                    <!--     根据选择的角色加载对应角色的工具    -->
                    <el-select
                        ref="routToolRef"
                        v-model="route_tool_check"
                        @change="routeToolChange"
                        :teleported="false"
                        value-key="id"
                        size="large"
                        style="width: 200px; margin-left: 10px"
                        placeholder="选择工具"
                    >
                      <el-option
                          v-for="item in route_tools"
                          :key="item.id"
                          :label="item.name"
                          :value="item"
                      />
                    </el-select>
                  </div>
                  <div class="row justify-center" style="flex-grow: 1">
                    <q-scroll-area class="fit">
                      <el-tree
                          ref="routeToolTreeRef"
                          :data="current_tool_router"
                          :props="rootTreeProps"
                          node-key="id"
                          show-checkbox
                          :default-checked-keys="default_checked_keys"
                      >
                        <template #default="{node,data}">
                          <div class="fit row justify-between">
                            <div class="column full-height justify-center">
                              <div>
                                <el-icon>
                                  <span :class="'icon iconfont '+data.icon"></span>
                                </el-icon>
                              </div>
                              <div style="margin-left: 5px">{{ node.label }}</div>
                            </div>
                            <div class="column full-height justify-center" style="padding-right: 5px" @click.stop>
                              <el-switch
                                  v-model="data.status"
                                  class="ml-2"
                                  inline-prompt
                                  style="--el-switch-on-color: #1b77d2; --el-switch-off-color: rgba(158,160,161,0.54)"
                                  active-text="启用"
                                  inactive-text="禁用"
                              />
                            </div>
                          </div>
                        </template>
                      </el-tree>
                    </q-scroll-area>
                  </div>
                  <div class="row justify-end" style="margin-top: 5px;margin-bottom: 5px">
                    <el-button type="primary" @click.stop="saveRouter">保存</el-button>
                    <el-button @click.stop="model=false">取消</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="功能权限" name="fun" class="fit">

            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {Role, Tool, User} from "@/components/system-components/model/system";
import {
  getOrgUserRole,
  getOrgUserTool,
  getOrgUserToolRouter,
  OrgRoleTool,
  OrgRoleToolRouter,
  OrgUserAuthRole,
  OrgUserAuthTool,
  OrgUserAuthToolRouter
} from "@/components/system-tool/manageTool/manageRequest";
import {userStore} from "@/components/system-components/store/user";
import {useToolStore} from "@/components/system-components/store/tool";
import {
  computingAuthorization,
  getIds,
  getTreeRootNodeIds, getUserRouterAuthMapping,
  initializeElTree
} from "@/components/system-tool/utils";
import {ElMessage} from "element-plus";

const user = userStore()
const tool = useToolStore()
const props = defineProps<{
  userInfo: User,
  orgId: string,
  title: string
}>()


// 业务属性-------------------------------------------------------------------------------------------------------------------------------------

// ref
const toolRef = ref()
const routRoleRef = ref()
const routToolRef = ref()
const routeToolTreeRef = ref()


// tabs 选中项
const activeName = ref('tool')
// roles 当前用户已授权的角色
const roles = ref<Role[]>([])
const roles_before = ref<Role[]>([])
// roles 已提交的授权角色
const roles_after = ref<Role[]>([])
// 工具授权选中角色
const tool_role = ref<Role>()
// tools 当前用户已授权的工具
const tools = ref<Tool[]>([])

const tool_buttons = ref<any[]>([])

// 穿梭框选中的工具栏值 (已授权的工具)
const tools_check = ref<string[]>([])
// 穿梭框选中之前的 工具栏值
const tools_check_before = ref<string[]>([])
// 穿梭框选中之后的 工具栏值
const tools_check_after = ref<string[]>([])


// route_tools 当前用户选中待授权路由的角色
const route_role = ref<Role>()
// route_tools 当前用户选中待授权路由的工具
const route_tools = ref<Tool[]>([])
const route_tool_check = ref<Tool>()
// 当前登陆者 对应选择的工具 所有的工具路由列表
const current_tool_router = ref<any[]>()
const current_tool_router_ids = ref<string[]>()

// 当前操作用户的对应工具路由已经被授权的数据
const route_tool_auth_check_before = ref<string[]>([])
const route_tool_auth_check_after = ref<string[]>([])
// tree 的所有根根节点id
const default_checked_keys = ref<string[]>([])
const RouterAuthMapping = ref<Map<string, boolean>>()
const root_ids = ref<string[]>([])

let rootTreeProps = {
  label: function (data, node) {
    return data.title
  },
  disabled: function (data, node) {
    return current.value
  }
}


/*
* @description: 面板切换事件,是否触发数据更新
* */
function change(value: string) {

}


/*
* @description: 判断角色是否有权限变动,权限有变动,需要显示保存按钮进行提交
* */
const check_roles = computed(() => {
  let flag = roles_before.value.length !== roles.value.length
  if (flag) {
    return flag
  }
  // 如果长度相等
  for (let i = 0; i < roles_before.value.length; i++) {
    if (roles_before.value[i].id !== roles.value[i].id) {
      return true
    }
  }
  return flag
})

async function addUserAuthRole() {
  let {auth_ids, unauth_ids} = computingAuthorization(roles_before.value, roles.value);
  // 确保auth_ids 与 unauth_ids 授权之后用户必须要保留一个角色
  if (roles.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '至少保留一个角色授权',
      plain: true
    })
    return
  }
  let auths = []
  let unAutn = []
  auth_ids.forEach(item => {
    auths.push(item.id)
  })
  unauth_ids.forEach(item => {
    unAutn.push(item.id)
  })
  let result = await OrgUserAuthRole(props.orgId, props.userInfo.id, auths, unAutn)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '授权成功',
      plain: true,
      duration: 1000
    })
    roles_before.value = roles.value
    route_role.value = null
    getUserRole()
  }
}


function getUserRole() {
  getOrgUserRole(props.orgId, props.userInfo.id).then(data => {
    roles.value = data
    roles_before.value = data
    roles_after.value = data
    // 设置默认选中项
    if (data.length > 0) {
      tool_role.value = data[0]
      getOrgRoleTool()
      getUserTool()
    }
  })
}


/*
* @description: 获取当前角色已授权的工具列表
* */
function getOrgRoleTool() {
  OrgRoleTool(props.orgId, tool_role.value.id).then(data => {
    tool_buttons.value = []
    data.forEach(item => {
      tool_buttons.value.push({
        ...item,
        disabled: current.value
      })
    })
    console.log(tool_buttons.value)
  })
}


/*
* @description: 获取当前用户已授权的工具
* */
function getUserTool() {
  getOrgUserTool(props.orgId, props.userInfo.id, tool_role.value.id).then(data => {
    tools.value = data
    tools_check.value = []
    data.forEach(item => {
      tools_check.value.push(item.id)
    })
    tools_check_before.value = tools_check.value
    tools_check_after.value = tools_check.value
  })
}

/*
* @description: 获取路由授权的工具下拉框选项
* */
function getUserRouterTool() {
  getOrgUserTool(props.orgId, props.userInfo.id, route_role.value.id).then(data => {
    route_tool_check.value = null
    current_tool_router.value = []
    route_tools.value = data
  })
}


/*
* @description: 获取当前被设置用户对应工具栏下的所有已授权路由
* */
function getUserAuthToolRouter() {
  getOrgUserToolRouter(props.orgId, props.userInfo.id, route_role.value.id, route_tool_check.value.id).then(data => {
    let ids = getIds(data)
    data = initializeElTree(data)
    // 筛选出根节点id
    root_ids.value = getTreeRootNodeIds(data)
    // 默认选中的 keys 不能包含根节点id
    default_checked_keys.value = ids.filter(item => !root_ids.value.includes(item))
    // 记录初始的授权状态
    route_tool_auth_check_before.value = ids
  })
}


function toolRoleChange(value: Role) {
  getOrgRoleTool()
  getUserTool()
}

function routeRoleChange(value: Role) {
  // 路由授权角色变更,取消当前的默认选择信息
  default_checked_keys.value = []
  // 清空路由树的数据
  current_tool_router.value = []
  // 清空工具选项
  route_tool_check.value = null
  // 清空角色对应工具栏选项
  route_tools.value = []
  getUserRouterTool()
}

/*
* @description: 工具栏选中事件,加载工具栏对应的所有路由列表
* */
function routeToolChange(value: Tool) {
  // 获取组织角色 对应工具栏 对应角色已授权的路由
  OrgRoleToolRouter(props.orgId, route_role.value.id, value.id).then(data => {
    current_tool_router.value = initializeElTree(data)
    console.log("router : ", current_tool_router.value)
    current_tool_router_ids.value = getIds(data)
    // 获取当前操作用户对应授权的路由
    getUserAuthToolRouter()
  })
}

/*
* @description: 保存工具栏授权
* */
async function saveTool() {
  let {auth_ids, unauth_ids} = computingAuthorization(tools_check_before.value, tools_check_after.value)
  // console.log("当前添加授权:", auth_ids)
  // console.log("当前取消授权:", unauth_ids)
  let result = await OrgUserAuthTool(props.orgId, props.userInfo.id, tool_role.value.id, [...auth_ids], [...unauth_ids])
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '授权成功',
      plain: true,
      duration: 1000
    })
    getUserTool()
  }
}

/*
* @description: 保存路由栏授权
* */
async function saveRouter() {
  let after = routeToolTreeRef.value.getCheckedNodes(false, true)
  let after_ids = []
  after.forEach(item => {
    after_ids.push(item.id)
  })
  let {auth_ids, unauth_ids} = computingAuthorization(route_tool_auth_check_before.value, after_ids)
  // console.log("当前添加授权:", auth_ids)
  // console.log("当前取消授权:", unauth_ids)
  let result = await OrgUserAuthToolRouter(props.orgId, props.userInfo.id, route_role.value.id, route_tool_check.value.id, [...auth_ids], [...unauth_ids]);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '授权成功',
      plain: true,
      duration: 1000
    })
    // 更新数据
    getUserAuthToolRouter()
  }
}

// 对话框属性 ----------------------------------------------------------------------------------------------------------------------------------
const userRoleCard = ref()
const dialogDom = ref<HTMLElement>()
const tempX = ref(0)
const tempY = ref(0)
// 判断当前的用户是否为当前登陆用户,如果是则禁止修改任何数据
const current = ref(props.userInfo.id == user.info.user.id)
const model = defineModel({required: true, default: false})

const handleDrag = (event) => {
  userRoleCard.value.$el.style.transform = `translate(${tempX.value + event.offset.x}px, ${tempY.value + event.offset.y}px)`;
  if (event.isFinal) {
    tempX.value += event.offset.x
    tempY.value += event.offset.y
  }
}

function init() {
  current.value = props.userInfo.id == user.info.user.id
  console.log(current.value)
  // 初始化数据
  setTimeout(() => {
    getUserRole()
  }, 100)
}


function destroy() {
  roles.value = []
  tool_role.value = {}
  tools_check_after.value = []
  route_tool_auth_check_after.value = []
  current_tool_router.value = []
  route_tool_check.value = null
  current.value = false
  route_role.value = null
  route_tool_check.value = null
  default_checked_keys.value = []
}

function clear() {
  tempX.value = 0;
  tempY.value = 0;
  destroy()
}

/*
* @description: 用于监听对话框打开状态,初始化对话框数据
* */
watch(model, (newVal) => {
  if (newVal === false) {
    clear()
  } else {
    init()
  }
})

onMounted(() => {
  dialogDom.value = document.getElementById('dialog')
})


</script>
<style scoped>
.pans {
  height: 500px !important;
}
</style>

<style>
.el-transfer-panel__list{
  width: 100%!important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.el-transfer-panel__item {
  width: 100%;
}
</style>