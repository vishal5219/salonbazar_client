// Step 3: Payment
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiShield, FiTag, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi'
import {
  setPaymentMethod, applyCoupon, clearCoupon,
  goPrevStep, submitBooking,
} from '@/store/slices/bookingSlice'
import { RAZORPAY_KEY_ID } from '@/constants/config'
import { showNotification } from '@/store/slices/uiSlice'
import styles from './Step3Payment.module.css'

const VALID_COUPONS = {
  'FIRST50': { discount: 50, desc: '₹50 off your first booking!' },
  'SALON20': { discount: 20, desc: '20% off (up to ₹200)' },
  'BAZAR100': { discount: 100, desc: '₹100 off on orders above ₹500' },
}

const PAYMENT_METHODS = [
  { id: 'online', icon: '💳', label: 'Pay Online', sub: 'UPI, Cards, Net Banking via Razorpay' },
  { id: 'counter', icon: '🏪', label: 'Pay at Salon', sub: 'Cash or card at the counter' },
]

export default function Step3Payment() {
  const dispatch = useDispatch()
  const {
    selectedService, selectedDate, selectedSlot, selectedStaff,
    salonId, salonName, paymentMethod, couponCode, couponDiscount,
    loading, error,
  } = useSelector(s => s.booking)
  const { user } = useSelector(s => s.auth)

  const [couponInput, setCouponInput] = useState(couponCode || '')
  const [couponError, setCouponError] = useState('')
  const [couponApplied, setCouponApplied] = useState(!!couponCode)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const subtotal = selectedService?.price || 0
  const discount = couponDiscount || 0
  const platformFee = 19
  const total = Math.max(0, subtotal - discount + platformFee)

  // Apply coupon
  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    const coupon = VALID_COUPONS[code]
    if (!code) { setCouponError('Enter a coupon code'); return }
    if (!coupon) { setCouponError('Invalid or expired coupon'); return }
    if (code === 'BAZAR100' && subtotal < 500) { setCouponError('Minimum ₹500 order required'); return }
    dispatch(applyCoupon({ code, discount: coupon.discount }))
    setCouponApplied(true)
    setCouponError('')
  }

  const handleRemoveCoupon = () => {
    dispatch(clearCoupon())
    setCouponApplied(false)
    setCouponInput('')
    setCouponError('')
  }

  // Build booking payload
  const buildPayload = () => ({
    salonId,
    salonName,
    serviceId: selectedService?.id,
    serviceName: selectedService?.name,
    servicePrice: selectedService?.price,
    staffId: selectedStaff?.id || null,
    staffName: selectedStaff?.name || 'Any Available',
    date: selectedDate?.displayDate,
    time: typeof selectedSlot === 'string' ? selectedSlot : selectedSlot?.time || '',
    paymentMethod,
    couponCode: couponApplied ? couponInput.toUpperCase() : null,
    discount,
    platformFee,
    total,
    customerName: user?.name,
    customerEmail: user?.email,
    bookingType: 'online',
  })

  // Pay online → Razorpay → verify → confirm
  const handleOnlinePayment = async () => {
    if (!agreeTerms) {
      dispatch(showNotification({ message: 'Please agree to the cancellation policy', type: 'warning' }))
      return
    }

    if (!window.Razorpay) {
      // Razorpay SDK not loaded — proceed directly for dev
      dispatch(submitBooking(buildPayload()))
      return
    }

    // 1. Create order on backend (mock)
    const orderId = `order_${Date.now()}`

    const options = {
      key: RAZORPAY_KEY_ID || 'rzp_test_demo',
      amount: total * 100,
      currency: 'INR',
      name: 'SalonBazar',
      description: `${selectedService?.name} at ${salonName}`,
      order_id: orderId,
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: { color: '#C9A84C' },
      handler: (response) => {
        // Payment success → verify + confirm
        dispatch(submitBooking({
          ...buildPayload(),
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        }))
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', () => {
      dispatch(showNotification({ message: 'Payment failed. Please try again.', type: 'error' }))
    })
    rzp.open()
  }

  // Pay at counter → submit directly
  const handlePayAtCounter = () => {
    if (!agreeTerms) {
      dispatch(showNotification({ message: 'Please agree to the cancellation policy', type: 'warning' }))
      return
    }
    dispatch(submitBooking(buildPayload()))
  }

  const handleConfirm = () => {
    if (paymentMethod === 'online') handleOnlinePayment()
    else handlePayAtCounter()
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.stepTag}>Step 3 of 3</span>
        <h2 className={styles.title}>Review & <em>Pay</em></h2>
        <p className={styles.sub}>Almost there — confirm your booking details below.</p>
      </div>

      {/* Booking review card */}
      <div className={styles.reviewCard}>
        <div className={styles.reviewTitle}>Booking Summary</div>
        <div className={styles.reviewRows}>
          <div className={styles.reviewRow}>
            <span className={styles.reviewLabel}>Service</span>
            <span className={styles.reviewValue}>{selectedService?.name || '—'}</span>
          </div>
          <div className={styles.reviewRow}>
            <span className={styles.reviewLabel}>Date</span>
            <span className={styles.reviewValue}>{selectedDate?.displayDate || '—'}</span>
          </div>
          <div className={styles.reviewRow}>
            <span className={styles.reviewLabel}>Time</span>
            <span className={styles.reviewValue}>{typeof selectedSlot === 'string' ? selectedSlot : selectedSlot?.time || '—'}</span>
          </div>
          <div className={styles.reviewRow}>
            <span className={styles.reviewLabel}>Duration</span>
            <span className={styles.reviewValue}>{selectedService?.duration || '—'} min</span>
          </div>
          <div className={styles.reviewRow}>
            <span className={styles.reviewLabel}>Stylist</span>
            <span className={styles.reviewValue}>{selectedStaff?.name || 'Any Available'}</span>
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Payment Method</div>
        <div className={styles.methodGrid}>
          {PAYMENT_METHODS.map(m => (
            <button
              key={m.id}
              className={`${styles.methodCard} ${paymentMethod === m.id ? styles.methodActive : ''}`}
              onClick={() => dispatch(setPaymentMethod(m.id))}
            >
              <div className={styles.methodIcon}>{m.icon}</div>
              <div className={styles.methodLabel}>{m.label}</div>
              <div className={styles.methodSub}>{m.sub}</div>
              <div className={`${styles.methodCheck} ${paymentMethod === m.id ? styles.methodCheckActive : ''}`}>
                {paymentMethod === m.id && <FiCheck size={11} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Coupon */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}><FiTag size={13} /> Coupon Code</div>
        {couponApplied ? (
          <div className={styles.couponApplied}>
            <div className={styles.couponAppliedLeft}>
              <FiCheck size={15} className={styles.couponCheckIcon} />
              <div>
                <div className={styles.couponCode}>{couponInput.toUpperCase()}</div>
                <div className={styles.couponSaving}>You save ₹{couponDiscount}!</div>
              </div>
            </div>
            <button className={styles.removeCoupon} onClick={handleRemoveCoupon}>
              <FiX size={15} />
            </button>
          </div>
        ) : (
          <div className={styles.couponRow}>
            <input
              type="text"
              value={couponInput}
              onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
              placeholder="Enter coupon code"
              className={styles.couponInput}
              onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
            />
            <button className={styles.applyBtn} onClick={handleApplyCoupon}>
              Apply
            </button>
          </div>
        )}
        {couponError && (
          <div className={styles.couponError}>
            <FiAlertCircle size={13} /> {couponError}
          </div>
        )}
        <div className={styles.couponHints}>
          Try: <button onClick={() => setCouponInput('FIRST50')} className={styles.hintChip}>FIRST50</button>
          <button onClick={() => setCouponInput('BAZAR100')} className={styles.hintChip}>BAZAR100</button>
        </div>
      </div>

      {/* Price breakdown */}
      <div className={styles.priceBreakdown}>
        <div className={styles.priceRow}>
          <span>{selectedService?.name}</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className={`${styles.priceRow} ${styles.discountRow}`}>
            <span>Coupon ({couponCode})</span>
            <span>−₹{discount}</span>
          </div>
        )}
        <div className={`${styles.priceRow} ${styles.feeRow}`}>
          <span>Platform Fee</span>
          <span>₹{platformFee}</span>
        </div>
        <div className={styles.priceDivider} />
        <div className={`${styles.priceRow} ${styles.totalRow}`}>
          <span>Total</span>
          <span className={styles.totalAmt}>₹{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Secure badge */}
      <div className={styles.secureBadge}>
        <FiShield size={16} className={styles.shieldIcon} />
        <span>256-bit encrypted · Powered by Razorpay · PCI DSS compliant</span>
      </div>

      {/* Terms */}
      <label className={styles.termsRow}>
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={e => setAgreeTerms(e.target.checked)}
          className={styles.termsCheck}
        />
        <span className={styles.termsText}>
          I agree to the{' '}
          <a href="/terms" target="_blank" className={styles.termsLink}>cancellation policy</a>
          {' '}and{' '}
          <a href="/terms" target="_blank" className={styles.termsLink}>terms of service</a>.
          Free cancellation up to 2 hours before the appointment.
        </span>
      </label>

      {/* Error */}
      {error && (
        <div className={styles.errorMsg}>
          <FiAlertCircle size={15} /> {error}
        </div>
      )}

      {/* Nav */}
      <div className={styles.navRow}>
        <button className={styles.backBtn} onClick={() => dispatch(goPrevStep())} disabled={loading}>
          ← Back
        </button>
        <button
          className={`${styles.payBtn} ${(!agreeTerms || loading) ? styles.payBtnDisabled : ''}`}
          onClick={handleConfirm}
          disabled={!agreeTerms || loading}
        >
          {loading ? (
            <span className={styles.loadingSpinner}>
              <span className={styles.spinner} />
              Confirming...
            </span>
          ) : paymentMethod === 'online'
            ? `Pay ₹${total.toLocaleString()} →`
            : `Confirm Booking →`
          }
        </button>
      </div>
    </div>
  )
}