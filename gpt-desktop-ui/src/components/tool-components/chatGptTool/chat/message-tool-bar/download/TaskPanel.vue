<template>
  <q-card
      style="width:20vw;height: 30vh;overflow: hidden"
      class="column"
      id="downloadList"
  >
    <div style="flex-grow: 1">
      <el-empty v-if="ctx.ui.downloadModelList.length==0" class="fit" description="无下载"/>
      <q-scroll-area v-else class="fit" :visible="false">
        <q-list class="fit">
          <DownloadItem v-for="(item,index) in ctx.ui.downloadModelList" :item="item" :index="index"/>
        </q-list>
      </q-scroll-area>
    </div>
  </q-card>
</template>
<script setup lang="ts">

import DownloadItem from "@/components/tool-components/chatGptTool/chat/message-tool-bar/download/DownloadItem.vue";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";

const ctx = useGptStore()
</script>


<style scoped>

</style>
<style>
#downloadList .q-scrollarea__content.absolute {
  width: 100%;
}
</style>