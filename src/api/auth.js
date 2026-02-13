import axios from '@/plugins/axios'

const REGISTER_URL = 'api/system/auth/signin'
const LOGIN_URL = 'api/system/auth/refresh_token'
const LOGOUT_URL = ''
const REFRESH_TOKEN_URL = 'api/system/auth/token'
const GITHUB_LOGIN_URL = 'api/system/auth/github/login'

export async function register(data) {
  return axios.post(REGISTER_URL, data)
}

export async function login(data) {
  return axios.post(LOGIN_URL, data)
}

export async function logout(data) {
  return axios.post(LOGOUT_URL, data)
}

export async function refreshToken(data) {
  return axios.post(REFRESH_TOKEN_URL, data)
}

export async function getGithubLoginUrl() {
  return axios.get(GITHUB_LOGIN_URL)
}
