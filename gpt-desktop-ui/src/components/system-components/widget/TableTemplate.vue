<template>
  <div id="task" class="fit">
    <q-scroll-area  class="fit" ref="taskScroll" :style="{height: ctx.ui.page.height}">
      <table id="task-table" cellspacing="0" @mousedown.left="down" @mouseup.left="up">
        <tr class="table-tow" :row="i" v-for="i in row">
          <td class="table-col" :row="i"  :col="j" v-for="j in col" @mousemove="overCell">
            <div class="fit table-cell">
              <slot :row="i" :col="j">
                <!-- table 第一行 -->
                <template v-if="i==1 && j>1">
                  <div class="fit column justify-center" style="text-align: center">
                    {{ j - 1 }}日
                  </div>
                </template>
                <!-- table 第一列 -->
                <template v-if="i>1 && j==1">
                  <div class="fit column justify-center" style="text-align: center">
                    {{ i - 1 }}h
                  </div>
                </template>
                <!-- 其他单元格 -->
                <template v-if="i>1 && j>1">
                  <div>
                    <div>
                      {{ i }}:{{ j }}
                    </div>
                  </div>
                </template>
              </slot>
            </div>
          </td>
        </tr>
      </table>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";

import {colors} from 'quasar'
import {useGptStore} from "@/components/tool-components/chatGptTool/store/gpt";

const {getPaletteColor} = colors

const ctx = useGptStore()


const taskBox = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0
})

const taskScroll = ref()
// 行叔
const row = ref(25)
// 列数
const col = ref(32)

const isClicked = ref(false)

// 是否选中
const selected = ref({
  start: {
    row: 0,
    col: 0
  },
  end: {
    row: 0,
    col: 0
  }
})

// 选中区域面积
const selectedArea = ref({
  start: {
    row: 0,
    col: 0
  },
  end: {
    row: 0,
    col: 0
  }
})

const cells = ref<HTMLElement[]>([])
// 选中单元格
const selectedCell = ref<HTMLElement[]>([])

const date = ref('2019/02/01')


function down(event) {
  cleanSelect()
  let x = event.pageX
  let y = event.pageY
  let Cell = document.elementFromPoint(x, y);
  let Row = parseInt(Cell.getAttribute("row"))
  let Col = parseInt(Cell.getAttribute("col"))
  if (Row == 1 || Col == 1) {
    return
  }
  isClicked.value = true
  selected.value.start.row = Row
  selected.value.start.col = Col
}

function up(event) {
  let x = event.pageX
  let y = event.pageY
  let Cell = document.elementFromPoint(x, y);
  let Row = parseInt(Cell.getAttribute("row"))
  let Col = parseInt(Cell.getAttribute("col"))
  if (Row == 1 || Col == 1) {
    isClicked.value = false
    return
  }
  selected.value.end.row = Row
  selected.value.end.col = Col
  isClicked.value = false
  // 保存选中面积
  selectedArea.value = {...selected.value}
  selected.value.start.row = 0
  selected.value.start.col = 0
  selected.value.end.row = 0
  selected.value.end.col = 0
}


function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}


function overCell(event) {
  if (isClicked.value) {
    let Row = parseInt(event.target.getAttribute("row"))
    let Col = parseInt(event.target.getAttribute("col"))
    if (Row == 1 || Col == 1) {
      return
    }
    selected.value.end.row = event.target.getAttribute("row")
    selected.value.end.col = event.target.getAttribute("col")

    // 获取当前选
    // if (event.clientX+200>taskBox.value.width){
    //     taskScroll.value.setScrollPosition('horizontal',400)
    // }
    // console.log(event.clientX, event.clientY)

  }
}

function edit(event) {
  event.target.style.userSelect = "auto"
  event.target.setAttribute("contenteditable", "true")
}


const cleanSelect = () => {
  // selectedCell.value = []
  // for (let i = 0; i < cells.value.length; i++) {
  //   cells.value[i].classList.remove("cell_selected")
  //   cells.value[i].style.userSelect = "none"
  //   // 取消编辑属性
  //   cells.value[i].setAttribute("contenteditable", "false")
  // }

  // 优化只情况选中区域
  let items = selectedCell.value
  selectedCell.value = []
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("cell_selected")
    items[i].classList.remove("first_selected_cell")
    items[i].style.userSelect = "none"
    // 取消编辑属性
    items[i].setAttribute("contenteditable", "false")
  }
}

watch(() => selectedArea, (value) => {
  if (isClicked.value) {
    // 计算当前选中区域 的外轮廓边框
    if (selected.value.end.row == 0 || selected.value.end.col == 0) {

    }

    let top = []
    let bottom = []
    let left = []
    let right = []

    // 顶部

    // 底部

    // 左侧

    // 右侧

  }
})


