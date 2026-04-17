import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  FiCalendar, FiClock, FiUser, FiMapPin,
  FiXCircle, FiStar, FiChevronDown, FiChevronUp,
  FiRepeat, FiCheck,
} from 'react-icons/fi'
import { cancelBooking, submitReview } from '@/store/slices/profileSlice'
import { showNotification }            from '@/store/slices/uiSlice'
import styles from './BookingHistory.module.css'

const STATUS_FILTERS = ['All', 'Upcoming', 'Completed', 'Cancelled']

// ── Review Modal ──────────────────────────────────────────────
function ReviewModal({ booking, onClose, onSubmit }) {
  const [rating, setRating] = useState(5)
  const [text,   setText]   = useState('')
  const [hover,  setHover]  = useState(0)

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <h3 className={styles.modalTitle}>Leave a Review</h3>
        <p className={styles.modalSub}>
          <em>{booking.serviceName}</em> at <strong>{booking.salonName}</strong>
        </p>

        {/* Star picker */}
        <div className={styles.starPicker}>
          {[1,2,3,4,5].map(s => (
            <button
              key={s}
              className={`${styles.starBtn} ${s <= (hover || rating) ? styles.starActive : ''}`}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(s)}
            >
              ★
            </button>
          ))}
          <span className={styles.ratingLabel}>
            {['','Poor','Fair','Good','Great','Excellent'][rating]}
          </span>
        </div>

        {/* Text */}
        <textarea
          className={styles.reviewTextarea}
          placeholder="Share your experience (optional)..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
        />

        <button
          className={styles.submitReviewBtn}
          onClick={() => onSubmit(rating, text)}
        >
          Submit Review
        </button>
      </div>
    </div>
  )
}

