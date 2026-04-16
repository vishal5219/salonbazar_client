import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiChevronUp, FiChevronDown, FiX } from 'react-icons/fi'
import { openAuthModal } from '@/store/slices/uiSlice'
import { setSelectedService, setSelectedSlot } from '@/store/slices/bookingSlice'
import styles from './MobileBookingBar.module.css'

const TIME_SLOTS  = ['10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM','07:00 PM']
const UNAVAILABLE = new Set(['11:00 AM', '03:00 PM'])

export default function MobileBookingBar({ salon, selectedService, id }) {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const { isAuthenticated } = useSelector(s => s.auth)

  const [open,    setOpen]    = useState(false)
  const [selSlot, setSelSlot] = useState(null)

  const handleBook = () => {
    if (!isAuthenticated) { dispatch(openAuthModal('login')); return }
    if (!selectedService || !selSlot) return
    dispatch(setSelectedService(selectedService))
    dispatch(setSelectedSlot({ time: selSlot }))
    navigate(`/booking/${salon.id}`)
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)} />
      )}

      {/* Sheet */}
      <div className={`${styles.sheet} ${open ? styles.sheetOpen : ''}`} id={id}>
        {/* Handle / collapsed bar */}
        <div className={styles.bar} onClick={() => setOpen(v => !v)}>
          <div className={styles.barLeft}>
            {selectedService ? (
              <>
                <span className={styles.barService}>{selectedService.name}</span>
                <span className={styles.barPrice}>₹{selectedService.price.toLocaleString()}</span>
              </>
            ) : (
              <span className={styles.barPlaceholder}>Select a service above to book</span>
            )}
          </div>
          <div className={styles.barRight}>
            <button
              className={`${styles.bookBtn} ${(!selectedService) ? styles.bookBtnDisabled : ''}`}
              onClick={e => { e.stopPropagation(); if (selectedService) setOpen(v => !v) }}
            >
              Book Now
            </button>
            <span className={styles.chevron}>
              {open ? <FiChevronDown size={16}/> : <FiChevronUp size={16}/>}
            </span>
          </div>
        </div>

        {/* Expanded panel */}
        <div className={styles.expanded}>
          <div className={styles.expandedHeader}>
            <h4 className={styles.expandedTitle}>Choose a Time</h4>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>
              <FiX size={18} />
            </button>
          </div>

          {selectedService && (
            <div className={styles.serviceSummary}>
              <span>{selectedService.name}</span>
              <span className={styles.summaryPrice}>₹{selectedService.price.toLocaleString()} · {selectedService.duration} min</span>
            </div>
          )}

          <div className={styles.slotsLabel}>Available Today</div>
          <div className={styles.slotsGrid}>
            {TIME_SLOTS.map(slot => {
              const unavail = UNAVAILABLE.has(slot)
              const isSel   = selSlot === slot
              return (
                <button
                  key={slot}
                  className={`${styles.slot} ${unavail ? styles.slotUnavail : ''} ${isSel ? styles.slotSel : ''}`}
                  onClick={() => !unavail && setSelSlot(slot)}
                  disabled={unavail}
                >
                  {slot}
                </button>
              )
            })}
          </div>

          <button
            className={`${styles.confirmBtn} ${(!selectedService || !selSlot) ? styles.confirmDisabled : ''}`}
            onClick={handleBook}
          >
            {!isAuthenticated
              ? '🔐 Sign In to Book'
              : selSlot
              ? `Confirm · ₹${selectedService?.price?.toLocaleString() || '—'}`
              : 'Select a Time Slot'}
          </button>

          {/* Walk-in option */}
          <button className={styles.walkinBtn}>
            📲 Join Walk-In Queue via QR
          </button>
        </div>
      </div>
    </>
  )
}
