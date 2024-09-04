<template>
  <div class="editor fit column" @click="Focus" style="overflow: hidden;position: relative">
    <div ref="editorArea" class="fit" id="editor" @paste="Paste" spellcheck="false"></div>
  </div>
</template>

<script setup lang="ts">

import {onMounted, onUnmounted, reactive, ref, watch} from "vue";


// CKEditorInspector 编辑器开发的检查工具
// @ts-ignore
import CKEditorInspector from "@ckeditor/ckeditor5-inspector";
// @ts-ignore
import {Link, LinkImage} from "@ckeditor/ckeditor5-link";
import {colors} from "quasar";

import {BalloonEditor} from "@ckeditor/ckeditor5-editor-balloon";
import {keyCodes} from '@ckeditor/ckeditor5-utils/src/keyboard';

import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";
import {ChatMessageEntity, MessageItem, MessageType} from "@/components/tool-components/chatGptTool/model/chat";
import {createEditor} from "@/components/tool-components/chatGptTool/chat/editor/ckeditor";
import {TextWatcher} from "@ckeditor/ckeditor5-typing";
import {createRegExp} from "@ckeditor/ckeditor5-mention/src/mentionui";
import {useAiPluginStore} from "@/components/tool-components/chatGptTool/store/plugin";


const {getPaletteColor} = colors

const emits = defineEmits({
  send: function (data: ChatMessageEntity[]) {

  },
  input: function (data: string) {

  }
})
defineExpose({
  insert,
  Message,
  Clear
})
const props = defineProps({
  shame: {
    type: Boolean,
    default: false
  },
})

const editorArea = ref()
// 编辑器 当前的字符数量双向绑定
const characters = defineModel('characters', {default: 0})
const ctx = useGptStore()
const plugin = useAiPluginStore()
// 当前编辑器是否处于回复消息状态
const isRef = ref(false)

// 当前回复的消息
const message = ref<MessageItem>(null)

// 编辑器对象
let editor: BalloonEditor = null

let editorContent = ''

// 编辑器的配置 (相对固定的比一部分配置)
const editorConfig = {
  wordCount: {
    onUpdate: stats => {
      characters.value = stats.characters
    }
  }
}

const toolbar = ref()

function insert(data: ChatMessageEntity) {
  switch (data.contentType) {
      // 插入文本消息
    case MessageType.TextMessage:
      editor.model.change(writer => {
        const insertPosition = editor.model.document.selection.getFirstPosition();
        editor.model.insertContent(writer.createText(data.data), insertPosition);
      });
      break
      // 插入视频消息
    case MessageType.VideoMessage:
      break
    default:
  }
  editor.editing.view.focus();
}


/*
* @description: 清空编辑器内容
* 一般用于关闭当前会话,发送完一次消息以后
* */
function Clear() {
  editor.setData('')
  editor.editing.view.focus()
}

/*
* 解析编辑器中的内容元素返回到上层
* */
function Message(): ChatMessageEntity[] {
  return analyze()
}


/*
* @description 解析编辑器中的 dom树,当前的消息解析需要兼容 openIM 的消息格式
* */
function analyze(): ChatMessageEntity[] {
  let arr: ChatMessageEntity[] = []
  let data = ""
  let editorData = editor.getData()
  let doc = new DOMParser()
  let msg = doc.parseFromString(editorData, 'text/html').body
  for (let i = 0; i < msg.childNodes.length; i++) {
    let node = msg.childNodes[i]
    switch (node.nodeType) {
        // html 节点
      case 1:
        switch (node.nodeName) {
          case "P":
            let content = node.textContent;
            let replaceAll = content.replace(/^\s+|\s+$/g, '');
            if (replaceAll != "") {
              data += node.textContent + "\n"
            }
            break
          case "DIV":
            gen(arr, data)
            data = ""
            let element = (node as HTMLElement)
            if (element.attributes.getNamedItem('src') != null) {
              arr.push({
                contentType: MessageType.PictureMessage,
                data: element.attributes.getNamedItem('src').value,
              })
            }
            if (element.classList.contains('file-block-card')) {
              arr.push({
                contentType: MessageType.FileMessage,
                data: {
                  file: element.attributes.getNamedItem('path').value,
                }
              })
            }
            break
          case "VIDEO":
            gen(arr, data)
            data = ""
            // 存储视频消息
            break
        }
        break
        // 字符串 节点
      case 3:
        data += node.nodeValue + '\n'
        break
    }
  }
  if (data != "") {
    gen(arr, data)
  }
  return arr
}