function selectCell(value) {
  if (isClicked.value) {
    // 取出第一个单元格 赋值指定特殊样式
    cleanSelect()
    let firstCell = document.getElementById("table_" + selected.value.start.row + "_" + selected.value.start.col)
    if (value.value.end.row == 0 || value.value.end.col == 0) {
      firstCell.classList.remove("cell_selected")
      firstCell.classList.add("first_selected_cell")
      selectedCell.value.push(firstCell)
      return
    }

    selectedCell.value = []
    // 计算方向
    let isReverseY = selected.value.start.row < selected.value.end.row   // 默认选取向下框选
    let isReverseX = selected.value.start.col < selected.value.end.col  // 默认选取向右框选


    if (isReverseX && isReverseY) {
      // 向右下选取
      // console.log("右下")
      for (let i = value.value.start.row; i <= value.value.end.row; i++) {
        if (i == 1) {
          continue
        }
        for (let j = value.value.start.col; j <= value.value.end.col; j++) {
          if (j == 1) {
            continue
          }
          selectedCell.value.push(document.getElementById("table_" + i + "_" + j))
        }
      }
    } else if (isReverseX && !isReverseY) {
      // 向右上选取
      // console.log("右上")
      for (let i = value.value.end.row; i <= value.value.start.row; i++) {
        if (i == 1) {
          continue
        }
        for (let j = value.value.start.col; j <= value.value.end.col; j++) {
          if (j == 1) {
            continue
          }
          selectedCell.value.push(document.getElementById("table_" + i + "_" + j))
        }
      }
    } else if (!isReverseX && isReverseY) {
      // 向左下选取
      // console.log("左下")
      for (let i = value.value.start.row; i <= value.value.end.row; i++) {
        if (i == 1) {
          continue
        }
        for (let j = value.value.end.col; j <= value.value.start.col; j++) {
          if (j == 1) {
            continue
          }
          selectedCell.value.push(document.getElementById("table_" + i + "_" + j))
        }
      }
    } else if (!isReverseX && !isReverseY) {
      // 向左上选取
      // console.log("左上")
      for (let i = value.value.end.row; i <= value.value.start.row; i++) {
        if (i == 1) {
          continue
        }
        for (let j = value.value.end.col; j <= value.value.start.col; j++) {
          if (j == 1) {
            continue
          }
          selectedCell.value.push(document.getElementById("table_" + i + "_" + j))
        }
      }
    }

    selectedCell.value.forEach(item => {
      item.classList.add("cell_selected")
    })
    firstCell.classList.remove("cell_selected")
    firstCell.classList.add("first_selected_cell")
  }
}

watch(() => selected, (value) => {
  selectCell(value)
}, {deep: true})


onMounted(() => {
  // 初始表格的坐标位置 以及表格的宽度和高度
  let task = document.getElementById("task")
  taskBox.value.width = task.clientWidth
  taskBox.value.height = task.clientHeight
  taskBox.value.x = task.getBoundingClientRect().left
  taskBox.value.y = task.getBoundingClientRect().top
  console.log(taskBox.value)

  // 初始化固定 第一列和第一行位置
  // let firstCols = []
  // let firstRows = []
  //
  // for (let i = 1; i <= col.value; i++) {
  //   let elementById = document.getElementById("table_" + 1 + "_" + i);
  //   if (elementById) {
  //     firstCols.push(elementById)
  //   }
  // }
  // for (let i = 1; i <= row.value; i++) {
  //   firstCols.push(document.getElementById("table_" + i + "_" + 1))
  // }
  //
  // // 此处变更 使用添加类来设置第一行和第一列的样式
  // // 有复杂需求则需要变更编程方式设置
  // firstCols.forEach(item => {
  //   // let rect = item.getBoundingClientRect();
  //   // item.style.position = "sticky"
  //   // item.style.left = 0
  //   // // item.style.top = rect.top + "px"
  //   // item.style.zIndex = 1
  //   item.classList.add("firstCols")
  // })
  // firstRows.forEach(item => {
  //   // let rect = item.getBoundingClientRect();
  //   // item.style.position = "sticky"
  //   // // item.style.left = rect.left + "px"
  //   // item.style.top = 0
  //   // item.style.zIndex = 1
  //   item.classList.add("firstRows")
  // })

})


</script>


<style scoped>

#task-table {
  width: 2000px;
}

.table-col {
  position: relative;
  width: 200px;
  height: 30px;
  user-select: none;
  border-color: rgba(222, 222, 222, 0.34);
  border-style: solid;
  border-width: 1px;

}

.table-tow {

}

.table-cell {
  pointer-events: none;
  background: transparent;
}


.table-col:hover {
  //background-color: rgba(194, 198, 201, 0.31);
}

.cell_selected {
  background-color: v-bind('getPaletteColor("blue-2")');
}

.first_selected_cell {
  border-color: v-bind('getPaletteColor("blue-2")');
  background: transparent;
}

.firstRows {
  position: sticky;
  top: 0;
  padding: 0;
  z-index: 1;
  border-color: v-bind('getPaletteColor("primary")');
  background: v-bind('getPaletteColor("primary")');
  color: white;
  text-align: center;
}

.firstCols {
  position: sticky;
  padding: 0;
  left: 0;
  z-index: 1;
  border-color: v-bind('getPaletteColor("primary")');
  background: v-bind('getPaletteColor("primary")');
  color: white;
  text-align: center;
}


</style>