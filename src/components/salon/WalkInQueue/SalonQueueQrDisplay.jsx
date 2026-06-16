import { useEffect, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useDispatch } from 'react-redux'
import { FiMapPin, FiPhone, FiTag } from 'react-icons/fi'
import { showNotification } from '@/store/slices/uiSlice'
import salonService from '@/services/salonService'
import { APP_URL } from '@/constants/config'
import styles from './SalonQueueQrDisplay.module.css'

export default function SalonQueueQrDisplay({
  salonId,
  salon,
  variant = 'owner',
  showActions = true,
}) {
  const dispatch = useDispatch()
  const qrRef = useRef(null)
  const [qrData, setQrData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isActive = salon?.status === 'active' || qrData?.salon?.status === 'active'

  useEffect(() => {
    if (!salonId) return undefined

    let ignore = false
    setLoading(true)
    setError(null)

    salonService.getQRCode(salonId)
      .then((data) => {
        if (ignore) return
        setQrData(data)
      })
      .catch((err) => {
        if (ignore) return
        const message = err?.message || 'Could not load QR code'
        setError(message)
        if (salon?.status === 'active') {
          setQrData({
            qrUrl: `${APP_URL}/salons/${salonId}?queue=join`,
            salon: salon,
          })
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => { ignore = true }
  }, [salonId, salon?.status])

  const shop = qrData?.salon || salon
  const qrUrl = qrData?.qrUrl || ''

  const handleCopyLink = async () => {
    if (!qrUrl) return
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
      const safeName = (shop?.name || 'salon').replace(/[^\w]+/g, '-').toLowerCase()
      link.download = `${safeName}-walkin-qr.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
  }

  if (salon?.status && salon.status !== 'active') {
    return (
      <div className={`${styles.card} ${styles[variant]}`}>
        <div className={styles.inactiveBox}>
          <div className={styles.inactiveTitle}>QR not available yet</div>
          <p className={styles.inactiveText}>
            Walk-in QR codes are generated when your salon is approved and activated by SalonBazar admin.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.header}>
        <span className={styles.icon}>📲</span>
        <div>
          <div className={styles.title}>
            {variant === 'customer' ? 'Scan to Join Queue' : 'Walk-In QR Code'}
          </div>
          <div className={styles.sub}>
            {variant === 'customer'
              ? 'Scan at the salon reception to join the live walk-in queue.'
              : 'Print or display at reception. Customers scan to join your live queue.'}
          </div>
        </div>
      </div>

      {shop && (
        <div className={styles.shopDetails}>
          <div className={styles.shopName}>{shop.name}</div>
          {shop.category && (
            <div className={styles.shopMeta}>
              <FiTag size={12} />
              <span>{shop.category}</span>
            </div>
          )}
          {(shop.location || shop.city) && (
            <div className={styles.shopMeta}>
              <FiMapPin size={12} />
              <span>{[shop.location, shop.city].filter(Boolean).join(' · ')}</span>
            </div>
          )}
          {shop.phone && (
            <div className={styles.shopMeta}>
              <FiPhone size={12} />
              <span>{shop.phone}</span>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading QR code…</div>
      ) : error && !qrUrl ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <div className={styles.qrWrap} ref={qrRef}>
            <QRCodeSVG
              value={qrUrl}
              size={variant === 'compact' ? 160 : 200}
              level="M"
              includeMargin
              aria-label={`Walk-in queue QR for ${shop?.name || 'salon'}`}
            />
          </div>
          {qrData?.generatedAt && (
            <div className={styles.generatedAt}>
              Generated {new Date(qrData.generatedAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </div>
          )}
          <div className={styles.qrUrl}>{qrUrl}</div>
          {showActions && (
            <div className={styles.actions}>
              <button type="button" className={styles.actionBtn} onClick={handleCopyLink}>
                Copy Link
              </button>
              <button type="button" className={styles.actionBtn} onClick={handleDownload}>
                Download PNG
              </button>
            </div>
          )}
        </>
      )}

      {variant === 'owner' && (
        <div className={styles.tips}>
          <div className={styles.tip}><span>1.</span> Place the QR near your reception desk</div>
          <div className={styles.tip}><span>2.</span> Customer scans → picks a service → joins queue</div>
          <div className={styles.tip}><span>3.</span> Manage arrivals from Live Queue</div>
        </div>
      )}
    </div>
  )
}
