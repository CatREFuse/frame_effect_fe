<template>
  <div class="home">
    <h1>拖动交互测试区</h1>
    <Drag
      :is-snapping="isSnapping"
      :show-grid="showGrid"
      :target-on-big="targetOnBig"
    ></Drag>
    <el-switch
      class="switch"
      v-model="isSnapping"
      active-text="网格吸附开"
      inactive-text="网格吸附关"
      active-color="green"
    >
    </el-switch>
    <el-switch
      class="switch"
      v-model="showGrid"
      active-text="网格显示开"
      inactive-text="网格显示关"
      active-color="green"
    >
    </el-switch>
    <el-switch
      class="switch"
      v-model="targetOnBig"
      active-text="目标在大网格"
      inactive-text="目标在小网格"
      active-color="green"
    >
    </el-switch>
  </div>
</template>

<script>
// @ is an alias to /src
import Drag from "@/components/Drag.vue";

export default {
  name: "Home",
  components: {
    Drag,
  },
  data() {
    return {
      isSnapping: false,
      showGrid: true,
      targetOnBig: true,
    };
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.switch {
  margin-bottom: 0.5rem;
}
</style>
