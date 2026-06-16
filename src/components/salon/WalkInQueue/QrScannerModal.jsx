import { useEffect, useId, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { FiX } from 'react-icons/fi'
import {
  getCameraErrorMessage,
  isSecureCameraContext,
  QR_CAMERA_CONFIGS,
  requestCameraPermission,
} from '@/utils/cameraAccess'
import styles from './QrScannerModal.module.css'

const SCANNER_CONFIG = {
  fps: 10,
  qrbox: (viewfinderWidth, viewfinderHeight) => {
    const size = Math.min(viewfinderWidth, viewfinderHeight, 280) * 0.75
    return { width: size, height: size }
  },
  aspectRatio: 1,
}

async function startScannerWithFallback(scanner, onDecoded) {
  let lastError = null

  for (const cameraConfig of QR_CAMERA_CONFIGS) {
    try {
      await scanner.start(
        cameraConfig,
        SCANNER_CONFIG,
        onDecoded,
        () => {}
      )
      return
    } catch (err) {
      lastError = err
      try {
        await scanner.stop()
      } catch {
        // scanner may not have started
      }
    }
  }

  throw lastError || new Error('Could not start camera')
}

export default function QrScannerModal({ open, onClose, onScan }) {
  const readerId = useId().replace(/:/g, '')
  const scannerRef = useRef(null)
  const onScanRef = useRef(onScan)
  const [error, setError] = useState(null)
  const [starting, setStarting] = useState(false)

  onScanRef.current = onScan

  useEffect(() => {
    if (!open) return undefined

    let active = true
    const scanner = new Html5Qrcode(readerId)
    scannerRef.current = scanner

    const start = async () => {
      setError(null)
      setStarting(true)

      if (!isSecureCameraContext()) {
        if (active) {
          setError(getCameraErrorMessage({ name: 'SecurityError' }))
          setStarting(false)
        }
        return
      }

      try {
        await requestCameraPermission({ video: { facingMode: 'environment' } })
      } catch (permErr) {
        // Try anyway — some browsers succeed in html5-qrcode after a failed probe
        if (permErr?.name === 'NotAllowedError' && active) {
          setError(getCameraErrorMessage(permErr))
          setStarting(false)
          return
        }
      }

      if (!active) return

      try {
        await startScannerWithFallback(scanner, (decodedText) => {
          if (!active) return
          active = false
          scanner.stop().catch(() => {})
          onScanRef.current(decodedText)
        })
        if (active) setStarting(false)
      } catch (err) {
        if (!active) return
        setError(getCameraErrorMessage(err))
        setStarting(false)
      }
    }

    start()

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

      <p className={styles.hint}>
        Point your camera at the walk-in QR code at the salon. Allow camera access when your browser asks.
      </p>

      {starting && !error && (
        <p className={styles.status}>Starting camera…</p>
      )}

      {error && (
        <div className={styles.errorBox}>
          <p className={styles.error}>{error}</p>
          <p className={styles.errorHelp}>
            Yes — phone cameras work in web apps over HTTPS. Use the live site (https://) or localhost, not a plain http:// IP address.
          </p>
        </div>
      )}

      <div className={styles.readerWrap}>
        <div id={readerId} className={styles.reader} />
      </div>
    </div>
  )
}
