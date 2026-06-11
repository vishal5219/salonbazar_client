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

  getStaff: () => api.get(USER_ENDPOINTS.staffList),

  createStaff: (data) => api.post(USER_ENDPOINTS.staffCreate, data),

  updateStaff: (staffId, data) => api.patch(USER_ENDPOINTS.staffUpdate(staffId), data),

  removeStaff: (staffId) => api.delete(USER_ENDPOINTS.staffRemove(staffId)),
}

export default userService
