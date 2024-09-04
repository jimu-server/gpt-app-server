<template>
  <q-card flat>
    <img class="image-option" :src="message.pictureElem.sourcePicture.url" alt=""/>
  </q-card>
</template>

<script setup lang="ts">



import {MessageItem} from "@/components/system-components/tool/chatGptTool/chat/model/chat";

const props = defineProps<
    {
      message?: MessageItem
    }
>()




</script>


<style scoped>
.image-option:hover {
  cursor: pointer;
}
</style>