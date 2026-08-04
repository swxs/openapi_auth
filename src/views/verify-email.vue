<template>
  <div class="login-container">
    <div class="login-card">
      <header class="login-header">
        <h1 class="login-title">{{ title }}</h1>
        <p class="login-subtitle">{{ subtitle }}</p>
      </header>
      <div class="login-body">
        <div v-if="loading" class="status-body">验证中…</div>
        <div v-else class="form-actions">
          <a-button
            :type="success ? 'primary' : 'default'"
            :class="success ? 'action-btn submit-btn' : 'action-btn secondary'"
            @click="goLogin"
          >
            {{ success ? '前往登录' : '返回登录' }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { verifyEmail } from '../api/auth'
import { navQueryFromRoute } from '../utils/oauth'

export default {
  name: 'VerifyEmail',
  data() {
    return {
      loading: true,
      success: false,
      title: '邮箱验证',
      subtitle: '',
    }
  },
  async mounted() {
    const token = this.$route.query.token
    if (!token) {
      this.loading = false
      this.title = '验证失败'
      this.subtitle = '链接无效，缺少 token'
      return
    }
    try {
      const { code, message } = await verifyEmail({ token })
      if (code === 0) {
        this.success = true
        this.title = '验证成功'
        this.subtitle = message || '邮箱已验证，可以登录了'
      } else {
        this.title = '验证失败'
        this.subtitle = message || '链接无效或已过期'
      }
    } catch (e) {
      this.title = '验证失败'
      this.subtitle = '链接无效或已过期'
    } finally {
      this.loading = false
    }
  },
  methods: {
    goLogin() {
      this.$router.push({ path: '/', query: navQueryFromRoute(this.$route) })
    },
  },
}
</script>

<style scoped lang="less">
@import '../styles/login-shared.less';
</style>
