import axios from 'axios'

const config = {}

const service = axios.create(config)

service.interceptors.request.use(
  (config) => {
    if (config.method === 'get') {
      config.params = config.params || {}
      config.params._ = new Date().getTime()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    if (response.config.responseType === 'blob') {
      return Promise.resolve(response)
    }
    const data = response.data
    if (data.code === 0) {
      return Promise.resolve(data)
    }
    console.log('data: ', data)
    return Promise.resolve(data)
  },
  (error) => {
    console.log(error.response)
    return Promise.resolve({
      status: error.response?.status,
      ...error.response?.data,
    })
  }
)

export function install(app) {
  app.config.globalProperties.axios = service
  app.config.globalProperties.$axios = service
}

export default service
