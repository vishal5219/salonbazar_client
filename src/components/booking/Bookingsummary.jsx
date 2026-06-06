import { useSelector } from 'react-redux'
import { FiCalendar, FiClock, FiUser, FiTag } from 'react-icons/fi'
import { MOCK_SALON_DETAIL } from '@/constants/mockSalonDetail'
import styles from './BookingSummary.module.css'

export default function BookingSummary() {
  const {
    salonName, salonImage,
    selectedService, selectedStaff,
    selectedDate, selectedSlot,
    couponDiscount, paymentMethod,
  } = useSelector(s => s.booking)

  const salon = MOCK_SALON_DETAIL

  const subtotal = selectedService?.price || 0
  const discount = couponDiscount || 0
  const platformFee = subtotal > 0 ? 19 : 0
  const total = Math.max(0, subtotal - discount + platformFee)

  const hasDetails = selectedService || selectedDate || selectedSlot

  return (
    <div className={styles.card}>
      {/* Salon header */}
      <div className={styles.salonRow}>
        <div className={styles.salonImg}>
          {salonImage
            ? <img src={salonImage} alt={salonName} />
            : <span>✦</span>
          }
        </div>
        <div>
          <div className={styles.salonName}>{salonName || 'Salon'}</div>
          <div className={styles.salonSub}>{salon.location?.split(',')[0]}</div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Booking details */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Booking Details</div>

        {selectedService ? (
          <div className={styles.detailRow}>
            <div className={styles.detailIcon}><FiTag size={14} /></div>
            <div>
              <div className={styles.detailLabel}>Service</div>
              <div className={styles.detailValue}>{selectedService.name}</div>
              <div className={styles.detailSub}>{selectedService.duration} min · {selectedService.category || ''}</div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyHint}>No service selected yet</div>
        )}

        {(selectedDate || selectedSlot) && (
          <div className={styles.detailRow}>
            <div className={styles.detailIcon}><FiCalendar size={14} /></div>
            <div>
              <div className={styles.detailLabel}>Date</div>
              <div className={styles.detailValue}>
                {selectedDate
                  ? `${selectedDate.day} ${selectedDate.monthName} ${selectedDate.year}`
                  : '—'}
              </div>
            </div>
          </div>
        )}

        {selectedSlot && (
          <div className={styles.detailRow}>
            <div className={styles.detailIcon}><FiClock size={14} /></div>
            <div>
              <div className={styles.detailLabel}>Time</div>
              <div className={styles.detailValue}> {typeof selectedSlot === 'string' ? selectedSlot : selectedSlot?.time || '—'}</div>
            </div>
          </div>
        )}

        {selectedStaff && (
          <div className={styles.detailRow}>
            <div className={styles.detailIcon}><FiUser size={14} /></div>
            <div>
              <div className={styles.detailLabel}>Stylist</div>
              <div className={styles.detailValue}>{selectedStaff.name}</div>
              <div className={styles.detailSub}>{selectedStaff.role}</div>
            </div>
          </div>
        )}
      </div>

      {/* Price breakdown */}
      {selectedService && (
        <>
          <div className={styles.divider} />
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Price Breakdown</div>

            <div className={styles.priceRow}>
              <span>{selectedService.name}</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            {discount > 0 && (
              <div className={`${styles.priceRow} ${styles.discountRow}`}>
                <span>Coupon Discount</span>
                <span>−₹{discount}</span>
              </div>
            )}

            <div className={`${styles.priceRow} ${styles.feeRow}`}>
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>

            <div className={styles.totalDivider} />

            <div className={`${styles.priceRow} ${styles.totalRow}`}>
              <span>Total Payable</span>
              <span className={styles.totalAmt}>₹{total.toLocaleString()}</span>
            </div>

            {paymentMethod === 'counter' && (
              <div className={styles.payAtCounter}>
                💳 Pay at the salon counter
              </div>
            )}
          </div>
        </>
      )}

      {/* Cancellation note */}
      <div className={styles.cancelNote}>
        <span className={styles.cancelIcon}>ℹ</span>
        Free cancellation up to 2 hours before your appointment.
      </div>
    </div>
  )
}