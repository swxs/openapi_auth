import axios from '@/plugins/axios'

const REGISTER_URL = 'api/system/auth/register'
const LOGIN_URL = 'api/system/auth/refresh_token'
const LOGOUT_URL = ''
const REFRESH_TOKEN_URL = 'api/system/auth/token'
const GITHUB_LOGIN_URL = 'api/system/auth/github/login'
const VERIFY_EMAIL_URL = 'api/system/auth/verify-email'
const RESEND_VERIFICATION_URL = 'api/system/auth/resend-verification'
const FORGOT_PASSWORD_URL = 'api/system/auth/forgot-password'
const RESET_PASSWORD_URL = 'api/system/auth/reset-password'

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

export async function verifyEmail(data) {
  return axios.post(VERIFY_EMAIL_URL, data)
}

export async function resendVerification(data) {
  return axios.post(RESEND_VERIFICATION_URL, data)
}

export async function forgotPassword(data) {
  return axios.post(FORGOT_PASSWORD_URL, data)
}

export async function resetPassword(data) {
  return axios.post(RESET_PASSWORD_URL, data)
}