function gen(arr: ChatMessageEntity[], data: string) {
  if (data != "") {
    let obj: ChatMessageEntity = {
      contentType: MessageType.TextMessage,
      data: data
    }
    arr.push(obj)
  }
}

async function Paste(event: ClipboardEvent) {
  event.preventDefault();
  let items = event.clipboardData.items
  for (let i = 0; i < items.length; i++) {
    let item = items[i]
    let blob = item.getAsFile()
    switch (item.kind) {
      case "file":
        if (item.type.startsWith("image/")) {
          copyImage(blob)
        }
        if (item.type.startsWith("video/")) {
          console.log("粘贴视频:", item.type)
        }
        // 复制粘贴文件
        if (item.type.startsWith("application/")) {
          editor.execute('insertFile', blob)
        }
        break
      case "string":
        break
    }
  }
}

function Focus(event: MouseEvent) {
  editor.editing.view.focus();
}

/*
* @description 给编辑器添加自定义的拖拽功能处理
* */
function handleDrop(event: DragEvent) {
  let files = event.dataTransfer.files;
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    if (file.type.startsWith("image/")) {
      copyImage(file)
    }
    if (file.type.startsWith("video/")) {
      copyVideo(file)
    }
    if (file.type.startsWith("application/")) {
      editor.execute('insertFile', file)
    }
  }
}

/*
* @description 把图片复制到编辑器中
* */
function copyImage(file: Blob) {
  // 读取图片内容
  let reader = new FileReader()
  reader.addEventListener("load", async () => {
    editor.execute('addImage', {
      src: reader.result as string,
    });
  })
  reader.readAsDataURL(file)
}

/*
* @description 把视频复制到编辑器中
* */
function copyVideo(file: Blob) {

}

/*
 * @description: 检查当前选中插件的模型已经安装到本地,若本地未安装,则经用编辑器并且禁用发送按钮
 * */
watch(() => plugin.currentPlugin, (value) => {
  // 检查插件在本地是否存在插件所需要用到的模型
  let number = ctx.ui.modelList.findIndex(item => {
    return item.model === value.model
  });
  if (editor) {
    if (number === -1) {
      editor.enableReadOnlyMode('editor')
      ctx.ui.sendDisable = true
      return
    }
    ctx.ui.sendDisable = false
    editor.disableReadOnlyMode('editor');
  }
})


onMounted(async () => {
  let elementById = document.querySelector("#editor") as HTMLElement;
  // 初始化编辑器
  editor = await createEditor(elementById, {...editorConfig, ...toolbar.value})
  EditorEvents(editor)
})

