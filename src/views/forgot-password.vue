<template>
  <div class="login-container">
    <div class="login-card">
      <header class="login-header">
        <h1 class="login-title">忘记密码</h1>
        <p class="login-subtitle">输入用户名和注册邮箱</p>
      </header>
      <a-form class="login-form" :model="form">
        <a-form-item>
          <a-input v-model:value="form.username" placeholder="用户名" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="form.email" placeholder="注册邮箱" allow-clear />
        </a-form-item>
        <a-button type="primary" class="action-btn" :loading="loading" @click="handleSubmit">
          发送邮件
        </a-button>
        <a-button class="action-btn secondary" @click="goLogin">返回登录</a-button>
      </a-form>
    </div>
  </div>
</template>

<script>
import { forgotPassword } from '../api/auth'

export default {
  name: 'ForgotPassword',
  data() {
    return {
      loading: false,
      form: {
        username: '',
        email: '',
      },
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.form.username || !this.form.email) {
        this.$message.warning('请填写用户名和邮箱')
        return
      }
      this.loading = true
      try {
        const { code, data, message } = await forgotPassword(this.form)
        if (code === 0) {
          const msg = data?.message || message || '请求已提交'
          this.$message.success(msg)
          if (data?.unactivated) {
            this.$router.push({ path: '/check-email', query: { email: this.form.email } })
          }
        } else {
          this.$message.error(message || '提交失败')
        }
      } catch (e) {
        this.$message.error('提交失败，请稍后重试')
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
.action-btn.secondary {
  margin-top: 8px;
  background: #f5f5f5;
}
</style>
