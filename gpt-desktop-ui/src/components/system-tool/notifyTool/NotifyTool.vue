<template>
  <div class="notify fit column">
    <div class="full-width row reverse ellipsis" style="padding: 5px">
      <el-link class="ellipsis" type="primary" @click="clear">
        清空全部消息
      </el-link>
    </div>
    <div class="full-width" style="flex-grow: 1">
      <q-scroll-area class="fit" :visible="false">
        <q-list class="fit" style="padding-right: 5px;padding-left: 5px">
          <NotifyCard v-for="item in notify.list" :data="item"/>
        </q-list>
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useNotifyStore} from "@/components/system-tool/notifyTool/store/notify";
import {clearNotify, getAllNotify} from "@/components/system-tool/notifyTool/notifyRequest";
import NotifyCard from "@/components/system-tool/notifyTool/NotifyCard.vue";



const notify = useNotifyStore()


async function clear() {
  let result = await clearNotify()
  if (result.code == 200) {
    notify.list = await getAllNotify()
  }
}

</script>


<style scoped>

</style>

<style>
.el-notification__content {
  width: 100% !important;
}

.el-notification__group {
  width: 100% !important;
}
</style>