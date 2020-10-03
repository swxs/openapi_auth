import Vue from 'vue'

const REGISTER_URL = 'api/authorize/user_auth/'
const LOGIN_URL = 'api/authorize/token/auth/'
const LOGOUT_URL = ''
const REFRESH_TOKEN_URL = 'api/authorize/token/refresh/'

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
