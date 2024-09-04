<template>
  <q-dialog
      v-model="model"
      persistent
  >
    <q-card
        style="width: 40vw; height: 50vh;overflow: hidden"
    >
      <div class="fit column" style="padding: 10px">
        <div class="full-width row" style="flex-grow: 1">
          <div class="fit column">
            <q-item>
              <q-item-section>
                <q-linear-progress v-if="progress==0" indeterminate rounded size="15px"/>
                <q-linear-progress v-else-if="progress<1" rounded size="15px" :value="progress"/>
                <q-linear-progress v-else rounded size="15px" :value="1"/>
              </q-item-section>
              <q-item-section avatar>
                <q-btn v-if="!isComplete" outline dense color="red" icon="jimu-daochu1024-16" @click="stopGen"/>
                <q-btn v-else outline dense color="primary" label="完成" @click="complete"/>
              </q-item-section>
            </q-item>
            <q-item style="flex-grow: 1">
              <q-item-section>
                <q-scroll-area ref="scroll" class="fit">
                  <div v-for="msg in msgs">
                    {{ msg }}
                  </div>
                </q-scroll-area>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>


<script setup lang="ts">
import {ref, toRaw} from "vue";
import {Stream} from "@/components/system-components/stream/stream";
import {genKnowledge} from "@/components/tool-components/chatGptTool/chatRequest";
import {Result} from "@/components/system-components/model/system";
import fs from "fs";

import {GetHeaders} from "@/plugins/axiosutil";
import fetch from 'node-fetch';
import {set} from "lodash";
import {NodeFetchStream} from "@/components/system-components/stream/node_fetch_stream";

const AbortController = require('abort-controller');
var FormData = require('form-data');
defineExpose({
  beginGenFile
})

const model = defineModel({default: false, required: false})
const progress = ref(0)
const isComplete = ref(false)
const msgs = ref<string[]>([])
const stream = ref<NodeFetchStream>()
const scroll = ref()

function stopGen() {
  if (stream.value != null) {
    stream.value.Stop()
  }
  msgs.value = []
  model.value = false
  progress.value = 0
  isComplete.value = false
}

function complete() {
  msgs.value = []
  model.value = false
  isComplete.value = false
}


async function beginGenFile(name: string, files: string[]) {
  let {response, controller} = await genKnowledgeFile(name, files)
  isComplete.value = false
  setTimeout(() => {
    model.value = true
    stream.value = new NodeFetchStream(response, controller)

    // 处理流消息 更新消息数据
    stream.value.setHandler((data, status) => {
      console.log(data)
      msgs.value.push(data.msg)
      progress.value = data.percent.toFixed(2)
      setTimeout(async () => {
        if (scroll.value != null) {
          let scrollTarget = scroll.value.getScrollTarget()
          let height = scrollTarget.scrollHeight
          scroll.value.setScrollPosition('vertical', height)
        }
      }, 200)
    })

    // 流流消息处理完成
    stream.value.setComplete((data, status) => {
      console.log("complete")
      isComplete.value = true
    })

    // 处理业务状态
    stream.value.setEnd((data: Result<any>, status) => {
      if (data.code == 200) {
        isComplete.value = true
        return
      } else {
        isComplete.value = true
        return
      }
    })
    // 开始监听流消息
    stream.value.listen()
  }, 200)
}


async function genKnowledgeFile(name, files: string[]) {
  files = toRaw(files)
  let form = new FormData()
  form.append('name', name)
  files.map((item, index) => {
    form.append('files', fs.createReadStream(item))
  });
  let controller = new AbortController();
  let response = await fetch('http://localhost:8080/api/chat/knowledge/gen', {
    signal: controller.signal,
    method: 'POST',
    body: form,
    headers: {
      ...GetHeaders(),
      ...form.getHeaders()
    }
  })
  return {
    response: response,
    controller: controller
  }
}


</script>

<style scoped>

</style>