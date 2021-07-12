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
      <span
        :class="{ ttype_changer: true, active: ttype === 1 }"
        @click="change(1)"
        >短信登录</span
      >
    </div>

    <el-form ref="form" class="form" :rules="rules" :model="logins">
      <el-form-item class="form-item">
        <el-input
          type="text"
          id="identifier"
          class="input-text"
          v-model.trim="logins.identifier"
          placeholder="你的手机号/邮箱"
          @blur="verify('identifier')"
          @focus="verify('identifier')"
        >
        </el-input>
        <div ref="identifier" class="error-wrap">
          <span class="error-text">请输入注册时用的邮箱或者手机号</span>
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
          :loading="loadingState"
          :disabled="!logins.identifier || !logins.credential"
          @click="SignIn"
        >
          登录
        </el-button>

        <el-button label="注册" class="btn" id="SignUp" @click="SignUp">
          注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
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
      ttype: 2,
      logins: {
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
      is_remember: true,
    }
  },
  computed: {},
  methods: {
    // 登录接口
    async SignIn() {
      this.verify('identifier')
      this.verify('credential')
      if (!this.logins.identifier || !this.logins.credential) {
        return false
      } else {
        this.loadingState = true // 设置请求加载状态
        let loginInfo = { ttype: this.ttype, ...this.logins }
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
        } else if (code === 212) {
          this.$message.error('用户名或密码不正确')
        } else {
          this.$message.error('用户名或密码不正确')
        }
      }
      this.loadingState = false
    },
    async SignUp() {},
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
