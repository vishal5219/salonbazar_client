// ─────────────────────────────────────────────────────────────
//  services/api.js
//  Axios instance pre-configured for https://api.salonbazar.shop
//  Import this everywhere instead of raw fetch/axios.
// ─────────────────────────────────────────────────────────────
import axios from 'axios'
import { API_BASE_URL } from '@/constants/config'

// ── Create instance ───────────────────────────────────────────
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
})

// ── Request interceptor — attach JWT token ────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sb_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — handle 401 / token refresh ────────
api.interceptors.response.use(
  (response) => response.data,          // unwrap .data automatically
  async (error) => {
    const original = error.config

    // Token expired → try refresh once
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refreshToken = localStorage.getItem('sb_refresh_token')
        const res = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          { refreshToken }
        )
        const newToken = res.data.token
        localStorage.setItem('sb_token', newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        // Refresh failed — clear storage, redirect to login
        localStorage.removeItem('sb_token')
        localStorage.removeItem('sb_refresh_token')
        window.location.href = '/?auth=login'
      }
    }

    // Format error for UI consumption
    const message =
      error.response?.data?.message ||
      error.response?.data?.error   ||
      error.message                  ||
      'Something went wrong'

    return Promise.reject({ message, status: error.response?.status })
  }
)

export default api
