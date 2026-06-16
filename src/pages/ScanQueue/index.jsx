import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { showNotification } from '@/store/slices/uiSlice'
import { isPhoneOrTablet } from '@/utils/deviceDetection'
import { parseSalonQueueQr, buildSalonQueuePath } from '@/utils/parseSalonQueueQr'
import QrScannerModal from '@/components/salon/WalkInQueue/QrScannerModal'
import styles from './ScanQueuePage.module.css'

export default function ScanQueuePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isMobile = isPhoneOrTablet()

  useEffect(() => {
    if (!isMobile) {
      dispatch(showNotification({
        message: 'QR scanning is available on phones and tablets only',
        type: 'info',
      }))
      navigate('/salons', { replace: true })
    }
  }, [isMobile, navigate, dispatch])

  const handleScan = (text) => {
    const parsed = parseSalonQueueQr(text)
    if (!parsed?.salonId) {
      dispatch(showNotification({ message: 'Not a valid SalonBazar queue QR code', type: 'error' }))
      return
    }
    navigate(buildSalonQueuePath(parsed.salonId))
  }

  if (!isMobile) {
    return (
      <div className={styles.desktopMsg}>
        <p>QR scanning works on phones and tablets. Open SalonBazar on your mobile device to scan a salon walk-in QR code.</p>
      </div>
    )
  }

  return (
    <QrScannerModal
      open
      onClose={() => navigate(-1)}
      onScan={handleScan}
    />
  )
}
