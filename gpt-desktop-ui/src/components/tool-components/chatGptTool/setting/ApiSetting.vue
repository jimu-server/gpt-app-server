<template>
  <div class="fit column justify-between" style="padding: 5px;">
    <div class="full-width" style="flex-grow: 1">

      <q-list dense class="fit">
        <q-item dense>
          <q-input class="fit" v-model="setting.host" dense outlined placeholder="ollama 服务地址">
            <template #prepend>
              <q-icon name="jimu-24gl-network"/>
            </template>
          </q-input>
        </q-item>
        <q-item dense>
          <q-input class="fit" v-model="setting.localPath" dense outlined placeholder="ollama 本地模型路径">
            <template #prepend>
              <q-icon name="jimu-wenjianjia1"/>
            </template>
            <template #append>
              <q-btn dense flat icon="jimu-folderOpen"/>
            </template>
          </q-input>
        </q-item>
      </q-list>
    </div>
    <div class="row full-width">
      <el-button v-show="change" type="primary" @click="save" size="large" style="margin-left: 16px">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {AppSetting} from "@/components/system-components/model/system";
import {computed, ref} from "vue";
import {OllamaSetting} from "@/components/tool-components/chatGptTool/setting/setting";

const props = defineProps<{
  set: AppSetting<any>
}>()

const setting = ref<OllamaSetting>()
const settingOld = ref<OllamaSetting>()

let parse = JSON.parse(props.set.setting);
setting.value = {...parse};
settingOld.value = {...parse};

const change = computed(() => {
  if (setting.value.localPath !== settingOld.value.localPath) return true;
  if (setting.value.host !== settingOld.value.host) return true;
  return false
})

function save() {

}

</script>


<style scoped>

</style>