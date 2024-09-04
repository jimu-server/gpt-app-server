<template>
  <div id="task" class="fit">
    <!--  :style="{height:ctx.ui.page.height}"  -->
    <q-scroll-area class="fit" ref="taskScroll">
      <table id="task-table" cellspacing="0" @mousedown.left="down" @mouseup.left="up">
        <tr v-for="(i,row_index) in row" class="table-tow" :row="i">
          <!--    :rowspan="0" :colspan="0"      -->
          <td :ref="el=> {initCellRef(row_index,col_index,el)}" v-for="(j,col_index) in col" class="table-col"
              :id="'table_'+row_index+'_'+col_index" :row="row_index"
              :col="col_index"
              :rowspan="1"
              :colspan="1" @mousemove="overCell">
            <div class="fit table-cell">
              <slot :row="i" :col="j">
                <!-- table 第一行 -->
                <template v-if="i==1 && j>1">
                  <div class="fit column justify-center">
                    <div style="text-align: center">
                      {{ j - 1 }} 日
                    </div>
                    <div style="text-align: center">
                      ({{ getDay(j - 1) }})
                    </div>
                  </div>
                </template>
                <!-- table 第一列 -->
                <template v-if="i>1 && j==1">
                  <div class="fit column justify-center" style="text-align: center">
                    <!--                    {{ times[i - 1].hour }}:{{ times[i - 1].minute }}:{{times[i - 1].second }}-->
                    {{ times[i - 2] }}
                  </div>
                </template>
                <!-- 其他单元格 -->
                <template v-if="i>1 && j>1">
                  <div>
                    {{ i }}:{{ j }}
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

const props = defineProps({
  data: {
    type: Date,
    default: new Date()
  }
})

const ctx = useGptStore()

const splitterModel = ref(30)

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


// times
const times = ref([])

const isSelectClicked = ref(false)

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

const cells = ref([])
// 选中单元格 js 获取24 小时 按照分钟间隔的字符串数组
const selectedCell = ref<any[]>([])


function initCellRef(i, j, v) {
  if (cells.value.length == i) {
    cells.value.push([])
    // console.log("initCellRef", i, j, cells.value.length)
  }
  // console.log(cells.value[i])
  cells.value[i].push(v)
}


function down(event) {
  cleanSelect()
  let x = event.pageX
  let y = event.pageY
  let Cell = document.elementFromPoint(x, y);
  let Row = parseInt(Cell.getAttribute("row"))
  let Col = parseInt(Cell.getAttribute("col"))
  // console.log("star:", Row, Col)
  if (Row == 0 || Col == 0) {
    return
  }
  isSelectClicked.value = true
  selected.value.start.row = Row
  selected.value.start.col = Col
}

function up(event) {
  let x = event.pageX
  let y = event.pageY
  let Cell = document.elementFromPoint(x, y);
  let Row = parseInt(Cell.getAttribute("row"))
  let Col = parseInt(Cell.getAttribute("col"))
  // 特殊处理
  if (Row == 0 || Col == 0) {
    isSelectClicked.value = false
    return
  }

  // 同一单元格 移动
  if (selected.value.start.row == Row && selected.value.start.col == Col) {
    isSelectClicked.value = false
    selected.value.end.row = 0
    selected.value.end.col = 0
    return
  }
  selected.value.end.row = Row
  selected.value.end.col = Col
  isSelectClicked.value = false
  // 保存选中面积
  selectedArea.value.start.row = selected.value.start.row
  selectedArea.value.start.col = selected.value.start.col
  selectedArea.value.end.row = selected.value.end.row
  selectedArea.value.end.col = selected.value.end.col

  selected.value.start.row = 0
  selected.value.start.col = 0
  selected.value.end.row = 0
  selected.value.end.col = 0
}





function select_Cell(row, col) {
  selected.value.end.row = row
  selected.value.end.col = col
}

