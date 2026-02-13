import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import antd from './plugins/antd'
import { install as axiosInstall } from './plugins/axios'

const app = createApp(App)
app.use(router)
app.use(antd)
app.use({ install: axiosInstall })
app.mount('#app')
