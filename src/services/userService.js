import api from './api'
import { USER_ENDPOINTS, WISHLIST_ENDPOINTS, BOOKING_ENDPOINTS, REVIEW_ENDPOINTS } from '@/constants/config'

function mapProfileBooking(b) {
  const scheduled = b.scheduledDate ? new Date(b.scheduledDate) : null
  const isFuture = scheduled && scheduled >= new Date(new Date().toDateString())
  let status = b.status
  if (status === 'confirmed' && isFuture) status = 'upcoming'
  return {
    id: b.id,
    salonName: b.salonName,
    salonImage: b.salonImage,
    salonId: b.salonId,
    serviceName: b.serviceName,
    date: b.date || b.displayDate,
    time: b.time,
    staffName: b.staffName,
    amount: b.amount || b.total,
    status,
    paymentMethod: b.paymentMethod,
    bookingType: b.bookingType,
    canReview: b.canReview ?? status === 'completed',
    reviewed: b.reviewed ?? false,
  }
}

export const userService = {
  getProfile: () => api.get(USER_ENDPOINTS.profile),

  updateProfile: (data) => api.patch(USER_ENDPOINTS.updateProfile, data),

  getBookings: async () => {
    const rows = await api.get(USER_ENDPOINTS.bookings)
    return (rows || []).map(mapProfileBooking)
  },

  getWishlist: () => api.get(WISHLIST_ENDPOINTS.list),

  cancelBooking: (id, reason = '') =>
    api.patch(BOOKING_ENDPOINTS.cancel(id), { reason }),

  submitReview: (salonId, { rating, text, serviceName }) =>
    api.post(REVIEW_ENDPOINTS.create(salonId), { rating, text, serviceName }),
}

export default userService
