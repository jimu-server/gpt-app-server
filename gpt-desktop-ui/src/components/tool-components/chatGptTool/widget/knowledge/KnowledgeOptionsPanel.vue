<template>
  <div>
    <q-icon size="md" class="edit-tool-option" name="jimu-zhishi">
      <q-tooltip :offset="[0, 0]">
        知识库
      </q-tooltip>
    </q-icon>
    <q-menu
        id="knowledge-menu"
        anchor="top start" self="bottom start"
        transition-show="scale"
        transition-hide="scale"
        style="overflow: hidden"
    >
      <div style="width: 500px;height: 200px;overflow: hidden;padding: 5px;">
        <div class="fit column">
          <div class="full-width row justify-between" style="height: 40px">
            <div style="align-content: center">
              知识库
            </div>
            <div class="hull-height column justify-center" style="flex: 1;height: 40px">

            </div>
            <div class="row">
              <q-btn flat icon="jimu-caidan" style="width: 40px"/>
            </div>
          </div>
          <div class="full-width column" style="flex-grow: 1">
            <q-scroll-area class="fit" :visible="false">
              <div class="fit row knowledge-cards">
                <KnowledgeCardItem v-for="item in ctx.ui.knowledge.instance" :key="item.id" :knowledge="item"/>
              </div>
            </q-scroll-area>
          </div>
        </div>
      </div>
    </q-menu>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getKnowledge} from "@/components/tool-components/chatGptTool/chatRequest";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";


const ctx = useGptStore()
const pid = ref('')
const checkedAll = ref(false)

function selectAllKnowledge(value: boolean) {

}


onMounted(() => {
  getKnowledge().then(res => {
    ctx.ui.knowledge.instance = res
  })
})
</script>


<style scoped>

</style>
<style>

</style>