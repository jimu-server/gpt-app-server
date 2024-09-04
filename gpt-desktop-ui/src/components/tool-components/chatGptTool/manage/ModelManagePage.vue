<template>
  <main-page>
    <div id="mode-manage">
      <div class="column" :style="{height: app.ui.page.height}">
        <div class="full-width row justify-center" style="padding-top: 10px">
          <q-input dense v-model="text" outlined style="width: 95%">
            <template v-slot:append>
              <q-icon name="jimu-sousuo-2"/>
            </template>
          </q-input>
        </div>
        <div class="column" style="flex-grow: 1">
          <q-scroll-area class="fit" :visible="false">
            <q-list class="fit">
              <q-item v-for="(item,index) in ctx.ui.baseModelList">
                <q-item-section avatar>
                  <q-avatar :icon="'img:'+item.picture"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <span>{{ item.name }}</span>
                    <span style="margin-left: 5px" class="text-grey-7">{{ item.model }}</span>
                  </q-item-label>
                  <q-item-label v-if="!item.isDownload && item.downloads">
                    <div class="full-width">
                      <q-linear-progress v-if="progressValue==0" size="md" :indeterminate="progressValue==0"
                                         :value="progressValue"/>
                      <q-linear-progress v-else size="md" :value="progressValue">
                      </q-linear-progress>
                    </div>
                    <div class="full-width ellipsis text-grey-6" style="font-size: 10px;align-content: center">
                      {{ progressInfo }}
                    </div>
                  </q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <template v-if="item.isDownload">
                    <span class="text-grey-7" style="font-size: 10px">以拉取</span>
                  </template>
                  <template v-else>
                    <q-btn v-if="!flag" flat dense icon="jimu-yunxiazai_o" @click="downloadModel(item)"
                           color="primary"/>
                    <q-btn v-if="item.downloads" flat dense icon="jimu-guanbi" @click="clean"/>
                  </template>
                </q-item-section>
                <q-item-section avatar v-if="item.isDownload">
                  <div class="fit column justify-center">
                    <q-btn dense icon="jimu-shanchu" color="red" flat @click="delModel(item)"/>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </div>
  </main-page>
</template>

<script setup lang="ts">

import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {computed, onMounted, ref} from "vue";
import {LLmMole, ProgressResponse} from "@/components/tool-components/chatGptTool/model/model";
import {GetHeaders} from "@/plugins/axiosutil";
import {ElMessage, ElNotification} from "element-plus";
import {deleteModel} from "@/components/tool-components/chatGptTool/chatRequest";
import {useAppStore} from "@/components/system-components/store/app";

const ctx = useGptStore()
// 只允许单个下载
const flag = ref(false)
const cleanFlag = ref(false)
const progress = ref<ProgressResponse>(null)
const text = ref('')
const app = useAppStore()

// 计算下载进度
const progressValue = computed(() => {
  if (progress.value == null) {
    return 0
  }
  if (!progress.value.status.startsWith('pulling')) {
    return 0
  }
  if (!hasOwnProperty(progress.value, 'digest')) {
    return 0
  }
  if (!hasOwnProperty(progress.value, 'completed')) {
    return 0
  }
  if (progress.value.status == 'success') {
    return 0.99
  }
  if (progress.value.completed == progress.value.total) {
    return 1
  }
  return progress.value.completed / progress.value.total
})


// 显示下载信息
const progressInfo = computed(() => {
  if (progress.value == null) {
    return '等待..'
  }
  if (progress.value.status == 'success') {
    return '拉取完成'
  }
  if (!progress.value.digest) {
    return progress.value.status
  }
  return progress.value.status + progress.value.digest
})

// 取消下载
function clean() {
  cleanFlag.value = true
}


async function downloadModel(item: LLmMole) {
  if (flag.value) return
  flag.value = true
  item.downloads = true
  let data = {
    name: item.model,
    model: item.model,
    stream: true,
  }
  const response = await fetch('http://localhost:8080/api/chat/model/pull', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...GetHeaders()
    },
    body: JSON.stringify(data),
  });
  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  try {
    while (true) {
      // 检查停止下载
      if (cleanFlag.value) {
        await reader.cancel()
        cleanFlag.value = false
        item.downloads = false
        flag.value = false
        item.isDownload = false
        return
      }
      const {done, value} = await reader.read()
      if (done) {
        break
      }
      let decodedData = decoder.decode(value);
      let accumulatedData = ""; // Accumulate chunks of data here
      accumulatedData += decodedData;
      accumulatedData.split('\n').forEach(line => {
        if (line) {
          try {
            let parsed = JSON.parse(line);
            // 检查当前的流消息是否出现错误
            let {code, streamFlag} = streamResponse(parsed);
            if (streamFlag) {
              // 根据业务码处理具体操作 当前默认结束客户端操作
              if (code == 200) {
                setTimeout(() => {
                  item.isDownload = true;
                  flag.value = false
                }, 2000)
                return;
              }
              item.isDownload = false;
              item.downloads = false;
              return
            }
            // console.log(parsed)
            // 检查当前的流消息是否完成
            if (parsed.status === 'success') {
              progress.value = parsed
              setTimeout(() => {
                item.isDownload = true;
                flag.value = false
              }, 2000)
              return
            }
            progress.value = parsed
          } catch (error) {
            console.error("Error parsing JSON:", error);
            console.error(line)
          }
        }
      });
    }
  } catch (e) {

  }
}


async function delModel(item: LLmMole) {
  let result = await deleteModel(item.model)
  if (result.code == 200) {
    ElMessage({
      message: '删除成功',
      plain: true,
      appendTo: document.getElementById('mode-manage')
    })
    // 需要根据 当前ui选择的 model 做出修改
    item.downloads = false
    item.isDownload = false
    // 更新聊天可选模型列表
    await ctx.GetModelList()
  }
}


function hasOwnProperty(obj: object, prop: string) {
  return obj.hasOwnProperty(prop);
}

/*
* @description: 检查当前的流消息的状态,是否出需要客户端退出流读取
* */
function streamResponse(value: any) {
  let code = hasOwnProperty(value, "code");
  let msg = hasOwnProperty(value, "msg");
  let err = hasOwnProperty(value, "data");
  return {
    code: value.code,
    streamFlag: code && msg && err,
  };
}

onMounted(() => {
  ctx.GetBaseModelList()
})

</script>


<style scoped>

</style>
<style>
#mode-manage .q-scrollarea__content.absolute {
  width: 100%;
}
</style>