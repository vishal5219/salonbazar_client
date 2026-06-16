/**
 * QR scan is available on all devices — camera and/or image upload.
 */
export function useQrScannerAvailability() {
  const openScanner = (onOpen) => {
    onOpen()
    return true
  }

  return {
    scannerAvailable: true,
    scannerChecked: true,
    confirmAndRun: openScanner,
  }
}
