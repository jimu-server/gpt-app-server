<template>
  <div class="silde_box">

  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";


const msg = ref("");
const text = ref("滑动验证");
//自定义图片
const img = ref(["https://img0.baidu.com/it/u=1552632757,378376738&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281", "https://img2.baidu.com/it/u=4260616497,4153321689&fm=253&fmt=auto&app=138&f=JPEG?w=656&h=435"])
const slideblock = ref()

function onSuccess(times) {

}

function onFail() {
  console.log('验证不通过');
  msg.value = ''
}

function onRefresh() {
  console.log('点击了刷新小图标');
  msg.value = ''
}

function onFulfilled() {
  console.log('刷新成功啦！');
}

function onAgain() {
  console.log('检测到非人为操作的哦！');
  msg.value = 'try again';
  // 刷新
  slideblock.value.slideblock.reset();
}

function handleClick() {
  slideblock.value.slideblock.reset();
}
</script>
<style scoped>
.silde_box {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  z-index: 3333;
}
</style>
