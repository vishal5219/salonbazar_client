import { useEffect, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useDispatch } from 'react-redux'
import { showNotification } from '@/store/slices/uiSlice'
import salonService from '@/services/salonService'
import { APP_URL } from '@/constants/config'
import styles from './SalonQrCard.module.css'

export default function SalonQrCard({ salonId, salonName }) {
  const dispatch = useDispatch()
  const qrRef = useRef(null)
  const [qrUrl, setQrUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!salonId) return

    let ignore = false
    setLoading(true)

    salonService.getQRCode(salonId)
      .then((data) => {
        if (ignore) return
        setQrUrl(data?.qrUrl || `${APP_URL}/salons/${salonId}?queue=join`)
      })
      .catch(() => {
        if (ignore) return
        setQrUrl(`${APP_URL}/salons/${salonId}?queue=join`)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => { ignore = true }
  }, [salonId])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl)
      dispatch(showNotification({ message: 'Queue link copied', type: 'success' }))
    } catch {
      dispatch(showNotification({ message: 'Could not copy link', type: 'error' }))
    }
  }

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg || !qrUrl) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const size = 512
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      const link = document.createElement('a')
      link.download = `salon-${salonId}-walkin-qr.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
  }

  return (
    <div className={styles.qrCard}>
      <div className={styles.qrHeader}>
        <span className={styles.qrIcon}>📲</span>
        <div>
          <div className={styles.qrTitle}>Walk-In QR Code</div>
          <div className={styles.qrSub}>
            Print or display this at reception. Customers scan to join the live queue for {salonName || 'your salon'}.
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading QR code…</div>
      ) : (
        <>
          <div className={styles.qrWrap} ref={qrRef}>
            <QRCodeSVG
              value={qrUrl}
              size={200}
              level="M"
              includeMargin
              aria-label="Walk-in queue QR code"
            />
          </div>
          <div className={styles.qrUrl}>{qrUrl}</div>
          <div className={styles.actions}>
            <button type="button" className={styles.actionBtn} onClick={handleCopyLink}>
              Copy Link
            </button>
            <button type="button" className={styles.actionBtn} onClick={handleDownload}>
              Download PNG
            </button>
          </div>
        </>
      )}

      <div className={styles.tips}>
        <div className={styles.tip}><span>1.</span> Place the QR near your reception desk</div>
        <div className={styles.tip}><span>2.</span> Customer scans → picks a service → joins queue</div>
        <div className={styles.tip}><span>3.</span> Manage arrivals from Live Queue</div>
      </div>
    </div>
  )
}
