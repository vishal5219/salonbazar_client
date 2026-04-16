// ─────────────────────────────────────────────────────────────
//  services/bookingService.js
//  All calls go to https://api.salonbazar.shop/api/v1/bookings/*
// ─────────────────────────────────────────────────────────────
import api from './api'
import { BOOKING_ENDPOINTS } from '@/constants/config'

export const bookingService = {

  /** Create a new booking (online / qr / manual) */
  create: (data) =>
    api.post(BOOKING_ENDPOINTS.create, data),
  /*
    data: {
      salon_id, service_id, staff_id?,
      booking_type: 'online' | 'qr' | 'manual',
      scheduled_time,
      customer_name?, phone?,   // for manual / qr (no login)
    }
  */

  /** Get all bookings for logged-in customer */
  getMyBookings: (params = {}) =>
    api.get(BOOKING_ENDPOINTS.list, { params }),

  /** Get single booking detail */
  getById: (id) =>
    api.get(BOOKING_ENDPOINTS.detail(id)),

  /** Cancel a booking */
  cancel: (id, reason = '') =>
    api.patch(BOOKING_ENDPOINTS.cancel(id), { reason }),

  /** Reschedule a booking */
  reschedule: (id, newTime) =>
    api.patch(BOOKING_ENDPOINTS.reschedule(id), { scheduled_time: newTime }),

  /** Get all bookings for a salon (owner use) */
  getBySalon: (salonId, params = {}) =>
    api.get(BOOKING_ENDPOINTS.byShop(salonId), { params }),
  // params: { date, status, booking_type }

  /** Get available time slots for a salon + service */
  getSlots: (salonId, params = {}) =>
    api.get(BOOKING_ENDPOINTS.slots(salonId), { params }),
  // params: { service_id, date }

  /** Add a backdated (completed) entry — for revenue tracking */
  addBackdated: (data) =>
    api.post(BOOKING_ENDPOINTS.backdated, { ...data, is_backdated: true }),
}

export default bookingService
