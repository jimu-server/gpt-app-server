<template>
  <div class="fit">
    <div class="fit column">
      <div class="full-width column" style="flex-grow: 1;padding: 5px">
        <q-item>
          <q-item-section avatar>
            <el-upload
                ref="uploadRef"
                class="avatar-uploader"
                :show-file-list="false"
                action="http://localhost:8080/api/user/update/avatar"
                method="post"
                :headers="GetHeaders()"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                name="avatar"
            >
              <img :src="user.info.user.picture!=''?user.info.user.picture:imageUrl" class="avatar" alt=""/>
            </el-upload>
          </q-item-section>
          <q-item-section class="column justify-center" style="height: 70px">
            <q-item-label class="column justify-center" style="height: 45%">
              <InfoEditor v-model="userData.name" @save="saveName" style="width: 300px;" :font="'20px'"/>
            </q-item-label>
            <q-item-label class="row" style="height: 40%">
              <div style="font-size: 15px">
                账号:
              </div>
              <div style="font-size: 15px">
                {{ userData.account }}
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="full-width" style="flex-grow: 1">
          <el-tabs id="user-editor" class="fit" type="card" v-model="activate" @tab-change="loadData">
            <el-tab-pane label="基本信息" name="base">
              <el-form>
                <el-form-item label="性别">
                  <el-radio-group v-model="userData.gender" @change="saveGender">
                    <el-radio-button :value="0" label="男"></el-radio-button>
                    <el-radio-button :value="1" label="女"></el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                  <InfoEditor v-model="userData.age" @save="saveAge" style="width: 300px;height: 40px" :font="'15px'"/>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="组织" name="org" style="height: 250px">
              <el-table
                  :data="data"
                  size="small"
                  style="width: 100%"
              >
                <el-table-column
                    label="组织"
                >
                  <template #default="scope">
                    {{ scope.row.name }}
                  </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="角色"

                >
                  <template #default="scope">
                    <el-select
                        v-model="scope.row.role"
                        value-key="id"
                        :teleported="true"
                        @change="saveRole"
                        @click="editRole(scope.row)"
                        popper-class="role-select"
                    >
                      <el-option
                          v-for="item in scope.row.roleList"
                          :key="item.id"
                          :label="item.name"
                          :value="item"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                  <template #default="scope">
                    <div class="fit row justify-end" v-if="user.info.defaultOrg!=scope.row.id">
                      <div>
                        <el-button size="small" text type="primary" @click="saveOrg(scope.row)">设为首选项</el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="账号安全" name="secure">
              <div class="fit" style="padding: 5px">
                <div class="fit">
                  <SecureLabel label="设置密码" :value="secure.password">
                    <template #value="{value}">
                      <template v-if="value==''">
                        未设置
                      </template>
                      <template v-else>
                        以设置
                      </template>
                    </template>
                    <template #button="{value}">
                      <template v-if="value==''">
                        <el-link type="primary">
                          设置密码
                        </el-link>
                      </template>
                      <template v-else>
                        <el-link type="primary" @click="alterPasswd=true">
                          修改密码
                        </el-link>
                      </template>
                    </template>
                  </SecureLabel>
                  <SecureLabel label="绑定手机" :value="secure.phone">
                    <template #value="{value}">
                      <template v-if="value==''">
                        未绑定
                      </template>
                      <template v-else>
                        {{ value }}
                      </template>
                    </template>
                    <template #button="{value}">
                      <template v-if="value==''">
                        <el-link type="primary" @click="setPhone=true">
                          绑定手机
                        </el-link>
                      </template>
                      <template v-else>
                        <el-link type="primary" @click="alterPhone=true">
                          更换手机
                        </el-link>
                      </template>
                    </template>
                  </SecureLabel>
                  <SecureLabel label="绑定邮箱" :value="secure.email">
                    <template #value="{value}">
                      <template v-if="value==''">
                        未绑定
                      </template>
                      <template v-else>
                        {{ value }}
                      </template>
                    </template>
                    <template #button="{value}">
                      <template v-if="value==''">
                        <el-link type="primary" @click="alterEmail=true">
                          绑定邮箱
                        </el-link>
                      </template>
                      <template v-else>
                        <el-link type="primary" @click="alterEmail=true">
                          更换邮箱
                        </el-link>
                      </template>
                    </template>
                  </SecureLabel>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </q-item>
      </div>
    </div>
    <AlterPasswordDialog title="修改密码" v-model="alterPasswd"/>
    <SetPhoneDialog title="绑定手机" v-model="setPhone" @success="phoneSuccess"/>
    <AlterPhoneDialog title="修改手机" v-model="alterPhone" :phone="secure.phone" @success="phoneSuccess"/>
    <AlterEmailDialog title="修改邮箱" v-model="alterEmail" :email="secure.email" @success="emailSuccess"/>
  </div>
