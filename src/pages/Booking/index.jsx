// pages/Booking/index.jsx
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBookingFlow, resetBooking } from '@/store/slices/bookingSlice'
import { fetchSalonById } from '@/store/slices/salonSlice'

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
  const { selectedSalon }        = useSelector(s => s.salons)

  useEffect(() => {
    if (salonId) dispatch(fetchSalonById(salonId))
  }, [salonId, dispatch])

  useEffect(() => {
    if (!selectedSalon) return
    dispatch(initializeBookingFlow({
      salonId:    selectedSalon.id,
      salonName:  selectedSalon.name,
      salonImage: selectedSalon.gallery?.[0]?.url || selectedSalon.image || '',
    }))
  }, [selectedSalon, dispatch])

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Service />
      case 2: return <Step2DateTime />
      case 3: return <Step3Payment />
      case 4: return <Step4Confirm booking={currentBooking} salonId={salonId} />
      default: return null
    }
  }

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

      <div className={styles.body}>
        <div className={styles.stepArea}>
          <div className={styles.stepContent}>
            {renderStep()}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <BookingSummary />
        </aside>
      </div>
    </div>
  )
}
