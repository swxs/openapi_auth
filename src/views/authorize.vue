<template>
  <div class="authorize-container">
    <div class="authorize-card">
      <h1 class="authorize-title">授权确认</h1>
      <p class="authorize-desc">以下应用请求访问您的账号</p>
      <div class="app-info">
        <div class="info-row">
          <span class="info-label">应用名称</span>
          <span class="info-value">{{ clientInfo.client_name || '未知应用' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">请求权限</span>
          <span class="info-value">{{ scopeDisplay }}</span>
        </div>
      </div>
      <div class="authorize-actions">
        <a-button type="primary" size="large" class="btn-confirm" @click="confirmAuthorize" :loading="loading">
          授权
        </a-button>
        <a-button size="large" class="btn-cancel" @click="cancelAuthorize">取消</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '../utils/auth'

export default {
  name: 'Authorize',
  data() {
    return {
      loading: false,
      clientInfo: {},
      oauthParams: {
        client_id: null,
        redirect_uri: null,
        state: null,
        scope: null,
      },
    }
  },
  computed: {
    scopeDisplay() {
      if (!this.oauthParams.scope) {
        return '基础权限'
      }
      const scopeMap = {
        'read': '读取',
        'write': '写入',
        'read write': '读取和写入',
      }
      return scopeMap[this.oauthParams.scope] || this.oauthParams.scope
    },
  },
  methods: {
    parseOAuthParams() {
      const urlParams = new URLSearchParams(window.location.search)
      this.oauthParams = {
        client_id: urlParams.get('client_id'),
        redirect_uri: urlParams.get('redirect_uri'),
        state: urlParams.get('state'),
        scope: urlParams.get('scope') || 'read write',
      }
    },
    async loadClientInfo() {
      // 从授权服务器获取客户端信息
      // 这里需要调用授权服务器的API获取客户端信息
      // 暂时使用占位数据
      this.clientInfo = {
        client_name: '应用名称',
      }
    },
    async confirmAuthorize() {
      this.loading = true
      try {
        const token = getToken()
        
        if (!token) {
          this.$message.error('未登录，请先登录')
          this.loading = false
          return
        }
        
        // 调用授权服务器的授权端点，生成授权码并重定向
        const params = new URLSearchParams({
          client_id: this.oauthParams.client_id,
          redirect_uri: this.oauthParams.redirect_uri,
          state: this.oauthParams.state,
          scope: this.oauthParams.scope,
          confirm: 'true',
          token: token, // 将token作为参数传递
        })
        
        const authServer = process.env.VUE_APP_AUTH_SERVER_URL
        // 重定向到授权服务器，由服务器生成授权码并重定向到客户端
        window.location.href = `${authServer}/api/oauth/authorize?${params.toString()}`
      } catch (error) {
        console.error('授权失败:', error)
        this.$message.error('授权失败，请重试')
        this.loading = false
      }
    },
    cancelAuthorize() {
      // 取消授权，重定向回客户端并带上错误信息
      if (this.oauthParams.redirect_uri) {
        const errorParams = new URLSearchParams({
          error: 'access_denied',
          error_description: '用户取消了授权',
          state: this.oauthParams.state,
        })
        window.location.href = `${this.oauthParams.redirect_uri}?${errorParams.toString()}`
      } else {
        this.$router.push('/')
      }
    },
  },
  created() {
    this.parseOAuthParams()
    if (!this.oauthParams.client_id || !this.oauthParams.redirect_uri) {
      this.$message.error('缺少必要的授权参数')
      this.$router.push('/')
      return
    }
    this.loadClientInfo()
  },
}
</script>

<style lang="less" scoped>
@import '../assets/style/variables.less';

.authorize-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: @space-lg;
  background-color: @color-bg-page;
}

.authorize-card {
  width: 100%;
  max-width: 420px;
  padding: @space-2xl;
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

.authorize-title {
  margin: 0 0 @space-xs 0;
  font-size: 22px;
  font-weight: 600;
  color: @color-text;
  text-align: center;
  letter-spacing: -0.02em;
}

.authorize-desc {
  margin: 0 0 @space-xl 0;
  font-size: 14px;
  color: @color-text-secondary;
  text-align: center;
}

.app-info {
  margin-bottom: @space-xl;
  padding: @space-lg;
  background: @color-bg-subtle;
  border-radius: @radius-md;
  border: 1px solid @color-border-light;

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: @space-md;
    padding: @space-sm 0;

    &:not(:last-child) {
      border-bottom: 1px solid @color-border-light;
    }
  }

  .info-label {
    font-size: 13px;
    color: @color-text-muted;
    flex-shrink: 0;
  }

  .info-value {
    font-size: 14px;
    color: @color-text;
    font-weight: 500;
    text-align: right;
  }
}

.authorize-actions {
  display: flex;
  gap: @space-md;
  align-items: stretch;

  .ant-btn {
    flex: 1;
    height: 44px;
    border-radius: @radius-md;
    font-size: 15px;
    font-weight: 500;
  }

  .btn-confirm {
    background: @color-primary;
    border-color: @color-primary;

    &:hover:not(:disabled) {
      background: @color-primary-hover;
      border-color: @color-primary-hover;
    }
  }

  .btn-cancel {
    border-color: @color-border;
    color: @color-text-secondary;

    &:hover {
      border-color: @color-primary;
      color: @color-primary;
    }
  }
}

@media (max-width: 480px) {
  .authorize-card {
    padding: @space-xl @space-lg;
  }

  .authorize-actions {
    flex-direction: column;
  }
}
</style>

