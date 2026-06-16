const STORAGE_KEY = 'salonbazar_pending_walkin'

export function setPendingWalkIn(salonId) {
  if (salonId != null) {
    sessionStorage.setItem(STORAGE_KEY, String(salonId))
  }
}

export function getPendingWalkIn() {
  return sessionStorage.getItem(STORAGE_KEY)
}

export function clearPendingWalkIn() {
  sessionStorage.removeItem(STORAGE_KEY)
}
