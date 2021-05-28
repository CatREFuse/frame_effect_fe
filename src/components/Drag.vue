<template>
  <div
    :class="{
      canvas: true,
      'ismall-grid': ismall,
    }"
    @mousemove.prevent="draging($event)"
    @mouseup.prevent="dragEnd($event)"
  >
    <div
      class="box"
      @mousedown.prevent="dragStart($event)"
      :style="{
        left: `${boxPosition.x}px`,
        top: `${boxPosition.y}px`,
        backgroundColor: `${!isInTarget ? 'goldenrod' : 'green'}`,
      }"
    ></div>

    <transition name="fade">
      <div class="notice-box" v-if="showNotice" key="box1">
        ✌️完成目标，用时 {{ period }} ms，即将进行下一轮...
      </div>
    </transition>
    <div
      class="target"
      :style="{
        left: `${targetPosition.x}px`,
        top: `${targetPosition.y}px`,
      }"
    ></div>
  </div>
  <button @click="toggleGrid" :style="{ margin: '1rem' }">切换网格大小</button>
  <p>区域大小 600px 400px</p>
  <p>网格大小 {{ ismall ? "50px" : "100px" }}</p>
</template>

<script>
function generateArray(count, size) {
  return [...Array(count).keys()].map((item) => item * size);
}

let bigRowArray = generateArray(6, 100);
let bigColumnArray = generateArray(4, 100);
let smallRowArray = generateArray(12, 50);
let smallColumnArray = generateArray(8, 50);

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
  },
  data() {
    return {
      ismall: false,
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
        x: 100,
        y: 100,
      },
      targetPosition: {
        x: 400,
        y: 200,
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
  methods: {
    toggleGrid() {
      this.ismall = !this.ismall;
    },
    dragStart(event) {
      if (this.isResetting) {
        return;
      }

      if (!this.isInTiming) {
        let d = new Date();
        this.time.begin = d.getTime();
      }

      this.isInTiming = true;

      [
        this.dragBuffer.cursorXOnStart,
        this.dragBuffer.cursorYOnStart,
      ] = getCursorLocation(event, ".canvas");

      [this.dragBuffer.boxXOnStart, this.dragBuffer.boxYOnStart] = [
        this.boxPosition.x,
        this.boxPosition.y,
      ];
      this.isDraging = true;
      console.log("start");
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
        if (this.ismall) {
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
        this.$emit("accomplish");
        this.showNotice = true;
        this.isResetting = true;

        setTimeout(() => {
          this.resetDrag();
        }, 1200);
      }
      console.log("end");
    },
    resetDrag() {
      for (let key in this.dragBuffer) {
        this.dragBuffer[key] = 0;
      }
      this.boxPosition = { x: 100, y: 100 };
      this.showNotice = false;
      this.isInTarget = false;
      this.isResetting = false;
      this.isInTiming = false;
    },
  },
};

function getCursorLocation(event, canvasSelector) {
  // 获取画布和鼠标相对于窗口的坐标，以计算鼠标相对于画布的坐标
  let canvasY = document.querySelector(canvasSelector).getBoundingClientRect()
    .top;
  let canvasX = document.querySelector(canvasSelector).getBoundingClientRect()
    .left;
  let cursorX = event.clientX - canvasX;
  let cursorY = event.clientY - canvasY;
  return [cursorX, cursorY];
}
</script>

<style lang="scss" scoped>
.canvas {
  width: 600px;
  height: 400px;
  border-top: solid gray 1px;
  border-left: solid gray 1px;
  margin: auto;
  background: -webkit-linear-gradient(top, transparent 99px, gray 1px),
    -webkit-linear-gradient(left, transparent 99px, gray 1px);
  background-size: 100px 100px;
  position: relative;
  overflow: hidden;
}

.ismall-grid {
  background: -webkit-linear-gradient(top, transparent 49px, gray 1px),
    -webkit-linear-gradient(left, transparent 49px, gray 1px);
  background-size: 50px 50px;
}

.box {
  height: 30px;
  width: 30px;
  position: absolute;
  // background-color: goldenrod;
  z-index: 100;
  // transition: background-color ease-in-out 100ms;
}

.target {
  height: 30px;
  width: 30px;
  position: absolute;
  background: lightgray;
  z-index: 0;
}

.notice-box {
  padding: 12px;
  width: 400px;
  border-radius: 16px;
  background-color: rgb(124, 212, 124);
  color: green;
  font-weight: 500;
  margin: 320px auto;
  box-shadow: 0px 10px 10px rgba($color: #000000, $alpha: 0.12);
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