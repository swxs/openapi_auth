import Vue from 'vue'

const REGISTER_URL = 'api/system/auth/signin'
const LOGIN_URL = 'api/system/auth/refresh_token'
const LOGOUT_URL = ''
const REFRESH_TOKEN_URL = 'api/system/auth/token'
const GITHUB_LOGIN_URL = 'api/system/auth/github/login'

export async function register(data) {
  return Vue.axios.post(`${REGISTER_URL}`, data)
}

export async function login(data) {
  return Vue.axios.post(`${LOGIN_URL}`, data)
}

export async function logout(data) {
  return Vue.axios.post(`${LOGOUT_URL}`, data)
}

export async function refreshToken(data) {
  return Vue.axios.post(`${REFRESH_TOKEN_URL}`, data)
}

export async function getGithubLoginUrl() {
  return Vue.axios.get(`${GITHUB_LOGIN_URL}`)
}
