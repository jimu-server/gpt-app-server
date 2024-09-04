<template>
  <q-item style="height: 50px">
    <q-item-section>
      <q-item-label>
        <q-linear-progress v-if="progressValue==0" indeterminate size="10px"
                           rounded/>
        <q-linear-progress v-else size="10px" rounded :value="progressValue"/>
      </q-item-label>
      <q-item-section class="ellipsis">
        <div class="fit ellipsis"> {{ progressInfo }}</div>
      </q-item-section>
    </q-item-section>
    <q-item-section avatar>
      <q-btn dense flat label="取消" @click="clean"/>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import {OllamaDownload, ProgressResponse} from "@/components/tool-components/chatGptTool/model/model";
import {computed, onMounted, ref} from "vue";
import {Stream} from "@/components/system-components/stream/stream";
import {Result} from "@/components/system-components/model/system";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {downloadOllamaModel} from "@/components/tool-components/chatGptTool/ollamaRequest";

const props = defineProps<{
  item: OllamaDownload
  index: number
}>()

const progress = ref<ProgressResponse>()
const ctx = useGptStore()

// 计算下载进度
const progressValue = computed(() => {
  if (props.item.progress == null) {
    return 0
  }
  if (!props.item.progress.status.startsWith('pulling')) {
    return 0
  }
  if (!hasOwnProperty(props.item.progress, 'digest')) {
    return 0
  }
  if (!hasOwnProperty(props.item.progress, 'completed')) {
    return 0
  }
  if (props.item.progress.status == 'success') {
    return 0.99
  }
  if (props.item.progress.completed == props.item.progress.total) {
    return 1
  }
  return props.item.progress.completed / props.item.progress.total
})


// 显示下载信息
const progressInfo = computed(() => {
  if (props.item.progress == null) {
    return '等待..'
  }
  if (props.item.progress.status == 'success') {
    return '拉取完成'
  }
  if (!props.item.progress.digest) {
    return props.item.progress.status
  }
  return props.item.progress.status + props.item.progress.digest
})

function hasOwnProperty(obj: object, prop: string) {
  return obj.hasOwnProperty(prop);
}

// 取消下载
function clean() {
  ctx.ui.downloadModelList[props.index].stream.Stop()
  ctx.ui.downloadModelList.splice(props.index, 1)
}

onMounted(async () => {
  console.log("begin download  ollama model  " + props.item.model + "   ")
  // 开始下载数据
  /*  if (props.item.isDownload) {
      return
    }
    setTimeout(async () => {
      // 更新当前下载状态
      ctx.ui.downloadModelList[props.index].isDownload = true
      let data = {
        name: props.item.model,
        model: props.item.model,
        stream: true,
      }
      const response = await downloadOllamaModel(data)
      let stream = new Stream(response)
      stream.setHandler((data, status) => {
        ctx.ui.downloadModelList[props.index].progress = data
      })

      stream.setComplete((data, status) => {
        console.log("complete")
        // 删除下载任务列表
        let findIndex = ctx.ui.downloadModelList.findIndex(item => item.model == props.item.model);
        if (findIndex != -1) {
          ctx.ui.downloadModelList.splice(findIndex, 1)
        }
        ctx.GetModelList()
      })

      stream.setEnd((data: Result<any>, status) => {
        if (data.code == 200) {

          return
        } else {

          return
        }
      })
      await stream.listen()
    },200)*/
})

</script>


<style scoped>

</style>