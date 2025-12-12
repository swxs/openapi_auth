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
</style>
