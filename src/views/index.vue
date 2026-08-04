<template>
  <div class="login-container">
    <div class="login-card">
      <header class="login-header">
        <h1 class="login-title">欢迎回来</h1>
        <p class="login-subtitle">登录以继续访问</p>
      </header>

      <a-form ref="formRef" class="login-form" :model="logins">
        <div class="input-group">
          <a-form-item class="form-item form-item-inline">
            <a-input
              id="identifier"
              class="modern-input"
              v-model:value="logins.identifier"
              placeholder="用户名"
              allow-clear
              @blur="verify('identifier')"
              @focus="verify('identifier')"
            >
              <template #prefix>
                <UserOutlined class="input-prefix-icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item class="form-item form-item-inline">
            <a-input
              id="email"
              class="modern-input"
              v-model:value="logins.email"
              placeholder="邮箱（注册必填）"
              allow-clear
            >
              <template #prefix>
                <MailOutlined class="input-prefix-icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item class="form-item form-item-inline">
            <a-input-password
              id="credential"
              class="modern-input"
              v-model:value="logins.credential"
              placeholder="密码"
              @blur="verify('credential')"
              @focus="verify('credential')"
            >
              <template #prefix>
                <LockOutlined class="input-prefix-icon" />
              </template>
            </a-input-password>
          </a-form-item>
        </div>
        <div class="error-row">
          <div ref="identifier" class="error-wrap">
            <span class="error-text">请输入用户名</span>
          </div>
          <div ref="credential" class="error-wrap">
            <span class="error-text">请输入密码</span>
          </div>
        </div>

        <div class="form-options">
          <a-checkbox v-model:checked="is_remember" class="remember-checkbox">记住我</a-checkbox>
          <span class="forget-password" @click="handleForgetPassword">忘记密码？</span>
        </div>

        <div class="form-actions">
          <a-button
            type="primary"
            class="action-btn login-btn"
            :loading="loadingSignIn"
            :disabled="!logins.identifier || !logins.credential"
            @click="SignIn"
          >
            <span v-if="!loadingSignIn">登录</span>
            <span v-else>登录中...</span>
          </a-button>

          <a-button
            class="action-btn register-btn"
            :loading="loadingSignUp"
            @click="SignUp"
          >
            <span v-if="!loadingSignUp">注册</span>
            <span v-else>注册中...</span>
          </a-button>
        </div>

        <!-- 分割线 -->
        <div class="divider-wrapper">
          <div class="divider-line"></div>
          <span class="divider-text">或</span>
          <div class="divider-line"></div>
        </div>

        <!-- GitHub登录按钮 -->
        <a-button
          class="github-login-btn"
          :loading="loadingGithub"
          @click="githubLogin"
        >
          <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
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
  base2obj,
} from '../utils/auth'

