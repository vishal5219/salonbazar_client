// ── Domains ──────────────────────────────────────────────────
export const APP_URL     = import.meta.env.VITE_APP_URL     || 'http://localhost:5173'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// ── API Versioned Base (used by axios instance in services/api.js) ──
export const API_V1 = API_BASE_URL ? `${API_BASE_URL}/api/v1` : '/api/v1'

// Paths below are relative to API_V1 — do not prefix with /api/v1 again.
// ── Auth Endpoints ────────────────────────────────────────────
export const AUTH_ENDPOINTS = {
  login:          '/auth/login',
  register:       '/auth/register',
  loginOTP:       '/auth/otp/send',
  verifyOTP:      '/auth/otp/verify',
  googleAuth:     '/auth/google',
  logout:         '/auth/logout',
  refreshToken:   '/auth/refresh',
  forgotPassword: '/auth/forgot-password',
  resetPassword:  '/auth/reset-password',
}

// ── Salon Endpoints ───────────────────────────────────────────
export const SALON_ENDPOINTS = {
  list:     '/salons',
  featured: '/salons/featured',
  nearby:   '/salons/nearby',
  detail:   (id) => `/salons/${id}`,
  search:   '/salons/search',
  register: '/salons/register',
  update:   (id) => `/salons/${id}`,
  delete:   (id) => `/salons/${id}`,
  qrCode:   (id) => `/salons/${id}/qr`,
}

// ── Service Endpoints ─────────────────────────────────────────
export const SERVICE_ENDPOINTS = {
  bySalon: (salonId) => `/salons/${salonId}/services`,
  create:  (salonId) => `/salons/${salonId}/services`,
  update:  (salonId, id) => `/salons/${salonId}/services/${id}`,
  delete:  (salonId, id) => `/salons/${salonId}/services/${id}`,
}

// ── Booking Endpoints ─────────────────────────────────────────
export const BOOKING_ENDPOINTS = {
  create:      '/bookings',
  list:        '/bookings',
  summary:     '/bookings/summary',
  detail:      (id) => `/bookings/${id}`,
  cancel:      (id) => `/bookings/${id}/cancel`,
  reschedule:  (id) => `/bookings/${id}/reschedule`,
  byShop:      (salonId) => `/salons/${salonId}/bookings`,
  slots:       (salonId) => `/salons/${salonId}/slots`,
  backdated:   '/bookings/backdated',
}

// ── Queue Endpoints ───────────────────────────────────────────
export const QUEUE_ENDPOINTS = {
  join:       (salonId) => `/salons/${salonId}/queue/join`,
  status:     (salonId) => `/salons/${salonId}/queue`,
  myPosition: (salonId) => `/salons/${salonId}/queue/me`,
  leave:      (salonId) => `/salons/${salonId}/queue/leave`,
  advance:    (salonId) => `/salons/${salonId}/queue/advance`,
  manualAdd:  (salonId) => `/salons/${salonId}/queue/manual`,
  reorder:    (salonId) => `/salons/${salonId}/queue/reorder`,
  completed:  (salonId) => `/salons/${salonId}/queue/completed`,
  update:     (salonId, entryId) => `/salons/${salonId}/queue/${entryId}`,
  remove:     (salonId, entryId) => `/salons/${salonId}/queue/${entryId}`,
}

// ── Review Endpoints ──────────────────────────────────────────
export const REVIEW_ENDPOINTS = {
  bySalon: (salonId) => `/salons/${salonId}/reviews`,
  create:  (salonId) => `/salons/${salonId}/reviews`,
  delete:  (salonId, id) => `/salons/${salonId}/reviews/${id}`,
}

// ── Wishlist Endpoints ────────────────────────────────────────
export const WISHLIST_ENDPOINTS = {
  list:   '/wishlist',
  ids:    '/wishlist/ids',
  check:  (salonId) => `/wishlist/${salonId}/check`,
  add:    '/wishlist',
  remove: (salonId) => `/wishlist/${salonId}`,
}

// ── Staff Endpoints ───────────────────────────────────────────
export const STAFF_ENDPOINTS = {
  list:   (salonId) => `/salons/${salonId}/staff`,
  create: (salonId) => `/salons/${salonId}/staff`,
  update: (salonId, id) => `/salons/${salonId}/staff/${id}`,
  delete: (salonId, id) => `/salons/${salonId}/staff/${id}`,
}

// ── Payment Endpoints ─────────────────────────────────────────
export const PAYMENT_ENDPOINTS = {
  createOrder:  '/payments/order',
  verify:       '/payments/verify',
  refund:       (id) => `/payments/${id}/refund`,
  history:      '/payments/history',
}

// ── User / Profile Endpoints ──────────────────────────────────
export const USER_ENDPOINTS = {
  profile:        '/users/me',
  updateProfile:  '/users/me',
  uploadAvatar:   '/users/me/avatar',
  bookings:       '/users/me/bookings',
  notifications:  '/users/me/notifications',
  staffList:      '/users/staff',
  staffCreate:    '/users/staff',
  staffUpdate:    (staffId) => `/users/staff/${staffId}`,
  staffRemove:    (staffId) => `/users/staff/${staffId}`,
}

// ── Dashboard / Analytics Endpoints ──────────────────────────
export const DASHBOARD_ENDPOINTS = {
  overview:     (salonId) => `/salons/${salonId}/dashboard`,
  earnings:     (salonId) => `/salons/${salonId}/analytics/earnings`,
  peakHours:    (salonId) => `/salons/${salonId}/analytics/peak-hours`,
  popularity:   (salonId) => `/salons/${salonId}/analytics/services`,
  adminSummary: '/admin/analytics',
}

// ── Admin Endpoints ───────────────────────────────────────────
export const ADMIN_ENDPOINTS = {
  overview:    '/admin/overview',
  analytics:   '/admin/analytics',
  salons:      '/admin/salons',
  salonStatus: (id) => `/admin/salons/${id}/status`,
  users:       '/admin/users',
}

// ── Upload Endpoints ──────────────────────────────────────────
export const UPLOAD_ENDPOINTS = {
  image: '/upload/image',
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
