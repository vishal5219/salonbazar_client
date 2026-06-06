import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiClock, FiUser, FiCalendar, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { openAuthModal, showNotification } from '@/store/slices/uiSlice'
import { setSelectedService, setSelectedSlot, setSelectedDate, setSelectedStaff, setStep } from '@/store/slices/bookingSlice'
import styles from './BookingPanel.module.css'

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const days = getDaysInMonth(year, month)
  const blanks = Array(firstDay).fill(null)
  return [...blanks, ...Array.from({ length: days }, (_, i) => i + 1)]
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
  '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
  '06:30 PM', '07:00 PM',
]

const UNAVAILABLE = new Set(['11:00 AM', '12:30 PM', '03:30 PM', '06:00 PM'])

export default function BookingPanel({ salon, selectedService, onClearService }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(s => s.auth)

  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selDay, setSelDay] = useState(today.getDate())
  const [selSlot, setSelSlot] = useState(null)
  const [selStaff, setSelStaff] = useState(null)

  const calDays = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth])

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
    setSelDay(null)
  }

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
    setSelDay(null)
  }

  const isPastDay = (day) => {
    if (!day) return false
    const d = new Date(calYear, calMonth, day)
    d.setHours(0, 0, 0, 0)
    const t = new Date(); t.setHours(0, 0, 0, 0)
    return d < t
  }

  const handleBook = () => {
    if (!selectedService) {
      dispatch(showNotification({ message: 'Please select a service first', type: 'warning' }))
      return
    }
    if (!selDay || !selSlot) {
      dispatch(showNotification({ message: 'Please select a date and time slot', type: 'warning' }))
      return
    }

    if (!isAuthenticated) {
      dispatch(openAuthModal('login'))
      return
    }

    // ✅ Dispatch each piece of state separately with correct types
    dispatch(setSelectedService(selectedService))
    dispatch(setSelectedDate({
      day: selDay,
      month: calMonth,
      monthName: MONTH_NAMES[calMonth],
      monthFull: MONTH_NAMES[calMonth],
      year: calYear,
      displayDate: `${selDay} ${MONTH_NAMES[calMonth]} ${calYear}`,
    }))
    dispatch(setSelectedSlot(selSlot))
    if (selStaff) dispatch(setSelectedStaff(selStaff))
    dispatch(setStep(3))
    navigate(`/booking/${salon.id}`)
  }

  const bookingTotal = selectedService?.price || 0

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <div className={styles.panelTitle}>Book Appointment</div>
          <div className={styles.panelSub}>{salon.name}</div>
        </div>
        <div className={`${styles.statusPill} ${salon.isOpen ? styles.open : styles.closed}`}>
          <span className={styles.statusDot} />
          {salon.isOpen ? 'Open' : 'Closed'}
        </div>
      </div>

      <div className={styles.panelBody}>
        {/* Selected service */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <FiClock size={13} /> Service
          </label>
          {selectedService ? (
            <div className={styles.selectedService}>
              <div className={styles.svcInfo}>
                <span className={styles.svcName}>{selectedService.name}</span>
                <span className={styles.svcMeta}>{selectedService.duration} min · ₹{selectedService.price.toLocaleString()}</span>
              </div>
              <button className={styles.clearSvc} onClick={onClearService}>
                <FiX size={14} />
              </button>
            </div>
          ) : (
            <div className={styles.noService}>
              Select a service from the list below ↓
            </div>
          )}
        </div>

        {/* Mini calendar */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <FiCalendar size={13} /> Select Date
          </label>
          <div className={styles.calendar}>
            <div className={styles.calNav}>
              <button className={styles.calNavBtn} onClick={prevMonth}><FiChevronLeft size={16} /></button>
              <span className={styles.calMonthLabel}>{MONTH_NAMES[calMonth]} {calYear}</span>
              <button className={styles.calNavBtn} onClick={nextMonth}><FiChevronRight size={16} /></button>
            </div>
            <div className={styles.calGrid}>
              {DAY_NAMES.map(d => (
                <div key={d} className={styles.calDayName}>{d}</div>
              ))}
              {calDays.map((day, i) => {
                const past = isPastDay(day)
                const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
                const isSel = day === selDay
                return (
                  <button
                    key={i}
                    className={`
                      ${styles.calDay}
                      ${!day ? styles.calEmpty : ''}
                      ${past ? styles.calPast : ''}
                      ${isToday && !isSel ? styles.calToday : ''}
                      ${isSel ? styles.calSelected : ''}
                    `}
                    onClick={() => day && !past && setSelDay(day)}
                    disabled={!day || past}
                  >
                    {day || ''}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Time slots */}
        {selDay && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              <FiClock size={13} /> Time Slot
              <span className={styles.fieldSub}>{selDay} {MONTH_NAMES[calMonth]}</span>
            </label>
            <div className={styles.slotsGrid}>
              {TIME_SLOTS.map(slot => {
                const unavail = UNAVAILABLE.has(slot)
                const isSel = selSlot === slot
                return (
                  <button
                    key={slot}
                    className={`${styles.slot} ${unavail ? styles.slotUnavail : ''} ${isSel ? styles.slotSel : ''}`}
                    onClick={() => !unavail && setSelSlot(slot)}
                    disabled={unavail}
                    title={unavail ? 'Booked' : ''}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Staff preference */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <FiUser size={13} /> Staff Preference
            <span className={styles.fieldSub}>Optional</span>
          </label>
          <div className={styles.staffRow}>
            <button
              className={`${styles.staffChip} ${!selStaff ? styles.staffActive : ''}`}
              onClick={() => setSelStaff(null)}
            >
              Any Available
            </button>
            {salon.staff.filter(s => s.available).map(s => (
              <button
                key={s.id}
                className={`${styles.staffChip} ${selStaff?.id === s.id ? styles.staffActive : ''}`}
                onClick={() => setSelStaff(s)}
              >
                {s.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {selectedService && selDay && selSlot && (
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>{selectedService.name}</span>
              <span>₹{selectedService.price.toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow} style={{ color: 'var(--smoke)', fontSize: 13 }}>
              <span>{selDay} {MONTH_NAMES[calMonth]} · {selSlot}</span>
              <span>{selectedService.duration} min</span>
            </div>
            {selStaff && (
              <div className={styles.summaryRow} style={{ color: 'var(--smoke)', fontSize: 13 }}>
                <span>With {selStaff.name}</span>
              </div>
            )}
            <div className={styles.summaryDivider} />
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span>₹{bookingTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          className={`${styles.bookBtn} ${(!selectedService || !selDay || !selSlot) ? styles.bookDisabled : ''}`}
          onClick={handleBook}
        >
          {!isAuthenticated
            ? '🔐 Sign In to Book'
            : selectedService && selDay && selSlot
              ? `Confirm Booking · ₹${bookingTotal.toLocaleString()}`
              : 'Select Service & Time'}
        </button>

        {/* Walk-in option */}
        <div className={styles.walkinRow}>
          <span className={styles.walkinOr}>or</span>
          <button className={styles.walkinBtn}>
            📲 Scan QR for Walk-In Queue
          </button>
        </div>
      </div>
    </div>
  )
}