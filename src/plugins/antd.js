import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { message } from 'ant-design-vue'

export default {
  install(app) {
    app.use(Antd)
    app.config.globalProperties.$message = message
  },
}
