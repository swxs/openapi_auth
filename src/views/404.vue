<template>
  <div class="not-found">
    <div class="not-found-card">
      <span class="not-found-code">404</span>
      <h1 class="not-found-title">页面不存在</h1>
      <p class="not-found-desc">您访问的地址没有对应页面</p>
      <a-button type="primary" size="large" @click="goHome">返回登录</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goHome() {
      this.$router.push('/')
    },
  },
}
</script>

<style lang="less" scoped>
@import '../assets/style/variables.less';

.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: @space-lg;
  background-color: @color-bg-page;
}

.not-found-card {
  text-align: center;
  padding: @space-2xl;
  max-width: 360px;
}

.not-found-code {
  display: block;
  font-size: 64px;
  font-weight: 700;
  color: @color-text-muted;
  line-height: 1;
  margin-bottom: @space-md;
  letter-spacing: -0.03em;
}

.not-found-title {
  margin: 0 0 @space-sm 0;
  font-size: 20px;
  font-weight: 600;
  color: @color-text;
}

.not-found-desc {
  margin: 0 0 @space-xl 0;
  font-size: 14px;
  color: @color-text-secondary;
}

.not-found-card .ant-btn {
  height: 44px;
  padding: 0 @space-xl;
  border-radius: @radius-md;
  font-weight: 500;
}
</style>
