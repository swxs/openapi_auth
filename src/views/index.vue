<template>
  <div class="login-container">
    <div class="login-card">
      <header class="login-header">
        <h1 class="login-title">{{ pageTitle }}</h1>
        <p class="login-subtitle">{{ pageSubtitle }}</p>
      </header>

      <a-form ref="formRef" class="login-form" :model="form" :rules="formRules">
        <div class="input-group">
          <a-form-item name="identifier" class="form-item form-item-inline">
            <a-input
              id="identifier"
              class="modern-input"
              v-model:value="form.identifier"
              name="identifier"
              autocomplete="username"
              placeholder="用户名"
              allow-clear
            >
              <template #prefix>
                <UserOutlined class="input-prefix-icon" aria-hidden="true" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item v-if="isRegisterMode" name="email" class="form-item form-item-inline">
            <a-input
              id="email"
              class="modern-input"
              v-model:value="form.email"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="邮箱"
              allow-clear
            >
              <template #prefix>
                <MailOutlined class="input-prefix-icon" aria-hidden="true" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="credential" class="form-item form-item-inline">
            <a-input-password
              id="credential"
              class="modern-input"
              v-model:value="form.credential"
              name="credential"
              :autocomplete="isRegisterMode ? 'new-password' : 'current-password'"
              placeholder="密码"
            >
              <template #prefix>
                <LockOutlined class="input-prefix-icon" aria-hidden="true" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item v-if="isRegisterMode" name="confirm_credential" class="form-item form-item-inline">
            <a-input-password
              id="confirm_credential"
              class="modern-input"
              v-model:value="form.confirm_credential"
              name="confirm_credential"
              autocomplete="new-password"
              placeholder="确认密码"
            >
              <template #prefix>
                <LockOutlined class="input-prefix-icon" aria-hidden="true" />
              </template>
            </a-input-password>
          </a-form-item>
        </div>

        <div class="form-links" :class="{ 'form-links--register': isRegisterMode }">
          <template v-if="isRegisterMode">
            <span class="mode-switch">
              已有账号？<a href="#" @click.prevent="switchMode">登录</a>
            </span>
          </template>
          <template v-else>
            <span class="forget-password" role="button" tabindex="0" @click="handleForgetPassword" @keydown.enter="handleForgetPassword">忘记密码？</span>
            <span class="mode-switch">
              没有账号？<a href="#" @click.prevent="switchMode">注册</a>
            </span>
          </template>
        </div>

        <div class="form-actions">
          <a-button
            type="primary"
            class="action-btn submit-btn"
            :loading="loading"
            :disabled="isSubmitDisabled"
            @click="handleSubmit"
          >
            {{ submitButtonText }}
          </a-button>
        </div>

        <div class="divider-wrapper">
          <div class="divider-line"></div>
          <span class="divider-text">或</span>
          <div class="divider-line"></div>
        </div>

        <a-button
          class="github-login-btn"
          :loading="loadingGithub"
          @click="githubLogin"
        >
          <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span class="github-text">使用 GitHub 登录</span>
        </a-button>
      </a-form>
    </div>
  </div>
</template>

<script>
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue'
import { register, login, getGithubLoginUrl } from '../api/auth'
import {
  setToken,
  setRefreshToken,
  getToken,
} from '../utils/auth'
import { navQueryFromRoute } from '../utils/oauth'

