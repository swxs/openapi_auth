import Vue from 'vue'

const REGISTER_URL = 'api/authorize/user_auth/'
const LOGIN_URL = 'api/authorize/token/auth/'
const LOGOUT_URL = ''
const REFRESH_TOKEN_URL = 'api/authorize/token/refresh/'

export async function register(params) {
  return Vue.axios.post(`${REGISTER_URL}`, { params })
}

export async function login(params) {
  return Vue.axios.post(`${LOGIN_URL}`, { params })
}

export async function logout(params) {
  return Vue.axios.post(`${LOGOUT_URL}`, { params })
}

export async function refreshToken(params) {
  return Vue.axios.post(`${REFRESH_TOKEN_URL}`, { params })
}
