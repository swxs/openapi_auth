# openapi_auth

## 工作流程

### OAuth登录流程

1. **用户访问授权端点**
   ```
   GET /oauth/authorize?client_id=xxx&redirect_uri=xxx&state=xxx&scope=read+write
   ```

2. **授权服务器检查用户登录状态**
   - 如果未登录，重定向到登录页面：`/login?client_id=xxx&redirect_uri=xxx&state=xxx&scope=read+write`

3. **用户在登录页面输入用户名密码**
   - 登录页面从URL参数中获取OAuth参数
   - 用户输入用户名密码并点击登录

4. **登录成功**
   - 保存token到localStorage
   - 如果是OAuth流程，重定向到授权确认页面：`/authorize?client_id=xxx&redirect_uri=xxx&state=xxx&scope=read+write`

5. **授权确认页面**
   - 显示应用信息和请求的权限
   - 用户点击"授权"按钮

6. **生成授权码并重定向**
   - 调用授权服务器的授权端点
   - 授权服务器生成授权码
   - 重定向到客户端：`{redirect_uri}?code=xxx&state=xxx`

### 非OAuth登录流程

如果URL中没有OAuth参数，则按原有流程处理：
- 登录成功后显示成功消息
- 可以重定向到其他页面

## 配置说明

### 环境变量

在`openapi_auth`项目的`.env`文件中配置：

```env
# 授权服务器地址（home服务地址）
VUE_APP_AUTH_SERVER_URL=http://127.0.0.1:8088
```

### API代理配置

确保`vue.config.js`中的API代理配置正确：

```javascript
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8088/api/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
```