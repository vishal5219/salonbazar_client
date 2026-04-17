import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FiCheck, FiX, FiPhone, FiFilter } from 'react-icons/fi'
import { updateBookingStatus } from '@/store/slices/dashboardSlice'
import styles from './DashBookings.module.css'

const FILTERS = ['All', 'Today', 'Tomorrow', 'Confirmed', 'Pending', 'Cancelled']

export default function DashBookings() {
  const dispatch  = useDispatch()
  const { bookings } = useSelector(s => s.dashboard)
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = bookings.filter(b => {
    if (activeFilter === 'All')       return true
    if (activeFilter === 'Today')     return b.date === 'Today'
    if (activeFilter === 'Tomorrow')  return b.date === 'Tomorrow'
    return b.status === activeFilter.toLowerCase()
  })

  const handleStatus = (id, status) => dispatch(updateBookingStatus({ bookingId: id, status }))

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Appointments</h1>
          <p className={styles.pageSub}>{bookings.length} total · {bookings.filter(b=>b.status==='pending').length} pending action</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className={styles.filters}>
        <FiFilter size={14} className={styles.filterIcon} />
        {FILTERS.map(f => (
          <button
            key={f}
            className={`${styles.filterTab} ${activeFilter === f ? styles.filterActive : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
            {f === 'Pending' && bookings.filter(b=>b.status==='pending').length > 0 && (
              <span className={styles.filterBadge}>{bookings.filter(b=>b.status==='pending').length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings table */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHeader}>
          <span>Customer & Service</span>
          <span>Date & Time</span>
          <span>Amount</span>
          <span>Type</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>No appointments match this filter.</div>
        ) : (
          filtered.map((b, i) => (
            <div key={b.id} className={styles.tableRow} style={{ animationDelay: `${i * 0.04}s` }}>
              <div className={styles.customerCell}>
                <div className={styles.avatar}>{b.customerName[0]}</div>
                <div>
                  <div className={styles.customerName}>{b.customerName}</div>
                  <div className={styles.serviceName}>{b.service}</div>
                  {b.phone && (
                    <a href={`tel:${b.phone}`} className={styles.phoneLink}>
                      <FiPhone size={11}/> {b.phone}
                    </a>
                  )}
                </div>
              </div>

              <div className={styles.timeCell}>
                <div className={styles.dateVal}>{b.date}</div>
                <div className={styles.timeVal}>{b.time}</div>
              </div>

              <div className={styles.amountCell}>
                ₹{b.amount.toLocaleString()}
              </div>

              <div className={styles.typeCell}>
                <span className={styles.typeBadge} data-type={b.bookingType}>
                  {b.bookingType}
                </span>
              </div>

              <div className={styles.statusCell}>
                <span className={`${styles.statusBadge} ${styles[`s_${b.status}`]}`}>
                  {b.status}
                </span>
              </div>

              <div className={styles.actionsCell}>
                {b.status === 'pending' && (
                  <>
                    <button
                      className={`${styles.actionBtn} ${styles.acceptBtn}`}
                      onClick={() => handleStatus(b.id, 'confirmed')}
                      title="Confirm"
                    >
                      <FiCheck size={14} />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.rejectBtn}`}
                      onClick={() => handleStatus(b.id, 'cancelled')}
                      title="Cancel"
                    >
                      <FiX size={14} />
                    </button>
                  </>
                )}
                {b.status === 'confirmed' && (
                  <button
                    className={`${styles.actionBtn} ${styles.cancelBtn}`}
                    onClick={() => handleStatus(b.id, 'cancelled')}
                    title="Cancel booking"
                  >
                    <FiX size={14} />
                  </button>
                )}
                {b.status === 'cancelled' && (
                  <span className={styles.cancelledLabel}>Cancelled</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}