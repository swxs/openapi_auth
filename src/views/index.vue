<template>
  <el-form
    ref="form"
    class="form"
    :rules="rules"
    :model="logins"
    label-width="80px"
  >
    <el-form-item label="邮箱:">
      <el-input
        type="text"
        id="identifier"
        class="input-text"
        v-model.trim="logins.identifier"
        placeholder="请输入邮箱"
        @blur="verify('identifier')"
        @focus="verify('identifier')"
      >
      </el-input>
      <span ref="identifier" class="error-wrap">
        <span class="error-text">请输入邮箱!</span>
      </span>
    </el-form-item>

    <el-form-item label="密码:">
      <el-input
        type="password"
        id="credential"
        class="input-text"
        v-model.trim="logins.credential"
        placeholder="请输入密码"
        @blur="verify('credential')"
        @focus="verify('credential')"
      >
      </el-input>
      <span ref="credential" class="error-wrap">
        <span class="error-text">请输入密码!</span>
      </span>
    </el-form-item>

    <el-form-item>
      <el-button
        label="登录"
        type="primary"
        class="btn"
        :loading="loadingState"
        :disabled="!logins.identifier || !logins.credential"
        @click="doLogin"
      >
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { register, login, logout, refreshToken } from '../api/auth'
import {
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  removeToken,
  removeRefreshToken,
  base2obj,
} from '../utils/auth'

export default {
  name: 'index',
  components: {},
  data() {
    return {
      loadingState: false,
      logins: {
        ttype: 2,
        identifier: '',
        credential: '',
      },
      rules: {
        identifier: [
          { required: true, message: '请输入邮箱!', trigger: 'blur' },
        ],
        credential: [
          { required: true, message: '请输入密码!', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {},
  methods: {
    // 登录接口
    async doLogin() {
      this.verify('identifier')
      this.verify('credential')
      if (!this.logins.identifier || !this.logins.credential) {
        return false
      } else {
        this.loadingState = true // 设置请求加载状态
        let loginInfo = { ...this.logins }
        let { code, data, msg } = await login(loginInfo)
        if (code == 0) {
          let token = data.token
          let refreshToken = data.refresh_token
          setToken(token)
          setRefreshToken(refreshToken)
          let userInfo = base2obj(token) // base64解码,获取用户信息
          this.sendMessage({
            token: token,
          })
          this.loadingState = false // 取消请求加载状态
        } else if (code === 212) {
          this.loadingState = false
          this.$message.error('用户名或密码不正确')
        } else {
          this.loadingState = false
          this.$message.error('用户名或密码不正确')
        }
      }
    },
    verify(key) {
      if (!this.logins[key]) {
        this.$refs[key].classList.add('is-show')
      } else {
        this.$refs[key].classList.remove('is-show')
      }
    },
    sendMessage(data) {
      console.log('child send')
      // 外部vue向iframe内部传数据
      window.parent.postMessage(
        {
          cmd: 'returnToken',
          params: data,
        },
        '*'
      )
    },
  },
  created() {},
  mounted() {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.form {
  margin-top: 20px;
  .el-input {
    width: 240px;
  }
  .error-wrap {
    color: #f98a8a;
    margin-left: 20px;
  }
}
</style>
