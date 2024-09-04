<template>

</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {userStore} from "@/components/system-components/store/user";
import {GetHeaders} from "@/plugins/axiosutil";

const props = defineProps({
  url: {
    type: String,
  },
  protocols: {
    type: Array<string>
  }
})
let emits = defineEmits({
  receive: function (data) {
    // console.log("default receive", data);
  },
  close: function () {
    console.log("close")
  },
  error: function () {
    console.log("error");
  }
});
const webSocket = ref<WebSocket>()
webSocket.value = new WebSocket(props.url, props.protocols);
webSocket.value.onopen = function () {
  console.log("success");
};
webSocket.value.onmessage = function (evt) {
  let message: string = evt.data;
  let data = JSON.parse(message)
  emits('receive', data)
};
webSocket.value.onclose = function () {
  emits('close')
};
webSocket.value.onerror = function () {
  emits('error')
};

function sendCloseMessage() {
  if (webSocket.value && webSocket.value.readyState === WebSocket.OPEN) {
    const closeMessage = JSON.stringify({ type: "close", reason: "Client closing connection" });
    webSocket.value.send(closeMessage);
  }
}

onMounted(() => {

})
onUnmounted(() => {
  if (webSocket.value) {
    console.log("ws close")
    webSocket.value.close()
  }
})
</script>

<style scoped>

</style>