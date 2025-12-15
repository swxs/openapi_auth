// vue.config.js
module.exports = {
  devServer: {
    port: 8081, // 指定启动端口为 8081
    proxy: {
      '/api': {
        target: 'http://localhost:8090/api/',
        changeOrigin: false,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
