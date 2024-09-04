<template>
  <template v-if="btn.ws!=''">
    <WebSocket :url="btn.ws" :protocols="[user.info.token]" @receive="receive"/>
  </template>
</template>

<script setup lang="ts">

import WebSocket from "@/components/system-components/layouts/tool/WebSocket.vue";
import {userStore} from "@/components/system-components/store/user";
import {Tool} from "@/components/system-components/model/system";

const props = defineProps<{
  btn: Tool
}>()

const emits = defineEmits({
  receive: function (data) {
  }
})

function receive(data) {
  emits('receive', data)
}

const user = userStore()
</script>


<style scoped>

</style>