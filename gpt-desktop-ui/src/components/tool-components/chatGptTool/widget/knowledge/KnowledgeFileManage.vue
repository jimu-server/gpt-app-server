<template>
  <q-dialog
      v-model="model"
  >
    <q-card
        id="knowledge-file-manage"
        ref="manageRef"
        style="width: 70vw;height: 65vh;overflow: hidden;max-width: 100vw"
    >
      <div class="fit" style="overflow: hidden;padding: 5px;">
        <div class="fit column">
          <div class="full-width row justify-between" style="height: 40px">
            <div>
              <q-checkbox ref="checkedAllRef" v-model="checkedAll" @update:model-value="selectAllFile">
                <q-tooltip :offset="[0, 0]">
                  <template v-if="!checkedAll">
                    全选
                  </template>
                  <template v-else>
                    全不选
                  </template>
                </q-tooltip>
              </q-checkbox>
            </div>
            <div class="hull-height column justify-center" style="flex: 1;height: 40px">
              <ScrollX class="fit">
                <div class="fit column justify-center" style="height: 32px">
                  <q-breadcrumbs gutter="none" class="full-width">
                    <q-breadcrumbs-el v-for="(item,index) in ctx.ui.knowledge.nva" @click="back(index,item)">
                      <el-link :type="index==ctx.ui.knowledge.nva.length-1?'default':'primary'"
                               style="user-select: none">
                        {{ item.entity.fileName }}
                      </el-link>
                    </q-breadcrumbs-el>
                  </q-breadcrumbs>
                </div>
              </ScrollX>
            </div>
            <div class="row">

              <q-btn dense flat icon="jimu-shujushengchengguize" style="width: 40px" @click="openCreate">
                <q-tooltip :offset="[0, 0]">
                  生成知识库
                </q-tooltip>
              </q-btn>

              <q-btn dense flat icon="jimu-tianjiawenjianjia" style="width: 40px" @click="createFolderFlag=true">
                <q-tooltip :offset="[0, 0]">
                  新建文件夹
                </q-tooltip>
              </q-btn>
              <el-upload
                  action="http://localhost:8080/api/chat/knowledge/file/create"
                  method="post"
                  :headers="GetHeaders()"
                  :data="uploadData()"
                  :show-file-list="false"
                  style="width: 40px;height: 40px"
                  :before-upload="beforeFileUpload"
                  :on-success="handleFileSuccess"
                  name="files"
              >
                <el-icon size="40">
                  <span :class="'iconfont '+'jimu-tianjiawenjian'" style="font-size: 24px"></span>
                </el-icon>
                <q-tooltip :offset="[0, 0]">
                  上传文件
                </q-tooltip>
              </el-upload>
              <q-btn dense flat icon="jimu-caidan2" style="width: 40px">
                <q-tooltip :offset="[0, 0]">
                  操作
                </q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="full-width column" style="flex-grow: 1">
            <transition enter-active-class="animate__animated animate__bounceIn">
              <q-scroll-area class="fit" :visible="false">
                <draggable :list="ctx.ui.knowledge.files"
                           animation="100"
                           style="flex-wrap: nowrap"
                >
                  <template #item="item">
                    <FileUI :info="item.element" :index="item.index" @openFile="openFile" @select-file="selectFile"/>
                  </template>
                </draggable>
              </q-scroll-area>
            </transition>
          </div>
        </div>
      </div>
    </q-card>
    <CreateFolderUI v-model="createFolderFlag" title="新建文件夹" :pid="pid" @success="createFolder"/>
    <CreateKnowledge v-model="createKnowledgeFlag" title="新建知识库" @success="openGenUI"/>
    <GenKnowledgeUI ref="gen" v-model="genKnowledgeFlag"/>
  </q-dialog>
</template>
<script setup lang="ts">
import ScrollX from "@/components/tool-components/chatGptTool/widget/knowledge/ScrollX.vue";
import {ref, watch} from "vue";
import {getFiles} from "@/components/tool-components/chatGptTool/chatRequest";
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {Tree} from "@/components/system-components/model/system";
import {
  AppChatKnowledgeFile,
  AppChatKnowledgeFileType,
} from "@/components/tool-components/chatGptTool/model/model";
import draggable from 'vuedraggable'
import CreateFolderUI from "@/components/tool-components/chatGptTool/widget/knowledge/CreateFolderUI.vue";
import {GetHeaders} from "@/plugins/axiosutil";
import {ElMessage, UploadProps} from "element-plus";
import CreateKnowledge from "@/components/tool-components/chatGptTool/chat/message-tool-bar/knowledge-manage/CreateKnowledge.vue";


const manageRef = ref(null)
const ctx = useGptStore()
const pid = ref('')
const checkedAll = ref(false)
const checkedAllRef = ref(null)
const fileUploadFlag = ref(false)
const uploadFile = ref(null)
const model = defineModel({default: false})
const gen = ref()
const files = ref<any[]>([])

// 当前目录中的勾选列表
const selectIds = ref<string[]>([])

const createFolderFlag = ref(false)
const createKnowledgeFlag = ref(false)
const genKnowledgeFlag = ref(false)

function uploadData() {
  return {
    pid: pid.value,
  }
}

const handleFileSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  if (response.code === 200) {
    ElMessage({
      message: "上传成功",
      type: 'success',
      plain: true,
      appendTo: document.getElementById('knowledge-file-manage')
    })
    refresh()
  }
}

const beforeFileUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!rawFile.name.endsWith('.docx')) {
    ElMessage({
      message: '只能上传docx文档',
      type: 'warning',
      plain: true,
      appendTo: document.getElementById('knowledge-file-manage')
    })
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage({
      message: '最大上传10MB',
      type: 'warning',
      plain: true,
      appendTo: document.getElementById('knowledge-file-manage')
    })
    return false
  }
  return true
}

function openCreate() {
  ctx.ui.knowledge.files.forEach(item => {
    if (item.entity.check && item.entity.fileType == AppChatKnowledgeFileType.File) {
      files.value.push(item.entity.id)
    }
  })
  if (files.value.length == 0) {
    let elementById = document.getElementById('knowledge-file-manage');
    console.log(elementById)
    ElMessage({
      message: '请选择文件',
      type: 'warning',
      plain: true,
      appendTo: elementById,
    })
    return
  }
  createKnowledgeFlag.value = true
}

function openGenUI(name: string) {
  genKnowledgeFlag.value = true
  // 获取选中的知识文件
  gen.value.beginGen(name, files.value)
  files.value = []
}

function selectAllFile(value: boolean) {
  ctx.ui.knowledge.files.forEach(item => {
    item.entity.check = value
  })
}

/*
* @description 触发打开文件
* */
function openFile(fileTree: Tree<AppChatKnowledgeFile>) {
  checkedAll.value = false
  ctx.ui.knowledge.nva.push(fileTree)
  ctx.ui.knowledge.files = fileTree.children
  pid.value = fileTree.entity.id
}


/*
* @description 触发文件勾选
* */
function selectFile(file: Tree<AppChatKnowledgeFile>, flag: boolean) {
  ctx.ui.knowledge.files.forEach(item => {
    if (item.entity.id === file.entity.id) {
      item.entity.check = flag
      if (flag) {
        selectIds.value.push(item.entity.id)
      } else {
        selectIds.value.splice(selectIds.value.indexOf(item.entity.id), 1)
      }
    }
  })
  checkedAll.value = !(selectIds.value.length == 0)
  if (checkedAll.value) {
    // 判断当前目录下是否全选
    checkedAll.value = selectIds.value.length == ctx.ui.knowledge.files.length
    if (!checkedAll.value) {
      // 设置半选状态
      checkedAll.value = null
    }
  }
}

function back(index: number, data: Tree<AppChatKnowledgeFile>) {
  // 最后一个数据不处理
  if (index === ctx.ui.knowledge.nva.length - 1) {
    return;
  }
  // 查看根数据
  if (index === 0) {
    ctx.ui.knowledge.nva = [{
      entity: {
        fileName: 'root'
      }
    }]
    checkedAll.value = false
    selectAllFile(false)
    ctx.ui.knowledge.files = ctx.ui.knowledge.root
    selectAllFile(false)
    pid.value = ''
    return
  }
  checkedAll.value = false
  selectAllFile(false)
  ctx.ui.knowledge.files = ctx.ui.knowledge.nva[index].children
  selectAllFile(false)
  // 计算 当前所有后面有几个元素
  let count = ctx.ui.knowledge.nva.length - 1 - index
  ctx.ui.knowledge.nva.splice(index + 1, count)
  // 更新当前pid
  pid.value = ctx.ui.knowledge.nva[ctx.ui.knowledge.nva.length - 1].id
}


function getFileList(pid: string) {
  // 初始化一定要走全部数据查询
  getFiles(pid).then(res => {
    ctx.ui.knowledge.files = res
    if (pid == '') {
      ctx.ui.knowledge.root = res
      ctx.ui.knowledge.nva = [{
        entity: {
          fileName: 'root'
        }
      }]
    }
  })
}

function createFolder() {
  refresh()
}

/*
* @description: 刷新数据
* 刷新当前文件
* 服务器重新获取最新的文件列表
* 更具当前的导航路径重新显示最新数据
* 此处更新只用处理当前显示的部分
* */
function refresh() {
  getFiles('').then(res => {
    // 初始化根导航
    ctx.ui.knowledge.nva = [{
      entity: {
        fileName: 'root'
      }
    }]
    ctx.ui.knowledge.root = res
    if (pid.value == '') {
      ctx.ui.knowledge.files = res
      return
    }
    navFile(res, pid.value);
  })
}

function navFile(files: Tree<AppChatKnowledgeFile>[], id: string): Tree<AppChatKnowledgeFile> | null {
  for (const file of files) {
    // 找到具体需要显示的文件目录
    if (file.entity.id === id) {
      ctx.ui.knowledge.nva.push(file)
      ctx.ui.knowledge.files = file.children
      return file
    }
    if (file.children.length > 0) {
      let fileTree = navFile(file.children, id);
      // 如果找到了 当前的目录需要加入到导航
      if (fileTree != null) {
        ctx.ui.knowledge.nva.push(file)
        return file
      }
    }
  }
  return
}


function destroy() {
  pid.value = ''
}

function init() {
  getFileList(pid.value)
}

function close() {
  destroy()
}


watch(model, (newVal) => {
  if (newVal === false) {
    close()
  } else {
    init()
  }
})

</script>


<style scoped>

</style>
<style>
#knowledge-file-manage .q-breadcrumbs .flex.items-center.justify-start {
  flex-wrap: nowrap !important;
}

#knowledge-file-manage .el-message {
  position: absolute;
}

</style>