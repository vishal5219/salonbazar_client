import { useDispatch, useSelector } from 'react-redux'
import { requestUserLocation, setLocationPrompted } from '@/store/slices/locationSlice'
import styles from './LocationPromptBanner.module.css'

export default function LocationPromptBanner({ onLocated }) {
  const dispatch = useDispatch()
  const { status, error, prompted, supported } = useSelector(s => s.location)

  if (!supported) return null
  if (status === 'granted' || status === 'requesting') return null
  if (prompted && status === 'denied') {
    return (
      <div className={`${styles.banner} ${styles.bannerDenied}`}>
        <div>
          <p className={styles.text}>Location access is off. Showing all salons — enable location for nearby results.</p>
          {error && <p className={styles.sub}>{error}</p>}
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.allowBtn}
            onClick={() => dispatch(requestUserLocation()).then(() => onLocated?.())}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (prompted) return null

  const handleAllow = async () => {
    dispatch(setLocationPrompted())
    const result = await dispatch(requestUserLocation())
    if (requestUserLocation.fulfilled.match(result)) {
      onLocated?.()
    }
  }

  const handleDismiss = () => {
    dispatch(setLocationPrompted())
    onLocated?.()
  }

  return (
    <div className={styles.banner}>
      <div>
        <p className={styles.text}>Find salons near you</p>
        <p className={styles.sub}>Allow location access to sort salons by distance from where you are.</p>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.dismissBtn} onClick={handleDismiss}>
          Not now
        </button>
        <button type="button" className={styles.allowBtn} onClick={handleAllow}>
          Allow
        </button>
      </div>
    </div>
  )
}
