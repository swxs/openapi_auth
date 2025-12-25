<template>
  <div id="app">
    <!--所有的页面都将加载到此处-->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  created() {
    document.title = "登录中心"
  },
}
</script>

<style lang="less">
@import './assets/fonts/iconfont.less';
@import './assets/style/base.less';
@import './assets/style/common.less';

// 全局样式优化
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  width: 100%;
}

// Element UI 组件样式覆盖
.el-button {
  transition: all 0.3s ease;
}

.el-input__inner {
  transition: all 0.3s ease;
}

// 滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 4px;

  &:hover {
    background: rgba(102, 126, 234, 0.7);
  }
}
</style>
