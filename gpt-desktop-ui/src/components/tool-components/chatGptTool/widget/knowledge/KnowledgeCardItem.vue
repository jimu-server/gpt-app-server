<template>
  <q-item class="full-width" dense style="padding: 0">
    <q-item-section avatar>
      <q-checkbox v-model="checked"/>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ props.knowledge.knowledgeName }}</q-item-label>
    </q-item-section>
    <q-item-section avatar>
      <q-btn dense flat icon="jimu-gengduo_shu-2"/>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">


import {AppChatKnowledgeInstance} from "@/components/tool-components/chatGptTool/model/model";
import {ref, watch} from "vue";

const props = defineProps<{
  knowledge: AppChatKnowledgeInstance
}>()

const checked = ref(false)
if (props.knowledge.check) {
  checked.value = props.knowledge.check
}


watch(() => props.knowledge.check, (value) => {
  checked.value = value
})
</script>


<style scoped>
.knowledge-card {

}
</style>