<template>
  <q-select v-if="ctx.ui.currentModel!=null" borderless v-model="ctx.ui.currentModel" :options="ctx.ui.modelList" dense
            options-dense
            option-label="name" option-value="model"
            dropdown-icon="jimu-xiangxia-2">
    <template #prepend>
      <q-icon class="chat-tool-opt" size="25px" :name="'img:'+'./GPT.png'"/>
    </template>
    <template v-slot:selected>
      <div class="ellipsis">
        {{ ctx.ui.currentModel.name }}
      </div>
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label> {{ scope.opt.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {onMounted} from "vue";

const ctx = useGptStore()

onMounted(() => {
  ctx.GetModelList()
})
</script>


<style scoped>

</style>