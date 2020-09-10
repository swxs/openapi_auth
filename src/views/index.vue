<template>
  <el-container class="container">
    <div class="input-group">
      <div class="org-code-input">
        <input
          id="identifier"
          v-model.trim="user_auth.identifier"
          type="text"
          class="input-text"
          placeholder="请输入手机号"
          @blur="verify('identifier')"
          @focus="verify('identifier')"
        />
      </div>
    </div>
    <div ref="identifier" class="error-wrap">
      <div class="error-text">请输入手机号</div>
    </div>
    <div class="input-group">
      <div class="org-code-input">
        <input
          id="credential"
          v-model.trim="user_auth.credential"
          type="password"
          class="input-text"
          placeholder="请输入密码"
          @blur="verify('credential')"
          @focus="verify('credential')"
        />
      </div>
    </div>
    <div ref="credential" class="error-wrap">
      <div class="error-text">请输入密码</div>
    </div>
    <el-button
      push
      :loading="loadingState"
      type="primary"
      :disabled="
        !user_auth.identifier || !user_auth.credential || loginDisabled
      "
      class="btn"
      label="登录"
      @click="doLogin"
    >
      登录
    </el-button>
  </el-container>
</template>

<script>
import { register, login, logout, refreshToken } from '../api/auth.js'

export default {
  name: 'index',
  data() {
    return {
      loadingState: false,
      user_auth: {
        ttype: 2,
        identifier: '',
        credential: '',
      },
      loginDisabled: false,
    }
  },
  computed: {},
  components: {},
  created() {},
  async mounted() {},
  methods: {
    // 登录接口
    async doLogin() {
      this.verify('identifier')
      this.verify('credential')
      if (!this.user_auth.identifier || !this.user_auth.credential) {
        return false
      } else {
        this.loadingState = true // 设置请求加载状态
        let loginInfo = { ...this.user_auth }
        let { code, data, msg } = await login(loginInfo)
        if (code == 0) {
          let token = data.token
          let refreshToken = data.refresh_token
          let userInfo = base2obj(token) // base64解码,获取用户信息
          this.loadingState = false // 取消请求加载状态
          setToken(token)
          setRefreshToken(refreshToken)
          if (this.redirect) {
            location.href = this.redirect
          } else {
            location.href = '/home'
          }
        } else if (code === 212) {
          this.loadingState = false
          this.loginDisabled = true
          this.$message.error('用户名或密码不正确')
        } else {
          this.loadingState = false
          this.$message.error('用户名或密码不正确')
        }
      }
    },
    verify(key) {
      if (!this.user_auth[key]) {
        this.$refs[key].classList.add('is-show')
      } else {
        this.$refs[key].classList.remove('is-show')
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.container {
  width: 580px;
}
</style>
