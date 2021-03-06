<template>
  <div
    :class="{
      canvas: true,
      'small-grid': small && showGrid,
      'big-grid': !small && showGrid,
      'no-grid': !showGrid,
      grab: isDraging,
    }"
    @mousemove.prevent="draging($event)"
    @mouseup.prevent="dragEnd($event)"
  >
    <div
      :class="{
        box: true,
        grab: isDraging,
      }"
      @mousedown.prevent="dragStart($event)"
      :style="{
        left: `${boxPosition.x}px`,
        top: `${boxPosition.y}px`,
        backgroundColor: `${!isInTarget ? '#282A3A' : '#7EBF50'}`,
      }"
    ></div>
    <div
      class="target"
      :style="{
        left: `${targetPosition.x}px`,
        top: `${targetPosition.y}px`,
      }"
    ></div>
  </div>
  <div
    style="display: flex; flex-direction: column; align-items: center"
    v-if="debug"
  >
    <div>坐标为: {{ boxPosition.x }} {{ boxPosition.y }}</div>
    <div style="margin-top: 1rem">可以通过 Shift 切换网格大小</div>
    <div style="margin-top: 0rem">网格大小 {{ small ? "80px" : "160px" }}</div>

    <el-switch
      style="margin: 0.5rem"
      v-model="small"
      active-text="小网格"
      inactive-text="大网格"
    ></el-switch>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";

function generateArray(count, size) {
  // return [...Array(count).keys()].map((item) => item * size);
  let targetArray = [];
  for (let index = 0; index < count; index++) {
    if (index != 0) {
      targetArray.push(index * size - 60);
    }
    targetArray.push(index * size);
    if (index == count - 1) {
      targetArray.push((index + 1) * size - 60);
    }
  }
  // console.log(targetArray);
  return targetArray;
}

let bigRowArray = generateArray(6, 160);
let bigColumnArray = generateArray(4, 160);
let smallRowArray = generateArray(12, 80);
let smallColumnArray = generateArray(8, 80);

function getSnappingValue(originValue, gridArray) {
  let targetValue = 0;
  let distance = 1000000;
  gridArray.forEach((gridValue) => {
    if (Math.abs(originValue - gridValue) <= distance) {
      distance = Math.abs(originValue - gridValue);
      targetValue = gridValue;
    }
  });
  return targetValue;
}

