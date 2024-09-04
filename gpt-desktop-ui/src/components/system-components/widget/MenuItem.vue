<template>
  <q-item clickable v-close-popup style="padding: 0">
    <div class="row fit justify-center">
      <div class="fit column justify-center">
        <div class="row fit">
          <div class="row fit menu-item justify-between" style="margin: 3px">
            <div class="row ">
              <div class="column justify-center" style="margin-left: 5px;align-content: center">
                <!-- 默认插槽用于定制化 菜单多样化操作,比如使用单选,多选启用菜单功能 -->
                <slot name="option">
                  <q-icon ref="iconRef" v-if="icon!==''" :name="icon" class="menu-icon"/>
                </slot>
              </div>
              <div class="column justify-center" style="margin-left: 5px;align-content: center">
                {{ text }}
              </div>
            </div>
            <div v-if="isMenu" style="align-content: center;margin-left: 3px">
              <slot name="extend-menu">
                <q-icon name="jimu-xiangyou-3" class="menu-icon"/>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-item>
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
  },
  isMenu: {
    type: Boolean,
    default: false
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

.menu-item {
  height: 25px;
  padding: 5px;
  border-radius: 3px;
}

.menu-item:hover {
  background: rgba(158, 160, 161, 0.29);
}
</style>