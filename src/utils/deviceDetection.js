import { isSecureCameraContext, isCameraApiSupported } from '@/utils/cameraAccess'

/**
 * Phone / tablet detection — excludes typical laptop/desktop setups.
 */
export function isPhoneOrTablet() {
  if (typeof window === 'undefined') return false

  const ua = navigator.userAgent || ''
  const mobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua)
  if (mobileUa) return true

  const isIpadDesktopUa = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1
  if (isIpadDesktopUa) return true

  const hasTouch = navigator.maxTouchPoints > 0
  const narrowViewport = window.matchMedia('(max-width: 1024px)').matches
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches

  return hasTouch && narrowViewport && coarsePointer
}

export async function hasCameraDevice() {
  if (!isCameraApiSupported()) return false

  // Many phones hide camera labels until permission is granted — on mobile + HTTPS, assume available
  if (isPhoneOrTablet() && isSecureCameraContext()) {
    return true
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices.some(device => device.kind === 'videoinput')
  } catch {
    return isSecureCameraContext()
  }
}

/**
 * Scanner is offered only on phone/tablet with a camera available.
 */
export async function canShowQrScanner() {
  if (!isPhoneOrTablet()) return false
  if (!isSecureCameraContext()) return false
  return hasCameraDevice()
}
