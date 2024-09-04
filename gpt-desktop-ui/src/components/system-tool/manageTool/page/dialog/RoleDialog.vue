<template>
  <el-dialog
      v-model="model"
      :title="title"
      style="width: 700px;height: 700px"
      draggable
      append-to-body
  >
    <div class="fit column">
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
                        <div class="fit column justify-center">
                          <div class="fit row ">
                            <div class="column justify-center">
                              <el-icon>
                                <span :class="'icon iconfont '+option.icon"></span>
                              </el-icon>
                            </div>
                            <div style="margin-left: 5px" class="column justify-center">{{ option.name }}</div>
                          </div>
                        </div>
                      </template>
                    </el-transfer>
                  </div>
                  <div class="row justify-end" style="margin-top: 5px;margin-bottom: 5px;">
                    <el-button type="primary" @click.stop="saveTool">保存</el-button>
                    <el-button @click.stop="model=false">取消</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="路由权限" name="rout">
              <div class=" fit row justify-center pans ">
                <div class="fit column justify-between">
                  <div class="row" style="margin-bottom: 10px">
                    <!--     根据选择的角色加载对应角色的工具    -->
                    <el-select
                        ref="routToolRef"
                        v-model="route_tool_check"
                        @change="routeToolChange"
                        :teleported="false"
                        value-key="id"
                        size="large"
                        style="width: 200px"
                        placeholder="选择工具"
                    >
                      <el-option
                          v-for="item in tools"
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
                      />
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
import {onMounted, ref, watch} from "vue";
import {Role, Tool} from "@/components/system-components/model/system";
import {
  getOrgUserToolRouter,
  OrgRoleTool,
  OrgRoleToolAuth,
  OrgRoleToolRouter,
  OrgRoleToolRouterAuth
} from "@/components/system-tool/manageTool/manageRequest";
import {userStore} from "@/components/system-components/store/user";
import {useToolStore} from "@/components/system-components/store/tool";
import {
  computingAuthorization,
  getIds,
  getTreeRootNodeIds,
  initializeElTree
} from "@/components/system-tool/utils";
import {ElMessage} from "element-plus";

const user = userStore()
const tool = useToolStore()
const props = defineProps<{
  orgId: string,
  roleId: string
  title: string
}>()


// 业务属性-------------------------------------------------------------------------------------------------------------------------------------

// ref
const routToolRef = ref()
const routeToolTreeRef = ref()


// tabs 选中项
const activeName = ref('tool')

// 工具授权选中角色
const tool_role = ref<Role>()
// tools 当前角色已授权的工具
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
// tree 的所有根根节点id
const default_checked_keys = ref<string[]>([])
const root_ids = ref<string[]>([])

let rootTreeProps = {
  label: function (data, node) {
    return data.title
  },

}


/*
* @description: 面板切换事件,是否触发数据更新
* */
function change(value: string) {

}


/*
* @description: 获取当前角色已授权的工具
* */
function getRoleTool() {
  OrgRoleTool(props.orgId, props.roleId).then(data => {
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
* @description: 获取当前被设置用户对应工具栏下的所有已授权路由
* */
function getRoleToolRouter() {
  OrgRoleToolRouter(props.orgId, props.roleId, route_tool_check.value.id).then(data => {
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
  getRoleTool()
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

}


/*
* @description: 工具栏选中事件,加载工具栏对应的所有路由列表
* */
function routeToolChange(value: Tool) {
  // 加载当前用户可以给角色授权的路由列表
  getOrgUserToolRouter(user.info.org.id, user.info.user.id, user.info.role.id, value.id).then(data => {
    current_tool_router.value = initializeElTree(data)
    current_tool_router_ids.value = getIds(data)
    // 获取当前操作角色已授权的路由列表
    getRoleToolRouter()
  })

}

/*
* @description: 保存工具栏授权
* */
async function saveTool() {
  let {auth_ids, unauth_ids} = computingAuthorization(tools_check_before.value, tools_check_after.value)
  console.log("当前添加授权:", auth_ids)
  console.log("当前取消授权:", unauth_ids)
  let result = await OrgRoleToolAuth(props.orgId, props.roleId, [...auth_ids], [...unauth_ids])
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '授权成功',
      plain: true,
      duration: 1000
    })
    getRoleTool()
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
  console.log("当前添加授权:", auth_ids)
  console.log("当前取消授权:", unauth_ids)
  let result = await OrgRoleToolRouterAuth(props.orgId, props.roleId, route_tool_check.value.id, [...auth_ids], [...unauth_ids]);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '授权成功',
      plain: true,
      duration: 1000
    })
    // 更新数据
    getRoleToolRouter()
  }
}

// 对话框属性 ----------------------------------------------------------------------------------------------------------------------------------
const roleCard = ref()
const dialogDom = ref<HTMLElement>()
const tempX = ref(0)
const tempY = ref(0)
// 判断当前的用户是否为当前登陆用户,如果是则禁止修改任何数据
const model = defineModel({required: true, default: false})

const handleDrag = (event) => {
  roleCard.value.$el.style.transform = `translate(${tempX.value + event.offset.x}px, ${tempY.value + event.offset.y}px)`;
  if (event.isFinal) {
    tempX.value += event.offset.x
    tempY.value += event.offset.y
  }
}

function init() {

  // 初始化数据
  getRoleTool()
  tool_buttons.value = []
  tool.buttons.forEach(item => {
    tool_buttons.value.push({
      ...item,
    })
  })

}


function destroy() {
  tool_role.value = {}
  tools_check_after.value = []
  current_tool_router.value = []
  route_tool_check.value = null
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

</style>