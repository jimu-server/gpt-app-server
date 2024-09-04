<template>
  <div class="row" :style="{ width: width}">
    <q-item dense class="fit" style="padding: 0">
      <q-item-section>
        <q-input class="search-input" outlined dense v-model="text"/>
      </q-item-section>
      <q-item-section side>
        <div class="column justify-center" style="height: 100%;">
          <div style="width: 40px;height: 40px;">
            <q-btn dense unelevated outline flat icon="jimu-add" class="fit"
                   style="background: rgba(128,128,128,0.23)">
              <q-menu>
                <q-list dense>
                  <menu-item icon="jimu-chuangjianhuihua" text="新会话" @click="openCreate=true"/>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-item-section>
    </q-item>
    <CreateConversationDialog v-model="openCreate" title="创建会话" @success="createSuccess"/>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import MenuItem from "@/components/system-components/widget/MenuItem.vue";
import {ElMessage} from "element-plus";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {getConversation} from "@/components/tool-components/chatGptTool/chatRequest";



const props = defineProps({
  width: {
    default: '100%',
  }
})

const emits = defineEmits({
  search: function (text: string) {

  }
})

const text = ref('')
const ctx = useGptStore()
const openCreate = ref(false)

function createSuccess(id: string) {
  ElMessage({
    message: '会话创建成功',
    type: 'success',
    plain: true
  })
  getConversation().then(data => {
    ctx.setConversation(data)
    ctx.SetCurrentChatById(id)
  })
}

watch(() => text.value, (value) => {
  emits('search', value)
})

</script>


<style scoped>

</style>
<style>


/*.search-input > .q-field__inner.relative-position.col.self-stretch > .q-field__control {
  height: 30px !important;
  padding: 0 10px !important;
}*/
</style>