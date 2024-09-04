<template>
  <div class="row menu-item">
    <div class="column justify-center" style="margin-left: 5px">
      <q-icon ref="iconRef" :name="icon" class="menu-icon"/>
    </div>
    <div class="column justify-center" style="margin-left: 5px;margin-right: 10px">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {morph} from "quasar";
import {ref} from "vue";

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  }
})

const iconRef = ref()

let cancel

function over(event) {
  if (iconRef.value == null) {
    return
  }
  if (cancel === void 0 || cancel() === false) {
    cancel = morph({
      from: iconRef.value.$el,
      duration: 200,
      style: {
        fontSize:'17px'
      }
    })
  }
}
</script>


<style scoped>

.menu-icon {

}

.menu-item {
  height: 25px;
  margin: 2px;
  border-radius: 5px;
}

.menu-item:hover {
  background: rgba(158, 160, 161, 0.29);
}
</style>