<template>
  <div class="home">
    <h1>拖动交互测试区</h1>
    <Drag></Drag>
    
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
};
</script>
