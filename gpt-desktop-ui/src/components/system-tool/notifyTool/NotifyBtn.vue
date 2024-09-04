<template>
  <ToolButton :btn="btn" @receive="receive" :position="position">
    <template v-slot:notify-badge>
      <q-badge v-show="status==NotifyToolStatusType.UnReadNotify" color="primary" rounded floating/>
    </template>
  </ToolButton>
</template>


<script setup lang="ts">
import {useQuasar} from "quasar";
import {useNotifyStore} from "@/components/system-tool/notifyTool/store/notify";
import {Records, Tool} from "@/components/system-components/model/system";

import {computed, onMounted} from "vue";
import {notifyMsg} from "@/components/system-tool/notifyTool/notify";
import {NotifyStatus, NotifyToolStatusType} from "@/components/system-tool/notifyTool/template";
import ToolButton from "@/components/system-components/layouts/tool/ToolButton.vue";

const $q = useQuasar()
const notify = useNotifyStore()
const props = defineProps<{
  btn: Tool
  position: number
}>()


function receive(data: Records) {
  console.log(data)
  notify.list.push(data)
  notifyMsg(data)
}

const status = computed(() => {
  notify.unread = 0
  notify.list.forEach(item => {
    if (item.status === NotifyStatus.UnRead) notify.unread++
  })
  if (notify.unread > 0) {
    return NotifyToolStatusType.UnReadNotify
  }
  return NotifyToolStatusType.NoNotify
})

onMounted(async () => {

})


</script>


<style scoped>

</style>