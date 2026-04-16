// ─────────────────────────────────────────────────────────────
//  services/paymentService.js
//  All calls go to https://api.salonbazar.shop/api/v1/payments/*
//  Uses Razorpay on the frontend, verified server-side.
// ─────────────────────────────────────────────────────────────
import api from './api'
import { PAYMENT_ENDPOINTS, RAZORPAY_KEY_ID, APP_NAME } from '@/constants/config'

export const paymentService = {

  /** Step 1 — Create Razorpay order on backend */
  createOrder: (data) =>
    api.post(PAYMENT_ENDPOINTS.createOrder, data),
  // data: { booking_id, amount, currency: 'INR' }

  /** Step 2 — Open Razorpay checkout modal */
  openCheckout: ({ order, user, onSuccess, onFailure }) => {
    if (!window.Razorpay) {
      console.error('Razorpay SDK not loaded. Add the script tag to index.html.')
      return
    }

    const options = {
      key:         RAZORPAY_KEY_ID,
      amount:      order.amount,       // in paise
      currency:    order.currency || 'INR',
      name:        APP_NAME,
      description: 'Salon Booking Payment',
      order_id:    order.id,
      prefill: {
        name:  user?.name  || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: { color: '#C9A84C' },     // SalonBazar gold
      handler: (response) => onSuccess?.(response),
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => onFailure?.(response))
    rzp.open()
  },

  /** Step 3 — Verify payment signature on backend */
  verify: (data) =>
    api.post(PAYMENT_ENDPOINTS.verify, data),
  /*
    data: {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id
    }
  */

  /** Request a refund */
  refund: (paymentId, reason = '') =>
    api.post(PAYMENT_ENDPOINTS.refund(paymentId), { reason }),

  /** Get payment history for logged-in user */
  getHistory: () =>
    api.get(PAYMENT_ENDPOINTS.history),
}

export default paymentService
