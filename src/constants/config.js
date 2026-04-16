// ── Domains ──────────────────────────────────────────────────
export const APP_URL     = import.meta.env.VITE_APP_URL     || 'https://salonbazar.shop'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.salonbazar.shop'

// ── API Versioned Base ────────────────────────────────────────
export const API_V1 = `${API_BASE_URL}/api/v1`

// ── Auth Endpoints ────────────────────────────────────────────
export const AUTH_ENDPOINTS = {
  login:          `${API_V1}/auth/login`,
  register:       `${API_V1}/auth/register`,
  loginOTP:       `${API_V1}/auth/otp/send`,
  verifyOTP:      `${API_V1}/auth/otp/verify`,
  googleAuth:     `${API_V1}/auth/google`,
  logout:         `${API_V1}/auth/logout`,
  refreshToken:   `${API_V1}/auth/refresh`,
  forgotPassword: `${API_V1}/auth/forgot-password`,
  resetPassword:  `${API_V1}/auth/reset-password`,
}

// ── Salon Endpoints ───────────────────────────────────────────
export const SALON_ENDPOINTS = {
  list:     `${API_V1}/salons`,
  featured: `${API_V1}/salons/featured`,
  nearby:   `${API_V1}/salons/nearby`,
  detail:   (id) => `${API_V1}/salons/${id}`,
  search:   `${API_V1}/salons/search`,
  register: `${API_V1}/salons/register`,
  update:   (id) => `${API_V1}/salons/${id}`,
  delete:   (id) => `${API_V1}/salons/${id}`,
  qrCode:   (id) => `${API_V1}/salons/${id}/qr`,
}

// ── Service Endpoints ─────────────────────────────────────────
export const SERVICE_ENDPOINTS = {
  bySalon: (salonId) => `${API_V1}/salons/${salonId}/services`,
  create:  (salonId) => `${API_V1}/salons/${salonId}/services`,
  update:  (salonId, id) => `${API_V1}/salons/${salonId}/services/${id}`,
  delete:  (salonId, id) => `${API_V1}/salons/${salonId}/services/${id}`,
}

// ── Booking Endpoints ─────────────────────────────────────────
export const BOOKING_ENDPOINTS = {
  create:      `${API_V1}/bookings`,
  list:        `${API_V1}/bookings`,
  detail:      (id) => `${API_V1}/bookings/${id}`,
  cancel:      (id) => `${API_V1}/bookings/${id}/cancel`,
  reschedule:  (id) => `${API_V1}/bookings/${id}/reschedule`,
  byShop:      (salonId) => `${API_V1}/salons/${salonId}/bookings`,
  slots:       (salonId) => `${API_V1}/salons/${salonId}/slots`,
  backdated:   `${API_V1}/bookings/backdated`,
}

// ── Queue Endpoints ───────────────────────────────────────────
export const QUEUE_ENDPOINTS = {
  join:       (salonId) => `${API_V1}/salons/${salonId}/queue/join`,
  status:     (salonId) => `${API_V1}/salons/${salonId}/queue`,
  myPosition: (salonId) => `${API_V1}/salons/${salonId}/queue/me`,
  leave:      (salonId) => `${API_V1}/salons/${salonId}/queue/leave`,
  advance:    (salonId) => `${API_V1}/salons/${salonId}/queue/advance`,
  manualAdd:  (salonId) => `${API_V1}/salons/${salonId}/queue/manual`,
}

// ── Review Endpoints ──────────────────────────────────────────
export const REVIEW_ENDPOINTS = {
  bySalon: (salonId) => `${API_V1}/salons/${salonId}/reviews`,
  create:  (salonId) => `${API_V1}/salons/${salonId}/reviews`,
  delete:  (salonId, id) => `${API_V1}/salons/${salonId}/reviews/${id}`,
}

// ── Wishlist Endpoints ────────────────────────────────────────
export const WISHLIST_ENDPOINTS = {
  list:   `${API_V1}/wishlist`,
  add:    `${API_V1}/wishlist`,
  remove: (salonId) => `${API_V1}/wishlist/${salonId}`,
}

// ── Staff Endpoints ───────────────────────────────────────────
export const STAFF_ENDPOINTS = {
  list:   (salonId) => `${API_V1}/salons/${salonId}/staff`,
  create: (salonId) => `${API_V1}/salons/${salonId}/staff`,
  update: (salonId, id) => `${API_V1}/salons/${salonId}/staff/${id}`,
  delete: (salonId, id) => `${API_V1}/salons/${salonId}/staff/${id}`,
}

// ── Payment Endpoints ─────────────────────────────────────────
export const PAYMENT_ENDPOINTS = {
  createOrder:  `${API_V1}/payments/order`,
  verify:       `${API_V1}/payments/verify`,
  refund:       (id) => `${API_V1}/payments/${id}/refund`,
  history:      `${API_V1}/payments/history`,
}

// ── User / Profile Endpoints ──────────────────────────────────
export const USER_ENDPOINTS = {
  profile:        `${API_V1}/users/me`,
  updateProfile:  `${API_V1}/users/me`,
  uploadAvatar:   `${API_V1}/users/me/avatar`,
  bookings:       `${API_V1}/users/me/bookings`,
  notifications:  `${API_V1}/users/me/notifications`,
}

// ── Dashboard / Analytics Endpoints ──────────────────────────
export const DASHBOARD_ENDPOINTS = {
  overview:     (salonId) => `${API_V1}/salons/${salonId}/dashboard`,
  earnings:     (salonId) => `${API_V1}/salons/${salonId}/analytics/earnings`,
  peakHours:    (salonId) => `${API_V1}/salons/${salonId}/analytics/peak-hours`,
  popularity:   (salonId) => `${API_V1}/salons/${salonId}/analytics/services`,
  adminSummary: `${API_V1}/admin/analytics`,
}

// ── Upload Endpoints ──────────────────────────────────────────
export const UPLOAD_ENDPOINTS = {
  image: `${API_V1}/upload/image`,
}

// ── Supabase ──────────────────────────────────────────────────
export const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL      || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// ── Third-party ───────────────────────────────────────────────
export const RAZORPAY_KEY_ID       = import.meta.env.VITE_RAZORPAY_KEY_ID       || ''
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
export const CLOUDINARY_PRESET     = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''
export const GOOGLE_CLIENT_ID      = import.meta.env.VITE_GOOGLE_CLIENT_ID      || ''

// ── App Meta ──────────────────────────────────────────────────
export const APP_NAME    = 'SalonBazar'
export const APP_TAGLINE = 'Your Best Look, Perfectly Booked.'
export const SUPPORT_EMAIL = 'support@salonbazar.shop'
export const CONTACT_EMAIL = 'hello@salonbazar.shop'
