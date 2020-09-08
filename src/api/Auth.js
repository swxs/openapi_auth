const REGISTER_URL = 'api/authorize/user_auth/'
const LOGIN_URL = 'api/authorize/token/auth/'
const LOGOUT_URL = ''
const REFRESH_TOKEN_URL = 'api/authorize/token/refresh/'

export const register = (data) => {
  return new Promise(function(resolve, reject) {
    window.axios.post(`${REGISTER_URL}`, data).then((response) => {
      resolve(response)
    })
  })
}

export const login = (data) => {
  return new Promise(function(resolve, reject) {
    window.axios.post(`${LOGIN_URL}`, data).then((response) => {
      resolve(response)
    })
  })
}

export const logout = (data) => {
  return new Promise(function(resolve, reject) {
    window.axios.post(`${LOGOUT_URL}`, data).then((response) => {
      resolve(response)
    })
  })
}

export const refreshToken = (data) => {
  return new Promise(function(resolve, reject) {
    window.axios.post(`${REFRESH_TOKEN_URL}`, data).then((response) => {
      resolve(response)
    })
  })
}
