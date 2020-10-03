<template>
  <div id="app">
    <!--所有的页面都将加载到此处,app.vue只提供一个容器-->
    <router-view></router-view>
  </div>
</template>

<script>
import { refreshToken } from './api/auth'
import { getToken, getRefreshToken, setToken } from './utils/auth'

export default {
  name: 'App',
  components: {},
  methods: {
    sendMessage(data) {
      console.log(`child send: `, data)
      // 外部vue向iframe内部传数据
      window.parent.postMessage(data, '*')
    },
    async handleMessage(event) {
      // 根据上面制定的结构来解析iframe内部发回来的数据
      const data = event.data
      console.log(`child get: `, data)
      switch (data.cmd) {
        case 'getToken':
          // 业务逻辑
          let token = getToken()
          if (token) {
            this.sendMessage({
              cmd: 'returnToken',
              params: {
                token: token,
              },
            })
          } else {
            let refresh_token = getRefreshToken()
            if (refresh_token) {
              let data = await refreshToken({
                refresh_token: refresh_token,
              })
              if (data.code === 0) {
                let token = data.data.token
                setToken(token)
                this.sendMessage({
                  cmd: 'returnToken',
                  params: {
                    token: token,
                  },
                })
              } else {
                this.sendMessage({
                  cmd: 'returnToken',
                  params: {
                    token: null,
                  },
                })
              }
            } else {
              this.sendMessage({
                cmd: 'returnToken',
                params: {
                  token: null,
                },
              })
            }
          }
      }
    },
  },
  beforeMount() {
    // 在外部vue的window上添加postMessage的监听，并且绑定处理函数handleMessage
    window.addEventListener('message', this.handleMessage)
  },
  mounted() {
    this.sendMessage({
      cmd: 'ready',
      params: {},
    })
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleMessage)
  },
}
</script>

<style lang="less">
@import './assets/style/base.less';
@import './assets/style/common.less';
</style>
