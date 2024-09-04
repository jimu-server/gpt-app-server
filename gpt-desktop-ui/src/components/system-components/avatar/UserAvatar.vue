<template>
  <q-avatar size="30px" style="user-select:none;">
    <img :src="user.info.user.picture!=''?user.info.user.picture:app.defaultAvatar" alt=""/>
    <q-menu
        anchor="top right" self="top left"
        style="width: 300px;"
    >
      <q-card
          class="fit column"
      >
        <q-item style="height: 20%">
          <q-item-section avatar>
            <img :src="user.info.user.picture!=''?user.info.user.picture:app.defaultAvatar" class="avatar" alt=""/>
            <!--            <el-upload
                            ref="uploadRef"
                            class="avatar-uploader"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            style="width: 40px; height: 40px;"
                            :auto-upload="false"
                        >
                          <img src="https://im-1252940994.cos.ap-nanjing.myqcloud.com/go.jpg" class="avatar" alt=""/>
                          &lt;!&ndash;              <el-icon v-else class="avatar-uploader-icon">
                                          <Plus/>
                                        </el-icon>&ndash;&gt;
                        </el-upload>-->
          </q-item-section>
          <q-item-section>
            <q-item-label class="row" style="font-size: 20px;user-select: none">
              {{ user.info.user.name }}
              <!--              <q-popup-edit v-model="text" :validate="val => val.length <= 10" v-slot="scope">
                              <q-input
                                  autofocus
                                  dense
                                  v-model="scope.value"
                                  hint="Your nickname"
                                  :rules="[val => scope.validate(val) || 'More than 5 chars required']"
                                  spellcheck="false"
                              >
                                <template v-slot:after>
                                  <q-btn
                                      flat dense color="negative" icon="cancel"
                                      @click.stop="scope.cancel"
                                  />
                                  <q-btn
                                      flat dense color="positive" icon="check_circle"
                                      :disable="scope.validate(scope.value) === false || scope.initialValue === scope.value"

                                  />
                                </template>
                              </q-input>
                            </q-popup-edit>-->
            </q-item-label>
            <q-item-label class="row">
              <div style="font-size: 15px">
                账号:
              </div>
              <div style="font-size: 15px">
                {{ user.info.user.account }}
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
        <div class="full-width" style="flex-grow: 1">
          <div class="fit row justify-center" style="overflow: hidden">
            <div style="width: 90%">
              <el-select
                  v-model="user.info.org"
                  value-key="id"
                  :teleported="false"
                  @change="changeOrg"
                  size="large"
                  style="margin-bottom: 10px"
              >
                <el-option
                    v-for="item in user.info.orgList"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                />
              </el-select>
              <el-select
                  v-model="user.info.role"
                  @change="changeRole"
                  value-key="id"
                  :teleported="false"
                  size="large"
                  style="margin-bottom: 10px"
              >
                <el-option
                    v-for="item in user.info.roleList"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                />
              </el-select>
            </div>

          </div>
        </div>
        <div class="row justify-center" style="margin-bottom: 20px">
          <el-button @click="edit=true" style="width: 90%;height: 100%" text v-close-popup>
            编辑资料
          </el-button>
        </div>
      </q-card>
    </q-menu>
    <UserInfoEditorDialog title="编辑资料" v-model="edit"/>
  </q-avatar>
</template>

<script setup lang="ts">


import {onMounted, ref} from 'vue'
import type {UploadInstance} from 'element-plus'

import {userStore} from "@/components/system-components/store/user";
import {getUserJoinOrgRoleList, getUserOrgDefaultRole} from "@/components/system-components/request";
import {Org, Role} from "@/components/system-components/model/system";
import emitter from "@/plugins/event";
import {UpdateAuthEvent} from "@/plugins/evenKey";
import UserInfoEditorDialog from "@/components/system-components/avatar/UserInfoEditorDialog.vue";
import {useAppStore} from "@/components/system-components/store/app";

const user = userStore()
const app = useAppStore()

const text = ref()
const uploadRef = ref<UploadInstance>(null)
const edit = ref(false)


async function changeOrg(value: Org) {
  // todo 更新当前选择组织的默认角色列表
  user.info.roleList = await getUserJoinOrgRoleList(value.id)
  // todo 更新当前选择组织的默认选中角色
  user.info.role = await getUserOrgDefaultRole(value.id)
  emitter.emit(UpdateAuthEvent)
}

function changeRole(value: Role) {
  emitter.emit(UpdateAuthEvent)

}


onMounted(() => {

})


</script>


<style scoped>
.avatar {
  width: 40px;
  height: 40px;
}


</style>