import { useEffect, useId, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { FiX } from 'react-icons/fi'
import styles from './QrScannerModal.module.css'

export default function QrScannerModal({ open, onClose, onScan }) {
  const readerId = useId().replace(/:/g, '')
  const scannerRef = useRef(null)
  const onScanRef = useRef(onScan)
  const [error, setError] = useState(null)

  onScanRef.current = onScan

  useEffect(() => {
    if (!open) return undefined

    let active = true
    const scanner = new Html5Qrcode(readerId)
    scannerRef.current = scanner
    setError(null)

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 260, height: 260 }, aspectRatio: 1 },
      (decodedText) => {
        if (!active) return
        active = false
        scanner.stop().catch(() => {})
        onScanRef.current(decodedText)
      },
      () => {}
    ).catch((err) => {
      if (!active) return
      setError(err?.message || 'Could not access camera')
    })

    return () => {
      active = false
      scanner.stop().catch(() => {})
      scanner.clear().catch(() => {})
      scannerRef.current = null
    }
  }, [open, readerId])

  if (!open) return null

  return (
    <div className={styles.scannerBackdrop} role="dialog" aria-modal="true" aria-label="Scan salon QR code">
      <div className={styles.scannerHeader}>
        <span className={styles.scannerTitle}>Scan Salon QR</span>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close scanner">
          <FiX size={20} />
        </button>
      </div>

      <p className={styles.hint}>Point your camera at the walk-in QR code displayed at the salon reception.</p>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.readerWrap}>
        <div id={readerId} className={styles.reader} />
      </div>
    </div>
  )
}
