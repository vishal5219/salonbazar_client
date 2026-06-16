import { useEffect, useState } from 'react'
import { canShowQrScanner } from '@/utils/deviceDetection'

export function useQrScannerAvailability() {
  const [available, setAvailable] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let ignore = false
    canShowQrScanner().then((ok) => {
      if (!ignore) {
        setAvailable(ok)
        setChecked(true)
      }
    })
    return () => { ignore = true }
  }, [])

  const confirmAndRun = (onConfirm) => {
    if (!available) return false
    const ok = window.confirm(
      'SalonBazar needs camera access to scan the salon walk-in QR code. Continue?'
    )
    if (ok) onConfirm()
    return ok
  }

  return { scannerAvailable: available, scannerChecked: checked, confirmAndRun }
}
