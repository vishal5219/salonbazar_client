// ─────────────────────────────────────────────────────────────
//  services/authService.js
//  All calls go to https://api.salonbazar.shop/api/v1/auth/*
// ─────────────────────────────────────────────────────────────
import api from './api'
import { AUTH_ENDPOINTS } from '@/constants/config'

export const authService = {

  /** Email + password login */
  login: (email, password) =>
    api.post(AUTH_ENDPOINTS.login, { email, password }),

  /** New customer registration */
  register: (data) =>
    api.post(AUTH_ENDPOINTS.register, data),
  // data: { name, email, phone, password, role? }

  /** Send OTP to phone number */
  sendOTP: (phone) =>
    api.post(AUTH_ENDPOINTS.loginOTP, { phone }),

  /** Verify OTP — returns token on success */
  verifyOTP: (phone, otp) =>
    api.post(AUTH_ENDPOINTS.verifyOTP, { phone, otp }),

  /** Google OAuth — send ID token from Google SDK */
  googleLogin: (idToken) =>
    api.post(AUTH_ENDPOINTS.googleAuth, { idToken }),

  /** Logout — invalidates token on server */
  logout: () =>
    api.post(AUTH_ENDPOINTS.logout),

  /** Request password reset email */
  forgotPassword: (email) =>
    api.post(AUTH_ENDPOINTS.forgotPassword, { email }),

  /** Reset password with token from email link */
  resetPassword: (token, newPassword) =>
    api.post(AUTH_ENDPOINTS.resetPassword, { token, newPassword }),

  // ── Token helpers (localStorage) ──────────────────────────
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
