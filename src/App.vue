<template>
  <div id="app">
    <el-container style="height: 100vh">
      <el-aside width="280px">
        <el-menu
          style="height: 100%; text-align: left"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#8EC766"
          :default-active="$route.path"
          :router="true"
        >
          <h2
            :style="{
              color: 'white',
              'padding-left': '16px',
            }"
          >
            <i class="el-icon-files"></i>
            框架效应实验平台
          </h2>
          <el-menu-item index="/lab" route="/lab">
            <i class="el-icon-menu"></i><span>实验区</span></el-menu-item
          >
          <el-menu-item index="/test" route="/test">
            <i class="el-icon-setting"></i><span>调试区</span></el-menu-item
          >
        </el-menu>
      </el-aside>
      <el-main
        ><router-view v-slot="{ Component }">
          <!-- <keep-alive> -->
          <component :is="Component" />
          <!-- </keep-alive> -->
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Home from "./views/Lab.vue";
import Test from "./views/Test.vue";

export default {
  name: "App",
  components: {
    Home,
    Test,
  },
  mounted() {
    console.log(this.$route);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