export default {
  name: 'index',
  components: { UserOutlined, LockOutlined, MailOutlined },
  data() {
    return {
      loading: false,
      loadingGithub: false,
      ttype: 1,
      form: {
        identifier: '',
        email: '',
        credential: '',
        confirm_credential: '',
      },
      oauthParams: {
        client_id: null,
        redirect_uri: null,
        state: null,
        scope: null,
      },
    }
  },
  computed: {
    isRegisterMode() {
      return this.$route.query.mode === 'register'
    },
    isOAuthFlow() {
      return !!(this.oauthParams.client_id && this.oauthParams.redirect_uri)
    },
    pageTitle() {
      return this.isRegisterMode ? '创建账号' : '欢迎回来'
    },
    pageSubtitle() {
      return this.isRegisterMode ? '填写信息完成注册' : '登录以继续访问'
    },
    submitButtonText() {
      if (this.loading) {
        return this.isRegisterMode ? '注册中…' : '登录中…'
      }
      return this.isRegisterMode ? '注册' : '登录'
    },
    isSubmitDisabled() {
      if (this.isRegisterMode) {
        return !this.form.identifier || !this.form.email || !this.form.credential || !this.form.confirm_credential
      }
      return !this.form.identifier || !this.form.credential
    },
    formRules() {
      const identifier = [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      if (!this.isRegisterMode) {
        return {
          identifier,
          credential: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        }
      }
      return {
        identifier,
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
        ],
        credential: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少 6 位', trigger: 'blur' },
        ],
        confirm_credential: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' },
        ],
      }
    },
  },
  watch: {
    '$route.query.mode'() {
      this.resetForm()
    },
  },
  methods: {
    validateConfirmPassword(_rule, value) {
      if (!value) {
        return Promise.resolve()
      }
      if (value !== this.form.credential) {
        return Promise.reject('两次密码不一致')
      }
      return Promise.resolve()
    },
    resetForm() {
      this.form = {
        identifier: '',
        email: '',
        credential: '',
        confirm_credential: '',
      }
      this.$refs.formRef?.clearValidate()
    },
    switchMode() {
      const query = { ...this.$route.query }
      if (this.isRegisterMode) {
        delete query.mode
      } else {
        query.mode = 'register'
      }
      this.$router.replace({ path: '/', query })
    },
    parseOAuthParams() {
      const urlParams = new URLSearchParams(window.location.search)
      this.oauthParams = {
        client_id: urlParams.get('client_id'),
        redirect_uri: urlParams.get('redirect_uri'),
        state: urlParams.get('state'),
        scope: urlParams.get('scope') || 'read write',
      }
    },
    redirectToOAuthAuthorize() {
      const token = getToken()
      if (!token) {
        return
      }
      const params = new URLSearchParams({
        client_id: this.oauthParams.client_id,
        redirect_uri: this.oauthParams.redirect_uri,
        state: this.oauthParams.state,
        scope: this.oauthParams.scope,
        response_type: 'code',
        token,
      })
      const authServer = process.env.VUE_APP_AUTH_SERVER_URL
      window.location.href = `${authServer}/api/oauth/authorize?${params.toString()}`
    },
    async handleSubmit() {
      try {
        await this.$refs.formRef.validate()
      } catch {
        return
      }
      if (this.isRegisterMode) {
        await this.signUp()
      } else {
        await this.signIn()
      }
    },
    async signIn() {
      this.loading = true
      try {
        const loginInfo = {
          ttype: this.ttype,
          identifier: this.form.identifier,
          credential: this.form.credential,
        }
        const { code, data, message } = await login(loginInfo)

        if (code == 0) {
          setToken(data.token)
          setRefreshToken(data.refresh_token)

          if (this.isOAuthFlow) {
            this.redirectToOAuthAuthorize()
          } else {
            this.$message.success('登录成功')
          }
        } else if (code === 403002) {
          this.$message.warning(message || '邮箱未验证，请查收邮件或重发验证')
          this.$router.push({
            path: '/check-email',
            query: navQueryFromRoute(this.$route),
          })
        } else {
          this.$message.error(message || '登录失败')
        }
      } catch (error) {
        console.error('登录失败:', error)
        this.$message.error('登录失败，请重试')
      } finally {
        this.loading = false
      }
    },
    async signUp() {
      this.loading = true
      try {
        const { code, message } = await register({
          username: this.form.identifier,
          email: this.form.email,
          password: this.form.credential,
        })

        if (code == 0) {
          this.$message.success('注册成功，请查收验证邮件')
          this.$router.push({
            path: '/check-email',
            query: navQueryFromRoute(this.$route, { email: this.form.email }),
          })
        } else {
          this.$message.error(message || '注册失败')
        }
      } catch (error) {
        console.error('注册失败:', error)
        this.$message.error('注册失败，请重试')
      } finally {
        this.loading = false
      }
    },
    handleForgetPassword() {
      this.$router.push({
        path: '/forgot-password',
        query: navQueryFromRoute(this.$route),
      })
    },
    async githubLogin() {
      this.loadingGithub = true
      try {
        const { code, data } = await getGithubLoginUrl()
        if (code === 0 && data && data.auth_url) {
          if (data.state) {
            sessionStorage.setItem('github_oauth_state', data.state)
          }
          window.location.href = data.auth_url
        } else {
          this.$message.error('获取GitHub登录地址失败')
        }
      } catch (error) {
        console.error('GitHub登录失败:', error)
        this.$message.error('GitHub登录失败，请重试')
      } finally {
        this.loadingGithub = false
      }
    },
    handleGithubCallback() {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const refreshToken = urlParams.get('refresh_token')

      if (token && refreshToken) {
        setToken(token)
        setRefreshToken(refreshToken)
        this.$message.success('GitHub登录成功')

        if (this.isOAuthFlow) {
          this.redirectToOAuthAuthorize()
        } else {
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      }
    },
  },
  created() {
    this.parseOAuthParams()

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('token') && urlParams.get('refresh_token')) {
      this.handleGithubCallback()
      return
    }

    if (this.isOAuthFlow && getToken()) {
      this.redirectToOAuthAuthorize()
    }
  },
}
</script>

<style lang="less" scoped>
@import '../styles/login-shared.less';
@import '../assets/style/variables.less';

.login-form {
  .form-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-top: @space-md;
    margin-bottom: @space-md;
    font-size: 13px;
    min-height: 22px;

    &--register {
      justify-content: flex-end;
    }

    .forget-password {
      color: @color-primary;
      cursor: pointer;
      transition: color @duration-normal @ease-out;

      &:hover {
        color: @color-primary-hover;
        text-decoration: underline;
      }
    }

    .mode-switch {
      color: @color-text-secondary;

      a {
        color: @color-primary;
        text-decoration: none;

        &:hover {
          color: @color-primary-hover;
          text-decoration: underline;
        }
      }
    }
  }

  .divider-wrapper {
    display: flex;
    align-items: center;
    margin: @space-md 0;
    gap: @space-sm;

    .divider-line {
      flex: 1;
      height: 1px;
      background: @color-border;
    }

    .divider-text {
      color: @color-text-muted;
      font-size: 12px;
      font-weight: 500;
    }
  }

  .github-login-btn {
    width: 100%;
    height: 42px;
    min-height: 42px;
    border-radius: @radius-md;
    background: #24292e;
    color: #fff;
    border: none;
    font-size: 14px;
    font-weight: 500;
    transition: background-color @duration-normal @ease-out,
      box-shadow @duration-fast @ease-out;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;

    :deep(.ant-btn) {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 10px !important;
      width: 100%;
      height: 100%;
      padding: 0 @space-lg;
    }

    &:hover:not(:disabled) {
      background: #2f363d;
      box-shadow: @shadow-md;
    }

    .github-icon {
      width: 18px;
      height: 18px;
      min-width: 18px;
      min-height: 18px;
      margin-right: @space-sm;
      fill: currentColor;
      flex-shrink: 0;
    }

    .github-text {
      display: inline-flex;
      align-items: center;
      line-height: 1;
      white-space: nowrap;
    }
  }
}
</style>
