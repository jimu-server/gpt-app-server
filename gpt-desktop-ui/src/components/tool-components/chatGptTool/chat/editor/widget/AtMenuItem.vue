<template>
  <div>
    <q-item dense>
      <q-item-section side>
        <q-avatar rounded size="40px">
          <img src="https://cdn.quasar.dev/img/avatar.png"  alt=""/>
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>@{{name}}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup lang="ts">

const props=defineProps<{
  name?: string
}>()
</script>



<style scoped>

</style>