</template>
<script setup lang="ts">


import {onMounted, ref, watch} from "vue";
import {userStore} from "@/components/system-components/store/user";
import {ElMessage, UploadProps} from "element-plus";
import InfoEditor from "@/components/system-components/avatar/InfoEditor.vue";
import {
  getSecure,
  getUserJoinOrgRoleList,
  getUserOrgDefaultRole,
  updateUserBaseInfo,
  updateUserOrg,
  updateUserOrgRole
} from "@/components/system-components/request";
import {baseInfo} from "@/components/system-components/utils/userutil";
import {useAppStore} from "@/components/system-components/store/app";
import {Role} from "@/components/system-components/model/system";
import AlterPasswordDialog from "@/components/system-components/avatar/AlterPasswordDialog.vue";
import AlterPhoneDialog from "@/components/system-components/avatar/AlterPhoneDialog.vue";
import SetPhoneDialog from "@/components/system-components/avatar/SetPhoneDialog.vue";
import {GetHeaders} from "@/plugins/axiosutil";

const editUserDialog = ref()
const user = userStore()
const app = useAppStore()
const userData = ref(user.info.user)

const imageUrl = ref(app.defaultAvatar)
const data = ref([])
const activate = ref('base')
const secure = ref({
  password: '',
  phone: '',
  email: '',
})

const alterPasswd = ref(false)
const setPhone = ref(false)
const alterPhone = ref(false)
const alterEmail = ref(false)

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  if (response.code === 200) {
    ElMessage({
      message: "更换成功",
      type: 'success',
      plain: true
    })
  }
  baseInfo()
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage({
      message: '只能上传jpg格式的图片',
      type: 'error',
      plain: true
    })
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage({
      message: '图片大小不能超过2MB',
      type: 'error',
      plain: true
    })
    return false
  }
  return true
}

async function saveName(value) {
  let result = await updateUserBaseInfo({name: value})
  if (result.code === 200) {
    ElMessage({
      message: result.msg,
      type: 'success',
      plain: true,
      appendTo: editUserDialog.value,
      grouping: true
    })
    await baseInfo()
  }
}

async function saveAge(value) {
  value = parseInt(value)
  let result = await updateUserBaseInfo({age: value})
  if (result.code === 200) {
    ElMessage({
      message: result.msg,
      type: 'success',
      plain: true,
      appendTo: editUserDialog.value,
      grouping: true
    })
    await baseInfo()
  }
}

async function saveGender(value) {
  value = parseInt(value)
  let result = await updateUserBaseInfo({gender: value})
  if (result.code === 200) {
    ElMessage({
      message: result.msg,
      type: 'success',
      plain: true,
      grouping: true,
      appendTo: editUserDialog.value,
    })
    await baseInfo()
  }
}


const editOrg = ref<any>()

function editRole(org: any) {
  editOrg.value = org
}

async function saveOrg(value: any) {
  let result = await updateUserOrg(user.info.defaultOrg, value.id)
  if (result.code === 200) {
    ElMessage({
      message: result.msg,
      type: 'success',
      plain: true,
      grouping: true
    })
    await orgInfo()
  }
}

async function saveRole(role: Role) {
  console.log("befor:", editOrg.value.beforRole)
  console.log("after:", role)
  let result = await updateUserOrgRole(editOrg.value.id, editOrg.value.beforRole.id, role.id)
  if (result.code === 200) {
    ElMessage({
      message: result.msg,
      type: 'success',
      plain: true,
      grouping: true
    })
    await orgInfo()
  }
}

function phoneSuccess() {
  ElMessage({
    message: '修改成功',
    type: 'success',
    grouping: true,
    plain: true,
  })
  secureInfo()
  baseInfo()
}


function emailSuccess() {
  console.log(editUserDialog.value)
  ElMessage({
    message: '验证邮件已发送',
    type: 'success',
    plain: true,
    grouping: true,
    appendTo: editUserDialog.value,
  })
}


function destroy() {
}

function loadData(value: string) {
  switch (value) {
    case "org":
      orgInfo()
      break
    case "secure":
      secureInfo()
      break
  }
}

async function orgInfo() {
  data.value = user.info.orgList
  for (const item of data.value) {
    item.roleList = await getUserJoinOrgRoleList(item.id)

    item.role = await getUserOrgDefaultRole(item.id)
    item.beforRole = item.role
  }
}

async function secureInfo() {
  secure.value = await getSecure()
}

async function init() {
  await orgInfo()
  editUserDialog.value = document.getElementById('info-dialog')

}

function close() {
  destroy()
}


onMounted(async () => {
  await init()
})

</script>
<style scoped>
.avatar {
  width: 40px;
  height: 40px;
}


</style>
<style>
.role-select {
  z-index: 99999 !important;
}

#info-dialog > .el-message {
  position: absolute;
  top: 10%;
}
</style>