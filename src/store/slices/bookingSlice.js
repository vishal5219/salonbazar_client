import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import bookingService from '@/services/bookingService'
import paymentService from '@/services/paymentService'

// ── Steps ─────────────────────────────────────────────────────
// 1 = Service Selection
// 2 = Date & Time
// 3 = Payment
// 4 = Confirmation

function buildApiPayload(bookingData) {
  const selectedDate = bookingData.selectedDate
  const scheduledDate = selectedDate
    ? `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`
    : undefined

  return {
    salonId: bookingData.salonId,
    serviceId: bookingData.serviceId,
    staffId: bookingData.staffId || null,
    scheduled_date: scheduledDate,
    scheduled_time: bookingData.time,
    display_date: bookingData.date,
    payment_method: bookingData.paymentMethod,
    coupon_code: bookingData.couponCode || null,
    booking_type: bookingData.bookingType || 'online',
    customer_name: bookingData.customerName,
    customer_email: bookingData.customerEmail,
  }
}

export const submitBooking = createAsyncThunk(
  'booking/submit',
  async (bookingData, { rejectWithValue }) => {
    try {
      const booking = await bookingService.create(buildApiPayload(bookingData))
      return {
        ...booking,
        salonName: bookingData.salonName,
        queuePosition: Math.floor(Math.random() * 5) + 1,
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Booking failed')
    }
  }
)

export const verifyPayment = createAsyncThunk(
  'booking/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const result = await paymentService.verify(paymentData)
      return { verified: true, paymentId: paymentData.razorpay_payment_id, ...result }
    } catch (err) {
      return rejectWithValue(err.message || 'Payment verification failed')
    }
  }
)

const initialState = {
  step: 1,
  selectedService:  null,
  selectedStaff:    null,
  salonId:          null,
  salonName:        '',
  salonImage:       '',
  selectedDate:     null,
  selectedSlot:     null,
  paymentMethod:    'online',
  couponCode:       '',
  couponDiscount:   0,
  paymentVerified:  false,
  razorpayOrderId:  null,
  currentBooking:   null,
  bookingHistory:   [],
  loading:   false,
  error:     null,
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setStep:          (s, a) => { s.step = a.payload; s.error = null },
    goNextStep:       (s)    => { if (s.step < 4) s.step++ },
    goPrevStep:       (s)    => { if (s.step > 1) s.step--; s.error = null },
    setSelectedService: (s, a) => { s.selectedService = a.payload },
    setSelectedStaff:   (s, a) => { s.selectedStaff   = a.payload },
    setSalonContext:    (s, a) => {
      s.salonId    = a.payload.salonId
      s.salonName  = a.payload.salonName
      s.salonImage = a.payload.salonImage || ''
    },
    initializeBookingFlow: (s, a) => {
      s.salonId    = a.payload.salonId
      s.salonName  = a.payload.salonName
      s.salonImage = a.payload.salonImage || ''
      if (s.selectedService && s.selectedDate && s.selectedSlot) {
        s.step = 3
      } else if (s.selectedService) {
        s.step = 2
      } else {
        s.step = 1
      }
    },
    setSelectedDate: (s, a) => { s.selectedDate = a.payload; s.selectedSlot = null },
    setSelectedSlot: (s, a) => { s.selectedSlot = a.payload },
    setPaymentMethod:  (s, a) => { s.paymentMethod   = a.payload },
    applyCoupon:       (s, a) => {
      s.couponCode     = a.payload.code
      s.couponDiscount = a.payload.discount
    },
    clearCoupon:       (s)    => { s.couponCode = ''; s.couponDiscount = 0 },
    setRazorpayOrder:  (s, a) => { s.razorpayOrderId = a.payload },
    markPaymentVerified:(s)   => { s.paymentVerified = true },
    addToHistory: (s, a) => { s.bookingHistory.unshift(a.payload) },
    clearError:   (s)    => { s.error = null },
    resetBooking: ()     => ({ ...initialState }),
  },
  extraReducers: builder => {
    builder
      .addCase(submitBooking.pending,   s => { s.loading = true; s.error = null })
      .addCase(submitBooking.fulfilled, (s, a) => {
        s.loading        = false
        s.currentBooking = a.payload
        s.step           = 4
        s.bookingHistory.unshift(a.payload)
      })
      .addCase(submitBooking.rejected,  (s, a) => {
        s.loading = false
        s.error   = a.payload
      })
      .addCase(verifyPayment.pending,   s => { s.loading = true })
      .addCase(verifyPayment.fulfilled, s => {
        s.loading         = false
        s.paymentVerified = true
      })
      .addCase(verifyPayment.rejected,  (s, a) => {
        s.loading = false
        s.error   = a.payload
      })
  },
})

export const {
  setStep, goNextStep, goPrevStep,
  setSelectedService, setSelectedStaff, setSalonContext, initializeBookingFlow,
  setSelectedDate, setSelectedSlot,
  setPaymentMethod, applyCoupon, clearCoupon,
  setRazorpayOrder, markPaymentVerified,
  addToHistory, clearError, resetBooking,
} = bookingSlice.actions

export default bookingSlice.reducer
