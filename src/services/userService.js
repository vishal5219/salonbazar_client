import api from './api'
import { USER_ENDPOINTS, WISHLIST_ENDPOINTS, BOOKING_ENDPOINTS, REVIEW_ENDPOINTS } from '@/constants/config'
import { mapProfileBooking } from '@/utils/bookingMapper'

export const userService = {
  getProfile: () => api.get(USER_ENDPOINTS.profile),

  updateProfile: (data) => api.patch(USER_ENDPOINTS.updateProfile, data),

  getBookings: async (params = {}) => {
    const rows = await api.get(USER_ENDPOINTS.bookings, { params })
    return (rows || []).map(mapProfileBooking)
  },

  getWishlist: () => api.get(WISHLIST_ENDPOINTS.list),

  cancelBooking: (id, reason = '') =>
    api.patch(BOOKING_ENDPOINTS.cancel(id), { reason }),

  submitReview: (salonId, { rating, text, serviceName }) =>
    api.post(REVIEW_ENDPOINTS.create(salonId), { rating, text, serviceName }),
}

export default userService
