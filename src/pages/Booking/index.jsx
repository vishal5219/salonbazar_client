// pages/Booking/index.jsx
// 4-step booking flow:
//   Step 1 → Service Selection
//   Step 2 → Date & Time
//   Step 3 → Payment
//   Step 4 → Confirmation
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBookingFlow, resetBooking } from '@/store/slices/bookingSlice'
import { MOCK_SALON_DETAIL } from '@/constants/mockSalonDetail'

import BookingProgress  from '@/components/booking/BookingProgress'
import BookingSummary   from '@/components/booking/BookingSummary'
import Step1Service     from '@/components/booking/steps/Step1Service'
import Step2DateTime    from '@/components/booking/steps/Step2DateTime'
import Step3Payment     from '@/components/booking/steps/Step3Payment'
import Step4Confirm     from '@/components/booking/steps/Step4Confirm'

import styles from './Booking.module.css'

const STEPS = [
  { num: 1, label: 'Service'     },
  { num: 2, label: 'Date & Time' },
  { num: 3, label: 'Payment'     },
  { num: 4, label: 'Confirmed'   },
]

export default function Booking() {
  const { salonId } = useParams()
  const dispatch    = useDispatch()
  const navigate    = useNavigate()

  const { step, currentBooking } = useSelector(s => s.booking)
  const { isAuthenticated }      = useSelector(s => s.auth)

  // Guard: must be logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/salons/${salonId}?auth=login`)
    }
  }, [isAuthenticated, salonId, navigate])

  // Seed salon context and resume at the correct step (mock — replace with API call)
  useEffect(() => {
    const salon = MOCK_SALON_DETAIL
    dispatch(initializeBookingFlow({
      salonId:    salon.id,
      salonName:  salon.name,
      salonImage: salon.gallery[0]?.url || '',
    }))
  }, [salonId, dispatch])

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Service />
      case 2: return <Step2DateTime />
      case 3: return <Step3Payment />
      case 4: return <Step4Confirm booking={currentBooking} salonId={salonId} />
      default: return null
    }
  }

  // Step 4 is full-page — no sidebar
  if (step === 4) {
    return (
      <div className={styles.page}>
        <div className={styles.confirmWrap}>
          {renderStep()}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Progress header */}
      <div className={styles.progressBar}>
        <div className={styles.progressInner}>
          <button
            className={styles.backLink}
            onClick={() => {
              dispatch(resetBooking())
              navigate(`/salons/${salonId}`)
            }}
          >
            ← Back to Salon
          </button>
          <BookingProgress steps={STEPS} currentStep={step} />
        </div>
      </div>

      {/* Body: form + summary sidebar */}
      <div className={styles.body}>
        {/* Step content */}
        <div className={styles.stepArea}>
          <div className={styles.stepContent}>
            {renderStep()}
          </div>
        </div>

        {/* Sticky summary sidebar */}
        <aside className={styles.sidebar}>
          <BookingSummary />
        </aside>
      </div>
    </div>
  )
}