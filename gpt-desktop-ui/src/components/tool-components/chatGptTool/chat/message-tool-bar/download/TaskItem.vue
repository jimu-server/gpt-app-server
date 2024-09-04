<template>

</template>

<script setup lang="ts">
import {ref} from "vue";
import {hasOwnProperty} from "@/components/system-components/utils/systemutils";
import {Stream} from "@/components/system-components/stream/stream";
import {genKnowledge} from "@/components/tool-components/chatGptTool/chatRequest";
import {Result} from "@/components/system-components/model/system";

defineExpose({
  beginGen,
})

const model = defineModel({default: false, required: false})
const progress = ref(0)
const response = ref<Response | null>(null)
const isComplete = ref(false)
const msgs = ref<string[]>([])
const load = ref<Stream>()
const scroll = ref()

function stopGen() {
  if (load.value != null) {
    load.value.Stop()
  }
  msgs.value = []
  model.value = false
  isComplete.value = false
}

function complete() {
  msgs.value = []
  model.value = false
  isComplete.value = false
}

async function beginGen(name: string, files: string[]) {
  response.value = await genKnowledge(name, files)
  model.value = true
  stream()
}

function stream() {
  setTimeout(async () => {
    load.value = new Stream(response.value)
    load.value.setHandler((data, status) => {
      msgs.value.push(data.msg)
      progress.value = data.percent
      setTimeout(async () => {
        let scrollTarget = scroll.value.getScrollTarget()
        let height = scrollTarget.scrollHeight
        scroll.value.setScrollPosition('vertical', height)
      }, 200)
    })

    load.value.setComplete((data, status) => {
      console.log("complete")
      isComplete.value = true
    })

    load.value.setEnd((data: Result<any>, status) => {
      if (data.code == 200) {
        isComplete.value = true
        return
      } else {
        isComplete.value = true
        return
      }
    })
    await load.value.listen()
  }, 200)
}

</script>

<style scoped>

</style>