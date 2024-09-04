<template>
  <div class=" row  table-pag">
    <el-pagination
      background
      layout="prev, pager, next, jumper, ->, total,sizes"
      v-model:current-page="page"
      v-model:page-size="size"
      :total="total"
      :page-sizes="[ 10, 20, 50, 100]"
      @current-change="currentPage"
      @size-change="currentSize"
    />
  </div>
</template>

<script setup lang="ts">

const page = defineModel('page', {default: 1})
const size = defineModel('size', {default: 5})
const total = defineModel('total', {default: 0})

const emits=defineEmits({
  action:function (page: number, size: number) {
  }
})


function currentPage(value: number) {
  emits('action',value,size.value)
}

function currentSize(value: number) {
  emits('action',page.value,value)
}
</script>


<style scoped>
.table-pag> .q-field--auto-height.q-field--dense .q-field__control, .q-field--auto-height.q-field--dense .q-field__native{
  min-height: 30px;
}
</style>