import SalonQueueQrDisplay from './SalonQueueQrDisplay'
import styles from './SalonWalkInQrSection.module.css'

export default function SalonWalkInQrSection({ salon }) {
  if (!salon?.id || salon.status !== 'active') return null

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Walk-In Queue</h2>
      <p className={styles.sub}>
        At the salon? Scan this QR to join the live queue instantly.
      </p>
      <SalonQueueQrDisplay
        salonId={salon.id}
        salon={salon}
        variant="customer"
        showActions={false}
      />
    </div>
  )
}
