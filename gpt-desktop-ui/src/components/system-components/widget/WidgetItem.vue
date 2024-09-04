
<template>
  <div class="row">
    <template v-if="icon!=''">
      <div class="column justify-center" style="margin-left: 5px">
        <q-icon :name="icon"/>
      </div>
      <div class="column justify-center" style="margin-left: 5px;margin-right: 10px">
        {{text}}
      </div>
    </template>
    <template v-else>
      <div class="column justify-center" style="margin-left: 5px;margin-right: 10px">
        {{text}}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props=defineProps({
  icon:{
    type:String,
    default:''
  },
  text:{
    type:String,
    default:''
  }
})
</script>



<style scoped>

</style>