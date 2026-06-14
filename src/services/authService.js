// ─────────────────────────────────────────────────────────────
//  services/authService.js
// ─────────────────────────────────────────────────────────────
import api from './api'
import { AUTH_ENDPOINTS } from '@/constants/config'

export const authService = {

  login: (identifier, password) =>
    api.post(AUTH_ENDPOINTS.login, { identifier, password }),

  /** Start signup — sends OTP (phone) or verification email */
  initiateSignup: (data) =>
    api.post(AUTH_ENDPOINTS.registerInitiate, data),

  verifySignupOtp: (verificationId, otp) =>
    api.post(AUTH_ENDPOINTS.registerVerifyOtp, { verificationId, otp }),

  verifySignupEmail: (token) =>
    api.get(`${AUTH_ENDPOINTS.registerVerifyEmail}?token=${encodeURIComponent(token)}`),

  resendSignupVerification: (verificationId) =>
    api.post(AUTH_ENDPOINTS.registerResend, { verificationId }),

  /** @deprecated */
  register: (data) =>
    api.post(AUTH_ENDPOINTS.register, data),

  sendOTP: (phone) =>
    api.post(AUTH_ENDPOINTS.loginOTP, { phone }),

  verifyOTP: (phone, otp) =>
    api.post(AUTH_ENDPOINTS.verifyOTP, { phone, otp }),

  googleLogin: (idToken, role) =>
    api.post(AUTH_ENDPOINTS.googleAuth, { idToken, role }),

  logout: () =>
    api.post(AUTH_ENDPOINTS.logout),

  forgotPassword: (email) =>
    api.post(AUTH_ENDPOINTS.forgotPassword, { email }),

  resetPassword: (token, newPassword) =>
    api.post(AUTH_ENDPOINTS.resetPassword, { token, newPassword }),

  saveTokens: (token, refreshToken) => {
    localStorage.setItem('sb_token', token)
    if (refreshToken) localStorage.setItem('sb_refresh_token', refreshToken)
  },

  clearTokens: () => {
    localStorage.removeItem('sb_token')
    localStorage.removeItem('sb_refresh_token')
  },

  getToken: () => localStorage.getItem('sb_token'),
}

export default authService