export default {
  props: {
    isSnapping: {
      type: Boolean,
      default: true,
    },
    showGrid: {
      type: Boolean,
      default: true,
    },
    debug: {
      type: Boolean,
      default: false,
    },
    smallGridOnStart: { type: Boolean, default: false },
    updateFlag: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      small: false,
      isDraging: false,
      dragBuffer: {
        cursorXOnStart: 0,
        cursorYOnStart: 0,
        boxXOnStart: 0,
        boxYOnStart: 0,
        boxPositionX: 0,
        boxPositionX: 0,
      },
      boxPosition: {
        x: 160,
        y: 160,
      },
      targetPosition: {
        x: 160 * 4,
        y: 160 * 2,
      },
      isInTarget: false,
      showNotice: false,
      isResetting: false,
      isInTiming: false,
      time: {
        begin: 0,
        end: 0,
      },
    };
  },
  computed: {
    period() {
      return this.time.end - this.time.begin;
    },
  },
  emits: ["accomplish"],
  methods: {
    dragStart(event) {
      if (this.isResetting) {
        return;
      }

      if (!this.isInTiming) {
        let d = new Date();
        this.time.begin = d.getTime();
      }

      this.isInTiming = true;

      [this.dragBuffer.cursorXOnStart, this.dragBuffer.cursorYOnStart] =
        getCursorLocation(event, ".canvas");

      [this.dragBuffer.boxXOnStart, this.dragBuffer.boxYOnStart] = [
        this.boxPosition.x,
        this.boxPosition.y,
      ];

      this.isDraging = true;
      // console.log("start");
    },
    draging(event) {
      if (this.isResetting) {
        return;
      }

      if (this.isDraging == false) {
        return;
      }

      let [cursorX, cursorY] = getCursorLocation(event, ".canvas");
      let deltaX = cursorX - this.dragBuffer.cursorXOnStart;
      let deltaY = cursorY - this.dragBuffer.cursorYOnStart;
      // console.log(deltaX, deltaY);

      if (this.isSnapping) {
        // 吸附效果
        this.dragBuffer.boxPositionX = deltaX + this.dragBuffer.boxXOnStart;
        this.dragBuffer.boxPositionY = deltaY + this.dragBuffer.boxYOnStart;
        if (this.small) {
          // 小网格效果
          this.boxPosition.x = getSnappingValue(
            this.dragBuffer.boxPositionX,
            smallRowArray
          );
          this.boxPosition.y = getSnappingValue(
            this.dragBuffer.boxPositionY,
            smallColumnArray
          );
        } else {
          // 大网格效果
          this.boxPosition.x = getSnappingValue(
            this.dragBuffer.boxPositionX,
            bigRowArray
          );
          this.boxPosition.y = getSnappingValue(
            this.dragBuffer.boxPositionY,
            bigColumnArray
          );
        }
        // console.log(this.boxPosition);
      } else {
        // 无吸附效果
        this.boxPosition.x = deltaX + this.dragBuffer.boxXOnStart;
        this.boxPosition.y = deltaY + this.dragBuffer.boxYOnStart;
      }

      if (
        Math.abs(this.boxPosition.x - this.targetPosition.x) <= 4 &&
        Math.abs(this.boxPosition.y - this.targetPosition.y) <= 4
      ) {
        this.isInTarget = true;
      } else {
        this.isInTarget = false;
      }
    },
    dragEnd(event) {
      if (this.isResetting) {
        return;
      }

      if (this.isDraging == false) {
        return;
      }

      let d = new Date();
      this.time.end = d.getTime();

      this.isDraging = false;
      [this.cursorXOnStart, this.cursorYOnStart] = [0, 0];
      if (this.isInTarget) {
        // 已经拖到目的地
        [this.boxPosition.x, this.boxPosition.y] = [
          this.targetPosition.x,
          this.targetPosition.y,
        ];
        this.$emit("accomplish", this.period);
        // this.showNotice = true;
        ElMessage.success({
          message: `完成目标，用时 ${this.period} ms，即将进行下一轮...`,
          type: "success",
        });
        this.isResetting = true;

        setTimeout(() => {
          this.resetDrag();
        }, 1200);
      }
      // console.log("end");
    },
    resetDrag() {
      for (let key in this.dragBuffer) {
        this.dragBuffer[key] = 0;
      }
      this.boxPosition = { x: 160, y: 160 };
      this.showNotice = false;
      this.isInTarget = false;
      this.isResetting = false;
      this.isInTiming = false;

      let configs = require("../assets/grid.json");
      // console.log(configs);

      let key = Math.floor(Math.random() * configs.length);
      let config = configs[key];
      // console.log(key, config);

      let [startX, startY, targetX, targetY] = [
        config.start[0],
        config.start[1],
        config.target[0],
        config.target[1],
      ].map((item) => parseInt(item));

      this.boxPosition = {
        x: startX,
        y: startY,
      };
      this.targetPosition = {
        x: targetX,
        y: targetY,
      };
    },
    switch() {
      this.small = !this.small;
      console.log("switch");
      ElMessage.info({
        message: `切换到${this.small ? "小" : "大"}网格`,
        type: "success",
      });
    },
    listener(event) {
      if (event.shiftKey && event.key == "P") {
        this.switch();
      }
    },
  },
  created() {
    document.addEventListener("keydown", this.listener);
  },
  unmounted() {
    console.log("remove");
    document.removeEventListener("keydown", this.listener);
  },
  mounted() {
    this.small = this.smallGridOnStart;
    this.resetDrag();
  },
  watch: {
    // smallGridOnStart(newValue, OldValue) {
    //   this.small = newValue;
    //   console.log("small:", this.small);
    // },
    updateFlag(newValue, OldValue) {
      this.small = this.smallGridOnStart;
      console.log("small:", this.small);
    },
  },
};

function getCursorLocation(event, canvasSelector) {
  // 获取画布和鼠标相对于窗口的坐标，以计算鼠标相对于画布的坐标
  let canvasY = document
    .querySelector(canvasSelector)
    .getBoundingClientRect().top;
  let canvasX = document
    .querySelector(canvasSelector)
    .getBoundingClientRect().left;
  let cursorX = event.clientX - canvasX;
  let cursorY = event.clientY - canvasY;
  return [cursorX, cursorY];
}
</script>

<style lang="scss" scoped>
.canvas {
  width: 960px;
  height: 640px;
  border-top: solid gray 1px;
  border-left: solid gray 1px;
  border-bottom: solid transparent 1px;
  margin: auto;

  position: relative;
  overflow: hidden;
}

.big-grid {
  background: -webkit-linear-gradient(top, transparent 159px, gray 1px),
    -webkit-linear-gradient(left, transparent 159px, gray 1px);
  background-size: 160px 160px;
}

.small-grid {
  background: -webkit-linear-gradient(top, transparent 79px, gray 1px),
    -webkit-linear-gradient(left, transparent 79px, gray 1px);
  background-size: 80px 80px;
}

.no-grid {
  border: solid gray 1px;
}

.box {
  height: 60px;
  width: 60px;
  position: absolute;
  // background-color: goldenrod;
  z-index: 100;
  // transition: background-color ease-in-out 100ms;
}

.box:hover {
  cursor: -webkit-grab;
}

.grab:hover {
  cursor: -webkit-grabbing;
}

.target {
  height: 56px;
  width: 56px;
  position: absolute;
  // background: rgb(238, 238, 238);
  z-index: 0;
  border: dashed lightgrey 2px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>