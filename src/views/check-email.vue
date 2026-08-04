<template>
  <div class="login-container">
    <div class="login-card">
      <header class="login-header">
        <h1 class="login-title">请查收邮件</h1>
        <p class="login-subtitle">我们已向您的邮箱发送了验证链接，请点击链接完成注册</p>
      </header>
      <div class="check-email-body">
        <p v-if="email" class="email-hint">邮箱：{{ email }}</p>
        <a-button type="primary" class="action-btn" :loading="loading" @click="handleResend">
          重新发送验证邮件
        </a-button>
        <a-button class="action-btn secondary" @click="goLogin">返回登录</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { resendVerification } from '../api/auth'

export default {
  name: 'CheckEmail',
  data() {
    return {
      email: this.$route.query.email || '',
      loading: false,
    }
  },
  methods: {
    async handleResend() {
      if (!this.email) {
        this.$message.warning('缺少邮箱信息')
        return
      }
      this.loading = true
      try {
        const { code, message } = await resendVerification({ email: this.email })
        if (code === 0) {
          this.$message.success('验证邮件已重发')
        } else {
          this.$message.error(message || '发送失败')
        }
      } catch (e) {
        this.$message.error('发送失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    goLogin() {
      this.$router.push('/')
    },
  },
}
</script>

<style scoped lang="less">
@import '../styles/login-shared.less';
.check-email-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.email-hint {
  color: #666;
  font-size: 14px;
}
.action-btn.secondary {
  background: #f5f5f5;
}
</style>
