<template>
  <div class="login-container">
    <div class="login-card">
      <header class="login-header">
        <h1 class="login-title">重置密码</h1>
        <p class="login-subtitle">请输入新密码</p>
      </header>
      <a-form class="login-form" :model="form">
        <a-form-item>
          <a-input-password v-model:value="form.new_password" placeholder="新密码" />
        </a-form-item>
        <a-form-item>
          <a-input-password v-model:value="form.confirm_password" placeholder="确认新密码" />
        </a-form-item>
        <a-button type="primary" class="action-btn" :loading="loading" @click="handleSubmit">
          确认重置
        </a-button>
      </a-form>
    </div>
  </div>
</template>

<script>
import { resetPassword } from '../api/auth'

export default {
  name: 'ResetPassword',
  data() {
    return {
      loading: false,
      token: this.$route.query.token || '',
      form: {
        new_password: '',
        confirm_password: '',
      },
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.token) {
        this.$message.error('链接无效')
        return
      }
      if (!this.form.new_password || this.form.new_password.length < 6) {
        this.$message.warning('密码至少 6 位')
        return
      }
      if (this.form.new_password !== this.form.confirm_password) {
        this.$message.warning('两次密码不一致')
        return
      }
      this.loading = true
      try {
        const { code, message } = await resetPassword({
          token: this.token,
          new_password: this.form.new_password,
        })
        if (code === 0) {
          this.$message.success('密码重置成功，请登录')
          this.$router.push('/')
        } else {
          this.$message.error(message || '重置失败')
        }
      } catch (e) {
        this.$message.error('重置失败，链接可能已过期')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped lang="less">
@import '../styles/login-shared.less';
</style>
