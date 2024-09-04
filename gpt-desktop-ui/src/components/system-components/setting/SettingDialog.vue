<template>
  <q-dialog
      v-model="model"
      no-backdrop-dismiss
      no-shake
      allow-focus-outside
  >
    <q-card
        class="fit column"
        style="width: 70vw;height: 65vh;max-width:100vw;"
    >
      <div class="full-width row justify-between" style="height: 40px">
        <div class="full-height" style="align-content: center;padding-left: 10px">
          设置
        </div>
        <div class="full-height">
          <q-btn :ripple="false" class="setting-close-btn" flat square icon="jimu-guanbi-2"
                 style="height:100%;width: 40px" @click="model=false"/>
        </div>
      </div>
      <div class="full-width column setting-box" style="overflow: hidden;flex-grow: 1;">
        <q-splitter
            v-model="splitterModel"
            :limits="splitterModelLimit"
            class="fit"
        >
          <template v-slot:before>
            <div class="fit column">
              <SettingItemList v-model:tab="tab" :list="app.settings"/>
            </div>
          </template>

          <template v-slot:after>
            <div class="fit" style="overflow: hidden">
              <q-scroll-area class="fit" :visible="false">
                <SettingView v-model:tab="tab" :list="app.settings"/>
              </q-scroll-area>
            </div>
          </template>
        </q-splitter>
      </div>
    </q-card>

  </q-dialog>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {AppSetting} from "@/components/system-components/model/system";
import {useAppStore} from "@/components/system-components/store/app";
import SettingItemList from "@/components/system-components/setting/SettingItemList.vue";
import SettingView from "@/components/system-components/setting/SettingView.vue";

const model = defineModel({default: false, required: true})
const splitterModel = ref(15)
const splitterModelLimit = ref([15, 15])
const tab = ref("")
const app = useAppStore()


function init() {

}

watch(() => model.value, (value) => {
  if (value) {
    init()
  } else {

  }
})
</script>


<style scoped>
.setting-close-btn:hover {
  color: white;
  background-color: red;
  border-top-right-radius: 1px;
  border-color: red;
}

.setting-box {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.12);

  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: rgba(0, 0, 0, 0.12);
}
</style>