function overCell(event) {
  if (isSelectClicked.value) {
    let Row = parseInt(event.target.getAttribute("row"))
    let Col = parseInt(event.target.getAttribute("col"))
    // 不选 第一行和第一列的单元格
    if (Row == 0 || Col == 0) {
      return
    }
    selected.value.end.row = Row
    selected.value.end.col = Col

    // debounce(select_Cell, 100)(Row, Col)

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


function addSelect(value: HTMLElement) {
  if (!selectedCell.value.includes(value)) {
    selectedCell.value.push(value)
  }
}

const cleanSelect = () => {
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
  // 设置选中面积为
  selectedArea.value.start.row = 0
  selectedArea.value.start.col = 0
  selectedArea.value.end.row = 0
  selectedArea.value.end.col = 0
}

watch(() => selectedArea, (value) => {
  if (isSelectClicked.value) {
    // 计算当前选中区域 的外轮廓边框
    if (selected.value.end.row == 0 || selected.value.end.col == 0) {

    }
    // js 生成一天的时间段 ,按照每小时为一个间隔返回一个顺序的数组
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


function margeCell() {
  // 没有处于拖动选择的适合可以合并
  if (!isSelectClicked.value) {
    // 排除一个单元格情况
    if (selectedArea.value.end.row == 0 || selectedArea.value.end.col == 0) {
      return
    }
    // 合并单元格需要判断选择单元格的方向 找到主方向 单元格合并是 从左往右 从上往下的方向合并
  }
}


function selectCell(value) {
  if (isSelectClicked.value) {
    // 取出第一个单元格 赋值指定特殊样式
    cleanSelect()
    // console.log(cells.value[value.value.start.row][value.value.start.col])
    // let firstCell = document.getElementById("table_" + value.value.start.row + "_" + value.value.start.col)
    let firstCell = cells.value[value.value.start.row][value.value.start.col]
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
        // 特殊处理 不纳入选中范围
        if (i == 0) {
          continue
        }
        for (let j = value.value.start.col; j <= value.value.end.col; j++) {
          // 特殊处理 不纳入选中范围
          if (j == 0) {
            continue
          }
          // selectedCell.value.push(document.getElementById("table_" + i + "_" + j))
          selectedCell.value.push(cells.value[i][j])
        }
      }
    } else if (isReverseX && !isReverseY) {
      // 向右上选取
      // console.log("右上")
      for (let i = value.value.end.row; i <= value.value.start.row; i++) {
        // 特殊处理 不纳入选中范围
        if (i == 0) {
          continue
        }
        for (let j = value.value.start.col; j <= value.value.end.col; j++) {
          // 特殊处理 不纳入选中范围
          if (j == 0) {
            continue
          }
          // selectedCell.value.push(document.getElementById("table_" + i + "_" + j))
          selectedCell.value.push(cells.value[i][j])
        }
      }
    } else if (!isReverseX && isReverseY) {
      // 向左下选取
      // console.log("左下")
      for (let i = value.value.start.row; i <= value.value.end.row; i++) {
        if (i == 0) {
          continue
        }
        for (let j = value.value.end.col; j <= value.value.start.col; j++) {
          if (j == 0) {
            continue
          }
          // selectedCell.value.push(document.getElementById("table_" + i + "_" + j))
          selectedCell.value.push(cells.value[i][j])
        }
      }
    } else if (!isReverseX && !isReverseY) {
      // 向左上选取
      // console.log("左上")
      for (let i = value.value.end.row; i <= value.value.start.row; i++) {
        if (i == 0) {
          continue
        }
        for (let j = value.value.end.col; j <= value.value.start.col; j++) {
          if (j == 0) {
            continue
          }
          // selectedCell.value.push(document.getElementById("table_" + i + "_" + j))
          selectedCell.value.push(cells.value[i][j])
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


function getDayTimeIntervals() {
  let now = new Date();
  let day = now.getDate();
  let month = now.getMonth() + 1;
  let year = now.getFullYear();

  let hours = [];

  for (let i = 0; i < 24; i++) {
    let hour = i;
    let minute = 0;
    let second = 0;

    hours.push(hour + ":" + minute + ":" + second);
  }

  return hours;
}


function getDayTimeMinuteIntervals() {
  let times = [];
  for (let i = 0; i < 24; i++) {
    let hour = i;
    let hour_str = hour.toString()
    if (hour < 10) {
      hour_str = '0' + hour_str
    }
    for (let j = 0; j < 60; j++) {
      let minute = j;
      if (minute % 30 != 0) {
        continue
      }
      let minute_str = minute.toString();
      if (minute < 10) {
        minute_str = '0' + minute_str;
      }
      times.push(hour_str + ":" + minute_str + ":00");
    }
  }
  return times;
}

function getDay(date) {
  let days = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  props.data.setDate(date);
  return days[props.data.getDay()];
}

function getDays(date) {
  let d = new Date(date)
  // 将日期设置为下月一号
  d.setMonth(d.getMonth() + 1)
  d.setDate(1)
  // 获取本月最后一天
  d.setDate(d.getDate() - 1)

  return d.getDate()
}

watch(() => selected, (value) => {
  // debounce(selectCell,50)(value)
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

  // 初始化行头
  // times.value = getDayTimeIntervals()
  times.value = getDayTimeMinuteIntervals()
  console.log(times.value)
  row.value = times.value.length + 1

  // 初始化 列头
  col.value = getDays(props.data) + 1

  setTimeout(() => {


    // 初始化固定 第一列和第一行位置
    let firstCols = []
    let firstRows = []

    for (let i = 0; i < col.value; i++) {
      firstRows.push(cells.value[0][i])
    }
    for (let i = 0; i < row.value; i++) {
      firstCols.push(cells.value[i][0])
    }

    // 此处变更 使用添加类来设置第一行和第一列的样式
    // 有复杂需求则需要变更编程方式设置
    firstCols.forEach(item => {
      // let rect = item.getBoundingClientRect();
      // item.style.position = "sticky"
      // item.style.left = 0
      // // item.style.top = rect.top + "px"
      // item.style.zIndex = 1
      item.classList.add("firstCols")
    })
    firstRows.forEach(item => {
      // let rect = item.getBoundingClientRect();
      // item.style.position = "sticky"
      // // item.style.left = rect.left + "px"
      // item.style.top = 0
      // item.style.zIndex = 1
      item.classList.add("firstRows")
    })
  }, 1000)
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