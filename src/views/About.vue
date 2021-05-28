<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
  <el-switch v-model="value1" active-text="按月付费" inactive-text="按年付费">
  </el-switch>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      value1: true,
    };
  },
};
</script>