export default {
  name: 'index',
  components: { UserOutlined, LockOutlined, MailOutlined },
  data() {
    return {
      loadingSignIn: false,
      loadingSignUp: false,
      loadingGithub: false,
      ttype: 1,
      logins: {
        identifier: '',
        email: '',
        credential: '',
      },
      rules: {
        identifier: [
          { required: true, message: '请输入用户名!', trigger: 'blur' },
        ],
        credential: [
          { required: true, message: '请输入密码!', trigger: 'blur' },
        ],
      },
      is_remember: true,
      // OAuth参数
      oauthParams: {
        client_id: null,
        redirect_uri: null,
        state: null,
        scope: null,
      },
    }
  },
  computed: {
    // 是否是OAuth登录流程
    isOAuthFlow() {
      return !!(this.oauthParams.client_id && this.oauthParams.redirect_uri)
    },
  },
  methods: {
    // 从URL参数中获取OAuth参数
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
    // 登录接口
    async SignIn() {
      this.verify('identifier')
      this.verify('credential')
      if (!this.logins.identifier || !this.logins.credential) {
        return false
      } else {
        this.loadingSignIn = true
        try {
          let loginInfo = { ttype: this.ttype, identifier: this.logins.identifier, credential: this.logins.credential }
          let { status, code, data, message } = await login(loginInfo)
          
          if (code == 0) {
            let token = data.token
            let refreshToken = data.refresh_token
            setToken(token)
            setRefreshToken(refreshToken)
            let userInfo = base2obj(token)
            
            // 如果是OAuth流程，重定向到授权确认页面
            if (this.isOAuthFlow) {
              this.redirectToOAuthAuthorize()
            } else {
              // 非OAuth流程，显示成功消息
              this.$message.success('登录成功')
              // 可以重定向到其他页面
              // this.$router.push('/')
            }
          } else if (code === 403002) {
            this.$message.warning(message || '邮箱未验证，请查收邮件或重发验证')
            if (this.logins.email) {
              this.$router.push({ path: '/check-email', query: { email: this.logins.email } })
            }
          } else {
            this.$message.error(message || '登录失败')
          }
        } catch (error) {
          console.error('登录失败:', error)
          this.$message.error('登录失败，请重试')
        } finally {
          this.loadingSignIn = false
        }
      }
    },
    async SignUp() {
      this.verify('identifier')
      this.verify('credential')
      if (!this.logins.identifier || !this.logins.email || !this.logins.credential) {
        this.$message.warning('请填写用户名、邮箱和密码')
        return false
      } else {
        this.loadingSignUp = true
        try {
          let { code, message } = await register({
            username: this.logins.identifier,
            email: this.logins.email,
            password: this.logins.credential,
          })

          if (code == 0) {
            this.$message.success('注册成功，请查收验证邮件')
            this.$router.push({ path: '/check-email', query: { email: this.logins.email } })
          } else {
            this.$message.error(message || '注册失败')
          }
        } catch (error) {
          console.error('注册失败:', error)
          this.$message.error('注册失败，请重试')
        } finally {
          this.loadingSignUp = false
        }
      }
    },
    change(ttype) {
      this.ttype = ttype
    },
    verify(key) {
      if (!this.logins[key]) {
        this.$refs[key].classList.add('is-show')
      } else {
        this.$refs[key].classList.remove('is-show')
      }
    },
    handleForgetPassword() {
      this.$router.push('/forgot-password')
    },
    // GitHub登录
    async githubLogin() {
      this.loadingGithub = true
      try {
        const { code, data } = await getGithubLoginUrl()
        if (code === 0 && data && data.auth_url) {
          // 保存state到sessionStorage，用于回调时验证
          if (data.state) {
            sessionStorage.setItem('github_oauth_state', data.state)
          }
          // 重定向到GitHub授权页面
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
    // 处理GitHub回调
    handleGithubCallback() {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const refreshToken = urlParams.get('refresh_token')

      if (token && refreshToken) {
        setToken(token)
        setRefreshToken(refreshToken)
        this.$message.success('GitHub登录成功')

        // 如果是OAuth流程，重定向到授权确认页面
        if (this.isOAuthFlow) {
          this.redirectToOAuthAuthorize()
        } else {
          // 清除URL参数
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
  mounted() {},
}
</script>

<style lang="less" scoped>
@import '../assets/style/variables.less';

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: @space-lg;
  background-color: @color-bg-page;
}

.login-card {
  width: 100%;
  max-width: 380px;
  padding: @space-xl;
  background: @color-bg;
  border-radius: @radius-xl;
  box-shadow: @shadow-lg;
  border: 1px solid @color-border-light;
  animation: cardIn 0.4s @ease-out;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: @space-xl;

  .login-title {
    margin: 0 0 @space-xs 0;
    font-size: 24px;
    font-weight: 600;
    color: @color-text;
    letter-spacing: -0.02em;
  }

  .login-subtitle {
    margin: 0;
    font-size: 13px;
    color: @color-text-secondary;
  }
}

.login-form {
  // 输入组：用户名+密码 合为一个框，不散
  .input-group {
    border-radius: @radius-md;
    overflow: hidden;
    background: @color-bg;
    transition: border-color @duration-normal @ease-out, box-shadow @duration-fast @ease-out;

    &:focus-within {
      border-color: @color-primary;
      box-shadow: 0 0 0 2px fade(@color-primary, 12%);
    }

    :deep(.ant-form-item),
    :deep(.ant-form-item-control),
    :deep(.ant-form-item-control-input) {
      border: none !important;
      background: transparent !important;
    }
  }

  .form-item-inline {
    margin-bottom: 0 !important;

    :deep(.ant-form-item-control-input) {
      min-height: auto;
    }
  }

  .input-group .form-item-inline + .form-item-inline {
    margin-top: 8px;
    padding-top: 8px;
    border-top: none !important;
  }

  .input-group .modern-input {
    :deep(.ant-input-affix-wrapper),
    :deep(.ant-input-password),
    :deep(.ant-input) {
      height: 40px;
      min-height: 40px;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      background: transparent !important;
      padding: 0 !important;

      &:hover,
      &:focus,
      &.ant-input-focused {
        border: none !important;
        box-shadow: none !important;
        background: transparent !important;
      }
    }

    :deep(.ant-input) {
      padding: 8px 10px 8px 20px !important;
      font-size: 15px;
    }

    :deep(.ant-input-password .ant-input) {
      padding: 8px 10px 8px 20px !important;
    }

    :deep(.ant-input-prefix) {
      margin-right: 8px;
      padding-left: 0;
      color: @color-text-muted;
      font-size: 15px;
    }

    :deep(.ant-input-suffix) {
      color: @color-text-muted;
      padding-right: 0;
    }
  }

  .error-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0 @space-lg;
    margin-bottom: @space-md;
    min-height: 18px;
  }

  .error-wrap {
    flex: 1;
    min-width: 0;
    margin-top: 0;
    min-height: 18px;
    opacity: 0;
    transition: opacity @duration-normal @ease-out;

    &.is-show {
      opacity: 1;
    }

    .error-text {
      color: @color-error;
      font-size: 12px;
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: @space-md;
    font-size: 13px;
    min-height: 22px;

    .remember-checkbox {
      margin: 0;
      :deep(.ant-checkbox-inner) {
        border-radius: @radius-sm;
      }
      :deep(.ant-checkbox + span) {
        color: @color-text-secondary;
        padding-left: @space-sm;
      }
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
  }

  .form-actions {
    display: flex;
    gap: @space-sm;
    margin-bottom: @space-md;
    align-items: stretch;

    .action-btn {
      flex: 1;
      height: 42px;
      min-height: 42px;
      border-radius: @radius-md;
      font-size: 14px;
      font-weight: 500;
      transition: border-color @duration-normal @ease-out,
        background-color @duration-normal @ease-out,
        color @duration-normal @ease-out,
        box-shadow @duration-fast @ease-out;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      line-height: 1;

      :deep(.ant-btn) {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        line-height: 1 !important;
        height: 100%;
      }

      &.login-btn {
        background: @color-primary;
        color: #fff;

        &:hover:not(:disabled) {
          background: @color-primary-hover;
          box-shadow: 0 4px 12px fade(@color-primary, 35%);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      &.register-btn {
        background: @color-bg;
        color: @color-text-secondary;
        border: 1px solid @color-border;

        &:hover {
          border-color: @color-primary;
          color: @color-primary;
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
      margin-right: 8px;
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

@media (max-width: 768px) {
  .login-container {
    padding: @space-md;
    align-items: flex-start;
    padding-top: 48px;
  }

  .login-card {
    padding: @space-xl @space-lg;
  }

  .login-header {
    margin-bottom: @space-xl;
  }

  .form-actions {
    flex-direction: column;

    .action-btn {
      width: 100%;
    }
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: @space-sm;
    padding-top: 32px;
  }

  .login-card {
    padding: @space-lg @space-md;
  }

  .login-header .login-title {
    font-size: 22px;
  }
}
</style>
