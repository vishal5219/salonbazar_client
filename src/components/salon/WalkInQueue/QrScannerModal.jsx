import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Html5Qrcode } from 'html5-qrcode'
import { FiUpload, FiCamera, FiX, FiImage } from 'react-icons/fi'
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
    const size = Math.min(viewfinderWidth, viewfinderHeight, 260) * 0.78
    return { width: size, height: size }
  },
  aspectRatio: 1,
}

async function startScannerWithFallback(scanner, onDecoded) {
  let lastError = null

  for (const cameraConfig of QR_CAMERA_CONFIGS) {
    try {
      await scanner.start(cameraConfig, SCANNER_CONFIG, onDecoded, () => {})
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

function QrScannerPanel({ onScan, onClose, showClose = true, embedded = false }) {
  const readerId = useId().replace(/:/g, '')
  const fileProbeId = `${readerId}-file-probe`
  const fileInputRef = useRef(null)
  const scannerRef = useRef(null)
  const onScanRef = useRef(onScan)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraLoading, setCameraLoading] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [fileScanning, setFileScanning] = useState(false)
  const [fileError, setFileError] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  onScanRef.current = onScan

  const stopCamera = async () => {
    const scanner = scannerRef.current
    if (!scanner) return
    try {
      await scanner.stop()
    } catch {
      // ignore
    }
    try {
      await scanner.clear()
    } catch {
      // ignore
    }
    scannerRef.current = null
    setCameraActive(false)
  }

  const handleDecoded = (decodedText) => {
    stopCamera()
    onScanRef.current(decodedText)
  }

  const startCamera = async () => {
    setCameraError(null)
    setFileError(null)
    setCameraLoading(true)

    if (!isSecureCameraContext()) {
      setCameraError(getCameraErrorMessage({ name: 'SecurityError' }))
      setCameraLoading(false)
      return
    }

    await stopCamera()

    const scanner = new Html5Qrcode(readerId)
    scannerRef.current = scanner

    try {
      try {
        await requestCameraPermission({ video: { facingMode: 'environment' } })
      } catch (permErr) {
        if (permErr?.name === 'NotAllowedError') {
          setCameraError(getCameraErrorMessage(permErr))
          setCameraLoading(false)
          await stopCamera()
          return
        }
      }

      await startScannerWithFallback(scanner, (decodedText) => {
        handleDecoded(decodedText)
      })
      setCameraActive(true)
    } catch (err) {
      setCameraError(getCameraErrorMessage(err))
      await stopCamera()
    } finally {
      setCameraLoading(false)
    }
  }

  const scanImageFile = async (file) => {
    if (!file) return

    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(file.name)
    if (!isImage) {
      setFileError('Please choose an image file (PNG, JPG, or WebP).')
      return
    }

    setFileError(null)
    setCameraError(null)
    setFileScanning(true)

    const fileScanner = new Html5Qrcode(fileProbeId)
    try {
      const decodedText = await fileScanner.scanFile(file, false)
      handleDecoded(decodedText)
    } catch {
      setFileError('No valid SalonBazar QR found in this image. Try a clearer photo or use the camera.')
    } finally {
      setFileScanning(false)
      try {
        await fileScanner.clear()
      } catch {
        // ignore
      }
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file) scanImageFile(file)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) scanImageFile(file)
  }

  useEffect(() => () => {
    stopCamera()
  }, [])

  return (
    <div className={`${styles.panel} ${embedded ? styles.panelEmbedded : ''}`}>
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>Scan Salon QR</h2>
          <p className={styles.panelSub}>Join the walk-in queue by scanning the salon QR code</p>
        </div>
        {showClose && onClose && (
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close scanner">
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* ── Camera section ── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <FiCamera size={16} />
          <span>Scan with camera</span>
        </div>

        {!cameraActive ? (
          <button
            type="button"
            className={styles.cameraStartBtn}
            onClick={startCamera}
            disabled={cameraLoading}
          >
            <FiCamera size={18} />
            {cameraLoading ? 'Starting camera…' : 'Open camera'}
          </button>
        ) : (
          <button type="button" className={styles.cameraStopBtn} onClick={stopCamera}>
            Stop camera
          </button>
        )}

        {cameraError && (
          <p className={styles.sectionError}>{cameraError}</p>
        )}

        <div className={styles.readerWrap}>
          <div id={readerId} className={styles.reader} />
          {!cameraActive && !cameraLoading && (
            <div className={styles.readerPlaceholder}>
              <FiCamera size={32} />
              <span>Camera preview appears here</span>
            </div>
          )}
        </div>
      </section>

      <div className={styles.divider}>
        <span>or</span>
      </div>

      {/* ── File upload section ── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <FiImage size={16} />
          <span>Upload QR image</span>
        </div>

        <div
          className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
        >
          <FiUpload size={26} className={styles.dropIcon} />
          <div className={styles.dropTitle}>
            {fileScanning ? 'Scanning image…' : 'Drag & drop QR image here'}
          </div>
          <div className={styles.dropSub}>or click to browse · PNG, JPG, WebP</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.png,.jpg,.jpeg,.webp"
            className={styles.hiddenInput}
            onChange={handleFileInput}
          />
        </div>

        {fileError && <p className={styles.sectionError}>{fileError}</p>}
      </section>

      <div
        id={fileProbeId}
        className={styles.fileProbe}
        aria-hidden="true"
      />
    </div>
  )
}

export default function QrScannerModal({ open, onClose, onScan }) {
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Scan salon QR code">
      <div className={styles.backdropClick} onClick={onClose} aria-hidden="true" />
      <QrScannerPanel onScan={onScan} onClose={onClose} />
    </div>,
    document.body
  )
}

export { QrScannerPanel }
