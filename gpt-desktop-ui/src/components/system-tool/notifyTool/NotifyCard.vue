<template>
  <transition  enter-active-class="animate__animated animate__bounceIn">
    <q-card flat bordered class="notify">
      <div class="column ellipsis">
        <q-bar class="bg-transparent" style="padding: 0">
          <div>
            <q-icon size="25px" :name="icon" :color="color"/>
          </div>
          <div class="ellipsis">
            {{ data.title }}
            <q-badge v-if="data.status==NotifyStatus.UnRead" rounded floating color="primary"/>
          </div>
          <q-space/>
          <q-btn flat icon="jimu-gengduo_shu-2" style="width: 20px">
            <q-menu>
              <q-list dense style="padding: 0">
                <menu-item icon="jimu-shanchu" text="删除" @click="delMsg(data.id)"/>
              </q-list>
            </q-menu>
          </q-btn>
        </q-bar>
        <div class="ellipsis" style="flex-grow: 1;padding: 5px">
          <component :is="data.template" :data="data"/>
        </div>
        <div class="notify-footer full-width row reverse">
          <div class="text-grey-8" style="font-size: 10px">
            {{ formatDateWithTimezone(data.updateTime) }}
          </div>
        </div>
      </div>
    </q-card>
  </transition>
</template>


<script setup lang="ts">
import {Records} from "@/components/system-components/model/system";
import {ref} from "vue";
import {delMsg} from "@/components/system-tool/notifyTool/notifyutil";
import {NotifyMsgType, NotifyStatus} from "@/components/system-tool/notifyTool/template";


const props = defineProps<{
  data: Records
}>()

const icon = ref('')
const color = ref('')

switch (props.data.msgType) {
  case NotifyMsgType.Info:
    icon.value = 'jimu-info-fill'
    color.value = 'primary'
    break
  case NotifyMsgType.Success:
    icon.value = 'jimu-success_fill'
    color.value = 'positive'
    break
  case NotifyMsgType.Warning:
    icon.value = 'jimu-warring_shape'
    color.value = 'warning'
    break
  case NotifyMsgType.Error:
    icon.value = 'jimu-error-fill'
    color.value = 'negative'
    break
  case 4:
}

function formatDateWithTimezone(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Shanghai'
  }).format(date).replace(',', '');
}
</script>


<style scoped>
.notify {
  margin-top: 5px;
}
</style>