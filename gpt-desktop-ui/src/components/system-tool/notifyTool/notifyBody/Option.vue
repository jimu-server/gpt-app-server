<template>
  <div class="full-width row reverse">
<!--    <el-button v-if="data.status==NotifyStatus.Read" text type="danger" @click="delMsg(data.id)">
      删除
    </el-button>-->
    <el-button class="read-btn" v-if="data.status==NotifyStatus.UnRead" text type="primary" @click="readMsg(data.id)">
      已读
    </el-button>
  </div>
</template>

<script setup lang="ts">
import {Records} from "@/components/system-components/model/system";

import {useNotifyStore} from "@/components/system-tool/notifyTool/store/notify";
import {readMsg} from "@/components/system-tool/notifyTool/notifyutil";
import {NotifyStatus} from "@/components/system-tool/notifyTool/template";


const props = defineProps<{
  data: Records
}>()

const notify = useNotifyStore()


</script>


<style scoped>

</style>