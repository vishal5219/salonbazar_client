// Step 4: Confirmation — the celebratory success screen
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiCalendar, FiClock, FiUser, FiMapPin, FiDownload, FiHome, FiList } from 'react-icons/fi'
import { resetBooking } from '@/store/slices/bookingSlice'
import styles from './Step4Confirm.module.css'

function ConfettiPiece({ style }) {
  return <div className={styles.confettiPiece} style={style} />
}

const CONFETTI_COLORS = ['var(--gold)', 'var(--charcoal)', 'var(--gold-light)', '#10B981', 'var(--cream-2)']

export default function Step4Confirm({ booking, salonId }) {
  const dispatch  = useDispatch()
  const celebRef  = useRef(null)

  // Generate confetti on mount
  const confetti = Array.from({ length: 28 }, (_, i) => ({
    key:   i,
    style: {
      left:             `${Math.random() * 100}%`,
      animationDelay:   `${Math.random() * 0.8}s`,
      animationDuration:`${1.2 + Math.random() * 1}s`,
      background:       CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      width:            `${6 + Math.random() * 8}px`,
      height:           `${6 + Math.random() * 8}px`,
      borderRadius:     Math.random() > 0.5 ? '50%' : '2px',
    }
  }))

  if (!booking) return null

  const handleAddToCalendar = () => {
    const dtStr = `${booking.date} ${booking.time}`
    const event = {
      title:    `${booking.serviceName} at ${booking.salonName}`,
      details:  `Booking ID: ${booking.id}`,
      location: booking.salonName,
    }
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`
    window.open(url, '_blank')
  }

  return (
    <div className={styles.wrap}>
      {/* Confetti burst */}
      <div className={styles.confettiWrap} aria-hidden>
        {confetti.map(c => <ConfettiPiece key={c.key} style={c.style} />)}
      </div>

      {/* Success icon */}
      <div className={styles.successRing}>
        <div className={styles.successCircle}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M7 18l7 7 15-15"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.checkPath}
            />
          </svg>
        </div>
      </div>

      {/* Heading */}
      <div className={styles.heading}>
        <h1 className={styles.title}>You're All Set!</h1>
        <p className={styles.sub}>
          Your appointment has been confirmed. We've sent a confirmation to your email and WhatsApp.
        </p>
      </div>

      {/* Booking card — looks like a ticket */}
      <div className={styles.ticketCard}>
        {/* Ticket header */}
        <div className={styles.ticketHeader}>
          <div className={styles.ticketSalon}>{booking.salonName}</div>
          <div className={styles.bookingId}>#{booking.id}</div>
        </div>

        {/* Notch divider */}
        <div className={styles.ticketNotch}>
          <div className={styles.notchLeft} />
          <div className={styles.dashedLine} />
          <div className={styles.notchRight} />
        </div>

        {/* Ticket body */}
        <div className={styles.ticketBody}>
          <div className={styles.ticketGrid}>
            <div className={styles.ticketField}>
              <div className={styles.fieldIcon}><FiCalendar size={14}/></div>
              <div>
                <div className={styles.fieldLabel}>Date</div>
                <div className={styles.fieldValue}>{booking.date}</div>
              </div>
            </div>
            <div className={styles.ticketField}>
              <div className={styles.fieldIcon}><FiClock size={14}/></div>
              <div>
                <div className={styles.fieldLabel}>Time</div>
                <div className={styles.fieldValue}>{booking.time}</div>
              </div>
            </div>
            <div className={styles.ticketField}>
              <div className={styles.fieldIcon}><FiUser size={14}/></div>
              <div>
                <div className={styles.fieldLabel}>Service</div>
                <div className={styles.fieldValue}>{booking.serviceName}</div>
              </div>
            </div>
            <div className={styles.ticketField}>
              <div className={styles.fieldIcon}><FiUser size={14}/></div>
              <div>
                <div className={styles.fieldLabel}>Stylist</div>
                <div className={styles.fieldValue}>{booking.staffName || 'Any Available'}</div>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className={styles.ticketAmount}>
            <span className={styles.amountLabel}>
              {booking.paymentMethod === 'counter' ? 'Pay at Counter' : 'Amount Paid'}
            </span>
            <span className={styles.amountValue}>₹{booking.total?.toLocaleString()}</span>
          </div>

          {/* QR placeholder */}
          <div className={styles.qrBlock}>
            <div className={styles.qrCode}>
              {/* SVG QR placeholder */}
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="2.5"/>
                <rect x="8" y="8" width="12" height="12" rx="1" fill="currentColor"/>
                <rect x="54" y="2" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="2.5"/>
                <rect x="60" y="8" width="12" height="12" rx="1" fill="currentColor"/>
                <rect x="2" y="54" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="2.5"/>
                <rect x="8" y="60" width="12" height="12" rx="1" fill="currentColor"/>
                <rect x="34" y="2" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="44" y="2" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="2" y="34" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="2" y="44" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="34" y="34" width="12" height="12" rx="2" fill="currentColor"/>
                <rect x="54" y="34" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="64" y="34" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="54" y="44" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="34" y="54" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="44" y="54" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="34" y="64" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="54" y="64" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="64" y="64" width="12" height="6" rx="1" fill="currentColor"/>
                <rect x="44" y="44" width="6" height="6" rx="1" fill="currentColor"/>
              </svg>
            </div>
            <div className={styles.qrLabel}>Show at salon reception</div>
          </div>

          {/* Queue position */}
          {booking.queuePosition && (
            <div className={styles.queueBlock}>
              <span className={styles.queueIcon}>🔢</span>
              <div>
                <div className={styles.queueNum}>Queue #{booking.queuePosition}</div>
                <div className={styles.queueSub}>You're #{booking.queuePosition} in today's queue</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.calendarBtn} onClick={handleAddToCalendar}>
          <FiCalendar size={15}/> Add to Calendar
        </button>
        <button className={styles.downloadBtn} onClick={() => window.print()}>
          <FiDownload size={15}/> Download Receipt
        </button>
      </div>

      {/* Navigation links */}
      <div className={styles.navLinks}>
        <Link to="/" className={styles.navLink} onClick={() => dispatch(resetBooking())}>
          <FiHome size={14}/> Back to Home
        </Link>
        <Link to="/bookings" className={styles.navLink} onClick={() => dispatch(resetBooking())}>
          <FiList size={14}/> My Bookings
        </Link>
        <Link to={`/salons/${salonId}`} className={styles.navLink} onClick={() => dispatch(resetBooking())}>
          <FiMapPin size={14}/> View Salon
        </Link>
      </div>

      {/* Cancellation reminder */}
      <div className={styles.reminder}>
        ℹ Cancellation is free up to 2 hours before your appointment. To cancel or reschedule, visit <strong>My Bookings</strong>.
      </div>
    </div>
  )
}