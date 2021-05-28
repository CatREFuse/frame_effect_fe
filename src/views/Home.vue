<template>
  <div class="home">
    <h1>拖动交互测试区</h1>
    <Drag :is-snapping="isSnapping"></Drag>
    <el-switch
      v-model="isSnapping"
      active-text="网格吸附开"
      inactive-text="网格吸附关"
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
    };
  },
};
</script>
