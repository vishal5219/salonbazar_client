// ─────────────────────────────────────────────────────────────
//  services/queueService.js
//  All calls go to https://api.salonbazar.shop/api/v1/salons/:id/queue/*
//  Realtime updates handled separately via supabaseClient.js
// ─────────────────────────────────────────────────────────────
import api from './api'
import { QUEUE_ENDPOINTS } from '@/constants/config'

export const queueService = {

  /** Join queue (QR walk-in or online) */
  join: (salonId, data = {}) =>
    api.post(QUEUE_ENDPOINTS.join(salonId), data),
  /*
    data: {
      service_id,
      customer_name?,  // if not logged in (QR / manual)
      phone?,
    }
  */

  /** Get current full queue for a salon (owner view) */
  getQueue: (salonId) =>
    api.get(QUEUE_ENDPOINTS.status(salonId)),

  /** Get logged-in customer's own queue position */
  getMyPosition: (salonId) =>
    api.get(QUEUE_ENDPOINTS.myPosition(salonId)),

  /** Leave the queue before being served */
  leave: (salonId) =>
    api.delete(QUEUE_ENDPOINTS.leave(salonId)),

  /** Owner advances queue — marks current as completed, moves next to in_progress */
  advance: (salonId) =>
    api.post(QUEUE_ENDPOINTS.advance(salonId)),

  /** Owner manually adds a customer to queue (no phone / POS mode) */
  manualAdd: (salonId, data) =>
    api.post(QUEUE_ENDPOINTS.manualAdd(salonId), data),
  /*
    data: { customer_name, phone?, service_id }
  */
}

export default queueService
