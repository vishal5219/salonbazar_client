/**
 * Camera access helpers for in-browser QR scanning (getUserMedia).
 * Requires a secure context: https:// or http://localhost
 */

export function isSecureCameraContext() {
  return typeof window !== 'undefined' && window.isSecureContext === true
}

export function isCameraApiSupported() {
  return Boolean(
    typeof navigator !== 'undefined'
    && navigator.mediaDevices
    && typeof navigator.mediaDevices.getUserMedia === 'function'
  )
}

/**
 * Friendly message when camera cannot be used.
 */
export function getCameraErrorMessage(error, context = {}) {
  const secure = context.secureContext ?? isSecureCameraContext()

  if (!secure) {
    return 'Camera needs a secure connection. Use https://salonbazar.shop or http://localhost — not http://192.168.x.x on your phone.'
  }

  if (!isCameraApiSupported()) {
    return 'This browser does not support camera access. Try Chrome or Safari on your phone.'
  }

  const name = error?.name || ''
  const message = String(error?.message || '')

  if (name === 'NotAllowedError' || /permission/i.test(message)) {
    return 'Camera permission denied. Tap Allow when prompted, or enable Camera for this site in browser settings.'
  }

  if (name === 'NotFoundError' || /not found/i.test(message)) {
    return 'No camera found on this device.'
  }

  if (name === 'NotReadableError' || /in use/i.test(message)) {
    return 'Camera is in use by another app. Close other camera apps and try again.'
  }

  if (name === 'OverconstrainedError') {
    return 'Could not use the rear camera. Retrying with another camera…'
  }

  if (/permissions policy/i.test(message)) {
    return 'Camera is blocked by site policy. Redeploy with updated Permissions-Policy headers.'
  }

  return message || 'Could not access camera. Check permissions and try again.'
}

/**
 * Probe camera permission with a short-lived stream (improves mobile error messages).
 */
export async function requestCameraPermission(constraints = { video: { facingMode: 'environment' } }) {
  if (!isSecureCameraContext()) {
    throw Object.assign(new Error('INSECURE_CONTEXT'), { name: 'SecurityError' })
  }
  if (!isCameraApiSupported()) {
    throw Object.assign(new Error('NOT_SUPPORTED'), { name: 'NotSupportedError' })
  }

  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  stream.getTracks().forEach(track => track.stop())
  return true
}

/** Camera configs to try — rear camera first, then any camera. */
export const QR_CAMERA_CONFIGS = [
  { facingMode: 'environment' },
  { facingMode: 'user' },
  { video: true },
]