// ── Single booking card ───────────────────────────────────────
function BookingCard({ booking }) {
  const dispatch = useDispatch()
  const [expanded,     setExpanded]     = useState(false)
  const [reviewOpen,   setReviewOpen]   = useState(false)
  const [cancelling,   setCancelling]   = useState(false)

  const handleCancel = async () => {
    if (!confirm(`Cancel booking ${booking.id}?`)) return
    setCancelling(true)
    await dispatch(cancelBooking(booking.id))
    dispatch(showNotification({ message: 'Booking cancelled successfully.', type: 'success' }))
    setCancelling(false)
  }

  const handleReviewSubmit = async (rating, text) => {
    await dispatch(submitReview({ bookingId: booking.id, rating, text }))
    dispatch(showNotification({ message: 'Thank you for your review!', type: 'success' }))
    setReviewOpen(false)
  }

  const statusConfig = {
    upcoming:  { label: 'Upcoming',  cls: styles.statusUpcoming  },
    completed: { label: 'Completed', cls: styles.statusCompleted },
    cancelled: { label: 'Cancelled', cls: styles.statusCancelled },
  }

  const { label, cls } = statusConfig[booking.status] || {}

  return (
    <>
      <div className={`${styles.bookingCard} ${booking.status === 'upcoming' ? styles.cardUpcoming : ''}`}>
        {/* Left: salon image */}
        <div className={styles.salonImgWrap}>
          <img src={booking.salonImage} alt={booking.salonName} className={styles.salonImg} />
          <span className={`${styles.statusPill} ${cls}`}>{label}</span>
        </div>

        {/* Center: booking info */}
        <div className={styles.bookingInfo}>
          <div className={styles.bookingTop}>
            <div>
              <h3 className={styles.bookingService}>{booking.serviceName}</h3>
              <Link to={`/salons/${booking.salonId}`} className={styles.salonName}>
                <FiMapPin size={12} /> {booking.salonName}
              </Link>
            </div>
            <div className={styles.bookingId}>#{booking.id}</div>
          </div>

          <div className={styles.bookingMeta}>
            <span><FiCalendar size={12} /> {booking.date}</span>
            <span><FiClock size={12} /> {booking.time}</span>
            <span><FiUser size={12} /> {booking.staffName}</span>
          </div>

          <div className={styles.bookingBadges}>
            <span className={styles.typeBadge} data-type={booking.bookingType}>
              {booking.bookingType}
            </span>
            <span className={styles.payBadge}>
              {booking.paymentMethod === 'online' ? '💳 Paid Online' : '🏪 Paid at Counter'}
            </span>
          </div>
        </div>

        {/* Right: amount + actions */}
        <div className={styles.bookingRight}>
          <div className={styles.amount}>₹{booking.amount.toLocaleString()}</div>

          <div className={styles.actionBtns}>
            {/* Review button */}
            {booking.canReview && !booking.reviewed && booking.status === 'completed' && (
              <button
                className={styles.reviewBtn}
                onClick={() => setReviewOpen(true)}
              >
                <FiStar size={13} /> Review
              </button>
            )}

            {/* Reviewed badge */}
            {booking.reviewed && (
              <span className={styles.reviewedBadge}>
                <FiCheck size={11} /> Reviewed
              </span>
            )}

            {/* Rebook */}
            {booking.status === 'completed' && (
              <Link to={`/salons/${booking.salonId}`} className={styles.rebookBtn}>
                <FiRepeat size={13} /> Rebook
              </Link>
            )}

            {/* Cancel */}
            {booking.status === 'upcoming' && (
              <button
                className={styles.cancelBtn}
                onClick={handleCancel}
                disabled={cancelling}
              >
                <FiXCircle size={13} />
                {cancelling ? '...' : 'Cancel'}
              </button>
            )}
          </div>

          {/* Expand toggle */}
          <button
            className={styles.expandBtn}
            onClick={() => setExpanded(v => !v)}
          >
            {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className={styles.expandedPanel}>
          <div className={styles.expandedGrid}>
            <div>
              <div className={styles.expandLabel}>Booking ID</div>
              <div className={styles.expandValue}>{booking.id}</div>
            </div>
            <div>
              <div className={styles.expandLabel}>Payment</div>
              <div className={styles.expandValue}>
                {booking.paymentMethod === 'online' ? 'Paid Online' : 'Counter Payment'}
              </div>
            </div>
            <div>
              <div className={styles.expandLabel}>Booking Type</div>
              <div className={styles.expandValue} style={{ textTransform: 'capitalize' }}>
                {booking.bookingType === 'qr' ? 'QR Walk-In' : booking.bookingType}
              </div>
            </div>
            <div>
              <div className={styles.expandLabel}>Amount</div>
              <div className={styles.expandValue}>₹{booking.amount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Review modal */}
      {reviewOpen && (
        <ReviewModal
          booking={booking}
          onClose={() => setReviewOpen(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </>
  )
}

// ── Main export ───────────────────────────────────────────────
export default function BookingHistory() {
  const { bookings } = useSelector(s => s.profile)
  const [filter, setFilter] = useState('All')

  const filtered = bookings.filter(b => {
    if (filter === 'All')       return true
    return b.status === filter.toLowerCase()
  })

  const counts = STATUS_FILTERS.reduce((acc, f) => {
    acc[f] = f === 'All'
      ? bookings.length
      : bookings.filter(b => b.status === f.toLowerCase()).length
    return acc
  }, {})

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Booking History</h2>
        <p className={styles.sub}>{bookings.length} appointments total</p>
      </div>

      {/* Filter pills */}
      <div className={styles.filters}>
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
            {counts[f] > 0 && (
              <span className={styles.filterCount}>{counts[f]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📅</span>
          <h3 className={styles.emptyTitle}>No {filter.toLowerCase()} bookings</h3>
          <p className={styles.emptySub}>
            {filter === 'All'
              ? "You haven't booked any services yet."
              : `No ${filter.toLowerCase()} bookings to show.`}
          </p>
          <Link to="/salons" className={styles.exploreCta}>Explore Salons →</Link>
        </div>
      ) : (
        <div className={styles.cardsList}>
          {filtered.map((b, i) => (
            <div key={b.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <BookingCard booking={b} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}