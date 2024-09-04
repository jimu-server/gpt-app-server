<template>
  <div class="edit-file column justify-between">
    <div class="fit card-body row">
      <div style="max-width: 120px">
        <div style="overflow-x: hidden">
          <el-text class="w-150px mb-2" truncated>
            {{ name }}
          </el-text>
        </div>
        <div>
          {{ `${size.toFixed(2)} ${units[i]}` }}
        </div>
      </div>
      <q-space/>
      <div class="column justify-center">
        <div class="file-icon" :style="{
        width: '50px',
        height: '50px',
        marginRight: '2px',
        backgroundImage: `url(${icon})`,
      }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {ElText} from "element-plus";


const props = defineProps({
  path: String,
  name: String,
  size: Number,
  type: String,
})

const icon = ref('')
const color = ref('black')
const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
let size = props.size
let i = 0;
while (size >= 1024 && i < units.length - 1) {
  size /= 1024;
  i++;
}

onMounted(() => {
  let suffix = props.name.substr(props.name.lastIndexOf('.') + 1)
  switch (suffix) {
    case "pdf":
      icon.value = '/file-icon/pdfwenjian.png'
      break;
    case "xlsx":
      icon.value = '/file-icon/xlsx.png'
      break;
    case "docx":
      icon.value = '/file-icon/docx1.png'
      break;
    case "zip":
      icon.value = '/file-icon/zip.png'
      break;
    case "rar":
      icon.value = '/file-icon/rar.png'
      break;
  }
})
</script>


<style scoped>
.edit-file {
  width: 200px;
  height: 60px;
}

.file-icon {
  background-repeat: no-repeat;
  background-size: cover;
}


.edit-file:hover {
  background-color: rgba(37, 32, 32, 0.08);
}
</style>