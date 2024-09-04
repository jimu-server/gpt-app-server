<template>
  <q-card
      style="width: 25vw;height: 20vh"
  >
    <div class="fit column" style="padding: 5px">
      <div class="full-width row justify-between">
        <div>
          知识库列表
        </div>
        <div>
          <q-chip dense icon="jimu-15qingkong-1" label="清空" clickable outline color="primary" @click="clear"/>
        </div>
      </div>
      <div style="flex-grow: 1">
        <q-scroll-area class="fit" style="padding-right: 15px;padding-left: 15px">
          <q-chip
              square
              outline
              icon="jimu-zhishiku"
              icon-selected="jimu-zhishiku"
              v-for="(item,index) in plugin.ctx.knowledge"
              v-model:selected="item.check"
              :color="item.bgColor"
              :label="item.knowledgeName"
              @click="select(item,index)"
              @remove="remove(index)"
              class="full-width"
              icon-remove="img:public/delete.png"
              removable
          />
        </q-scroll-area>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {useAiPluginStore} from "@/components/tool-components/chatGptTool/store/plugin";
import {delKnowledge} from "@/components/tool-components/chatGptTool/chatRequest";
import {ElMessage} from "element-plus";

const props = defineProps<{
  data: any
}>()
const plugin = useAiPluginStore()

function select(value: any, index: number) {
  if (value.check) {
    plugin.ctx.knowledge[index].bgColor = 'primary'
  } else {
    plugin.ctx.knowledge[index].bgColor = ''
  }
}

function clear() {
  plugin.ctx.knowledge.forEach((item: any) => {
    item.check = false
    item.bgColor = ''
  })
}

async function remove(index: number) {
  let result = await delKnowledge(plugin.ctx.knowledge[index].id)
  if (result.code == 200) {
    ElMessage({
      message: '删除成功',
      type: 'success',
      plain: true
    })
    plugin.ctx.knowledge.splice(index, 1)
  }
}

onMounted(async () => {

})
</script>


<style scoped>

</style>