<template>
  <div class="authorize-container">
    <div class="authorize-box">
      <h2>授权确认</h2>
      <div class="app-info">
        <p><strong>应用名称：</strong>{{ clientInfo.client_name || '未知应用' }}</p>
        <p><strong>请求权限：</strong>{{ scopeDisplay }}</p>
      </div>
      <div class="authorize-actions">
        <el-button type="primary" @click="confirmAuthorize" :loading="loading">
          授权
        </el-button>
        <el-button @click="cancelAuthorize">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
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
        // 获取token
        const { getToken } = require('../utils/auth')
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
        
        const authServer = process.env.VUE_APP_AUTH_SERVER_URL || 'http://127.0.0.1:8090'
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
.authorize-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.authorize-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  min-width: 400px;
  max-width: 500px;

  h2 {
    margin-bottom: 30px;
    text-align: center;
    color: #333;
  }

  .app-info {
    margin-bottom: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 4px;

    p {
      margin: 10px 0;
      color: #666;
    }
  }

  .authorize-actions {
    display: flex;
    justify-content: space-around;
    gap: 20px;
  }
}
</style>

