import { useNavigate } from 'react-router-dom'
import { useSalonQueueScan } from '@/hooks/useSalonQueueScan'
import { QrScannerPanel } from '@/components/salon/WalkInQueue/QrScannerModal'
import styles from './ScanQueuePage.module.css'

export default function ScanQueuePage() {
  const navigate = useNavigate()
  const { handleScan } = useSalonQueueScan()

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <QrScannerPanel
          embedded
          onScan={handleScan}
          onClose={() => navigate(-1)}
          showClose
        />
      </div>
    </div>
  )
}
