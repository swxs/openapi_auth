<template>
  <div>
    <div class="">
      <!-- 密码登录 -->
      <span
        :class="{ ttype_changer: true, active: ttype === 2 }"
        @click="change(2)"
        >密码登录</span
      >
      <!-- 短信登录 -->
      <!-- <span
        :class="{ ttype_changer: true, active: ttype === 1 }"
        @click="change(1)"
        >短信登录</span
      > -->
    </div>

    <el-form ref="form" class="form" :rules="rules" :model="logins">
      <el-form-item class="form-item">
        <el-input
          type="text"
          id="identifier"
          class="input-text"
          v-model.trim="logins.identifier"
          placeholder="你的用户名"
          @blur="verify('identifier')"
          @focus="verify('identifier')"
        >
        </el-input>
        <div ref="identifier" class="error-wrap">
          <span class="error-text">请输入用户名</span>
        </div>
      </el-form-item>

      <el-form-item class="form-item" id="t2" v-if="ttype === 2">
        <el-input
          type="password"
          id="credential"
          class="input-text"
          v-model.trim="logins.credential"
          placeholder="密码"
          @blur="verify('credential')"
          @focus="verify('credential')"
        >
        </el-input>
        <div ref="credential" class="error-wrap">
          <span class="error-text">你还没有输入密码</span>
        </div>
      </el-form-item>

      <el-form-item class="form-item" id="t1" v-if="ttype === 1">
        <el-input
          id="credential"
          class="input-text"
          v-model.trim="logins.credential"
          placeholder="验证码"
          @blur="verify('credential')"
          @focus="verify('credential')"
        >
          <el-button slot="suffix">获取验证码</el-button>
        </el-input>
        <div ref="credential" class="error-wrap">
          <span class="error-text">你还没有输入验证码</span>
        </div>
      </el-form-item>

      <div>
        <el-checkbox v-model="is_remember" id="remember">记住我</el-checkbox>

        <span id="forget">忘记密码？</span>
      </div>

      <el-form-item class="form-item">
        <el-button
          label="登录"
          type="primary"
          class="btn"
          id="SignIn"
          :loading="loadingSignIn"
          :disabled="!logins.identifier || !logins.credential"
          @click="SignIn"
        >
          登录
        </el-button>

        <el-button
          label="注册"
          class="btn"
          id="SignUp"
          :loading="loadingSignUp"
          @click="SignUp"
        >
          注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { register, login } from '../api/auth'
import {
  setToken,
  setRefreshToken,
  base2obj,
} from '../utils/auth'

export default {
  name: 'index',
  components: {},
  data() {
    return {
      loadingSignIn: false,
      loadingSignUp: false,
      ttype: 2,
      logins: {
        identifier: '',
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
    // 登录接口
    async SignIn() {
      this.verify('identifier')
      this.verify('credential')
      if (!this.logins.identifier || !this.logins.credential) {
        return false
      } else {
        this.loadingSignIn = true
        try {
          let loginInfo = { ttype: this.ttype, ...this.logins }
          let { status, code, data, message } = await login(loginInfo)
          
          if (code == 0) {
            let token = data.token
            let refreshToken = data.refresh_token
            setToken(token)
            setRefreshToken(refreshToken)
            let userInfo = base2obj(token)
            
            // 如果是OAuth流程，重定向到授权确认页面
            if (this.isOAuthFlow) {
              // 重定向到授权确认页面，带上OAuth参数
              const params = new URLSearchParams({
                client_id: this.oauthParams.client_id,
                redirect_uri: this.oauthParams.redirect_uri,
                state: this.oauthParams.state,
                scope: this.oauthParams.scope,
              })
              // 使用replace避免浏览器历史记录问题
              this.$router.replace(`/authorize?${params.toString()}`)
            } else {
              // 非OAuth流程，显示成功消息
              this.$message.success('登录成功')
              // 可以重定向到其他页面
              // this.$router.push('/')
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
      if (!this.logins.identifier || !this.logins.credential) {
        return false
      } else {
        this.loadingSignUp = true
        try {
          let loginInfo = { ttype: this.ttype, ...this.logins }
          let { code: registerCode, data: registerData, msg: registerMsg } = await register(loginInfo)
          
          if (registerCode == 0) {
            // 注册成功后自动登录
            let { code, data, msg } = await login(loginInfo)
            if (code == 0) {
              let token = data.token
              let refreshToken = data.refresh_token
              setToken(token)
              setRefreshToken(refreshToken)
              
              // 如果是OAuth流程，重定向到授权确认页面
              if (this.isOAuthFlow) {
                const params = new URLSearchParams({
                  client_id: this.oauthParams.client_id,
                  redirect_uri: this.oauthParams.redirect_uri,
                  state: this.oauthParams.state,
                  scope: this.oauthParams.scope,
                })
                this.$router.replace(`/authorize?${params.toString()}`)
              } else {
                this.$message.success('注册并登录成功')
              }
            } else {
              this.$message.error('注册成功，但登录失败')
            }
          } else {
            this.$message.error(registerMsg || '注册失败')
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
  },
  created() {
    // 从URL参数中获取OAuth参数
    this.parseOAuthParams()
  },
  mounted() {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.ttype_changer {
  margin-left: 20px;
  cursor: pointer;
  &.active {
    color: #409eff;
  }
  &:hover {
    color: #409eff;
  }
}

.form {
  margin-top: 10px;
  .form-item {
    margin-bottom: 0px;
  }
  .el-input {
    width: 300px;
  }
  .error-wrap {
    color: #f98a8a;
    line-height: 16px;
    margin-left: 20px;
  }
  .btn {
    margin-top: 20px;
  }
  #t1 {
    .el-input--suffix {
      padding-right: 0px;
      .el-input__inner {
        padding-right: 90px;
      }
      .el-input__suffix {
        right: 0px;
        .el-button {
          padding: 12px 2px;
        }
      }
    }
  }
  #remember {
    margin-left: 20px;
  }
  #forget {
    margin-left: 120px;
  }
  #SignIn {
    margin-left: 60px;
  }
  #SignUp {
    margin-left: 40px;
  }
}
</style>
