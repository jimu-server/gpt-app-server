<template>
  <div class="ref-message column" style="overflow: hidden">
    <div class="ref-card column" style="padding-left: 5px">
      <!--  消息发送者昵称  -->
      <div class="ref-user">
        {{ message.senderNickname }}
      </div>
      <div class="ref-body row" style="overflow: hidden">
        <div class="ellipsis" style="word-break: break-word;width: 90%">
          {{ message.textElem.content }}
        </div>
        <q-space/>
        <div class="column justify-end" style="width: 10%">
          <div class="row justify-end">
            <q-btn flat round size="5px" icon="close" style="margin-right: 2px;margin-bottom: 2px" @click="closeRef()"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {MessageItem} from "@/components/tool-components/chatGptTool/model/chat";

const ctx = useGptStore()
const props = defineProps<
    {
      message?: MessageItem
    }
>()
const model = defineModel('show', {default: false})

function closeRef() {
  model.value = false
}
</script>


<style scoped>
.ref-message {
  padding: 5px 5px 0 5px;
}

.ref-card {
  background-color: rgba(226, 221, 221, 0.51);
  border-radius: 5px;
}
</style>