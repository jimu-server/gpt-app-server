<template>
  <div class="column fit">
    <div>
      {{ ctx.message }}
    </div>
    <Option :data="data"/>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {Records} from "@/components/system-components/model/system";
import {useNotifyStore} from "@/components/system-tool/notifyTool/store/notify";
import Option from "@/components/system-tool/notifyTool/notifyBody/Option.vue";


const props = defineProps<{
  data: Records
}>()

const ctx = ref<any>()
ctx.value = JSON.parse(props.data.param)
const notify = useNotifyStore()


</script>


<style scoped>

</style>