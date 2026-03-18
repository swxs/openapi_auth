<template>
  <a-config-provider :theme="antdTheme">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      antdTheme: {
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 10,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
      },
    }
  },
  created() {
    document.title = '登录中心'
  },
}
</script>

<style lang="less">
@import './assets/style/variables.less';
@import './assets/fonts/iconfont.less';
@import './assets/style/base.less';
@import './assets/style/common.less';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: @font-family-sans;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: @font-family-sans;
  color: @color-text;
  background-color: @color-bg-page;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  width: 100%;
}

// Ant Design 覆盖 - 简洁风格
.ant-btn {
  transition: border-color @duration-normal @ease-out,
    background-color @duration-normal @ease-out,
    color @duration-normal @ease-out,
    box-shadow @duration-fast @ease-out;
  border-radius: @radius-md;
}

.ant-input,
.ant-input-password input {
  transition: border-color @duration-normal @ease-out,
    box-shadow @duration-fast @ease-out;
  border-radius: @radius-md;
}

.ant-input:focus,
.ant-input-focused,
.ant-input-password.ant-input-focused input {
  box-shadow: 0 0 0 2px fade(@color-primary, 12%);
}

// 滚动条 - 简洁
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: @color-border-light;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: @color-text-muted;
  border-radius: 3px;

  &:hover {
    background: @color-text-secondary;
  }
}
</style>