function EditorEvents(editor: BalloonEditor) {
  // 监听实现删除整个 小部件
  editor.editing.view.document.on('keydown', (event, data) => {
    if (data.keyCode === keyCodes.delete || data.keyCode === keyCodes.backspace) {
      const selection = editor.model.document.selection;
      // console.log(selection.focus.nodeBefore)
      if (selection.focus.nodeBefore &&
          (
              (selection.focus.nodeBefore.hasAttribute("mention")) ||
              (selection.focus.nodeBefore.hasAttribute("path")) ||
              (selection.focus.nodeBefore.hasAttribute("src"))
          )
      ) {
        console.log(selection.focus.nodeBefore)
        editor.model.change(writer => {
          writer.remove(selection.focus.nodeBefore)
        })
        data.preventDefault()
        event.stop()
      }
    }
  })

  // 监听实现快捷键组合发送消息
  editor.editing.view.document.on('keydown', (event, data) => {
    // 判断 ctrl+enter 组合发送消息
    if (keyCodes.enter === data.keyCode && data.ctrlKey && !ctx.ui.replying) {
      // 检查当前的消息模式
      if (ctx.ui.send) {
        console.log('ctrl+enter')
        // 执行发送消息触发事件
        let msg = Message()
        emits('send', msg)
        data.preventDefault()
        event.stop()
      } else {
        editor.model.change(writer => {
          editor.model.insertContent(writer.createElement('softBreak'), editor.model.document.selection);
        })
      }
    }

    // 没有 按住 ctrl 使用 enter 发送消息
    if (keyCodes.enter === data.keyCode && !data.ctrlKey && !ctx.ui.replying) {
      if (!ctx.ui.send) {
        console.log('enter')
        // 执行发送消息触发事件
        let msg = Message()
        emits('send', msg)
        data.preventDefault()
        event.stop()
      }
    }
  })

  // 监听编辑器的删除动作 Delete 和 Backspace
  editor.editing.view.document.on('delete', (eventInfo, data) => {
    // 判断 在有引用回复消息的时候 清空引用回复
    if (characters.value == 0 && isRef.value == true) {
      isRef.value = false
      message.value = null
    }
  })

  // 保存当前编辑器的内容
  editor.model.document.on('change:data', () => {  // Listen to all changes in model.
    editorContent = editor.getData()
    emits('input', editorContent)
  });

  // 文本观察器
  const watcher = new TextWatcher(editor.model, createTestCallback('/', 0));
  watcher.on('matched', (evt, data) => {

  });
  watcher.on('unmatched', () => {
    console.log("unmatched")
  });
}

function createTestCallback(marker, minimumCharacters) {
  const regExp = createRegExp(marker, minimumCharacters);

  return text => regExp.test(text);
}

onUnmounted(() => {

})

</script>


<style scoped>

#editor {
  padding-left: 5px;
  overflow: auto;
}
</style>

<style>
.editor .ck.ck-content.ck-editor__editable {
  border: none !important;
  box-shadow: none !important;
}

/* 对编辑器中 p 进行强制换行显示*/
.editor .ck.ck-content.ck-editor__editable p {
  padding: 0 !important;
  margin: 0 !important;
  word-break: break-all;
}

.editor .ck .ck-widget {
  /*去除编辑器小部件的选中和取消选中的 轮廓变化过度*/
  transition: none;
}

.editor .ck .ck-widget:hover {
  outline: none;
}

.editor .ck .ck-widget.ck-widget_selected, .ck .ck-widget.ck-widget_selected:hover {
  outline: rgba(37, 32, 32, 0.21) 1px solid !important;
}

/* 删除 CKEditor 的商标 */
.ck.ck-powered-by {
  display: none !important;
}


/* 修改 @ 部件的样式 */
:root {
  /* 修改 At 消息的 @xxx 背景颜色 */
  --ck-color-mention-background: hsla(60, 11%, 96%, 0);

  /* 修改 At 消息的 @xxx 文本颜色 */
  --ck-color-mention-text: hsl(210, 77%, 46%);
  /* 修改过拽文件时候的光标颜色 */
  --ck-clipboard-drop-target-color: hsl(210, 77%, 46%);
  /* 修改内联块失去选中的 轮廓大小 */
  --ck-widget-outline-thickness: 1px;
}

.ck-balloon-rotator__content {

}

/* 修改 @ 列表的高度 */
.ck.ck-reset.ck-list.ck-mentions {
  height: 100px !important;
  overflow: auto;
}

/* 修改代码快的块样式 */
.editor .ck-content pre {
  padding: 1em !important;
  background-color: rgba(227, 231, 232, 0.38) !important;
  border-radius: 3px !important;
}

.ck-read-only {
  background-color: rgba(245, 245, 245, 0.33);
}

</style>