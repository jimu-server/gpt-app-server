<template>
  <q-menu
      transition-show="jump-down"
      transition-hide="jump-up"
      :offset="[0,5]"
  >
    <div style="width: 260px;height: 100px">
      <q-scroll-area class="fit">
        <q-list class="fit">
          <q-item class="account-list" v-for="item in account.list" clickable v-close-popup @click="select(item)">
            <q-item-section avatar>
              <q-icon size="xs" name="jimu-yonghuming"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.account }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-btn flat size="xs" icon="jimu-guanbi-2" @click.stop="deleteItem(item)"/>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>
  </q-menu>
</template>
<script setup lang="ts">
import {useAccountStore} from "@/components/system-components/store/account";
import {AccountList} from "@/components/system-components/model/system";

const account = useAccountStore()

function select(value: AccountList) {
  account.curent = {...value}
}

function deleteItem(value: AccountList) {
  account.deleteAccount(value)
}
</script>


<style scoped>
.account-list:hover {
  background-color: rgba(209, 211, 218, 0.93);
}
</style>