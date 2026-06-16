const LOCATION_CACHE_KEY = 'salonbazar_user_location'
const CACHE_TTL_MS = 15 * 60 * 1000

export function readCachedLocation() {
  try {
    const raw = sessionStorage.getItem(LOCATION_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.coords || Date.now() - parsed.savedAt > CACHE_TTL_MS) return null
    return parsed.coords
  } catch {
    return null
  }
}

export function writeCachedLocation(coords) {
  try {
    sessionStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
      coords,
      savedAt: Date.now(),
    }))
  } catch {
    // ignore quota errors
  }
}

export function clearCachedLocation() {
  sessionStorage.removeItem(LOCATION_CACHE_KEY)
}

export function isGeolocationSupported() {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator
}

export function requestBrowserLocation(options = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 15000,
    maximumAge = 60000,
  } = options

  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error('Geolocation is not supported on this device'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        writeCachedLocation(coords)
        resolve(coords)
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? 'Location permission denied'
          : error.code === error.TIMEOUT
            ? 'Location request timed out'
            : 'Could not get your location'
        reject(new Error(message))
      },
      { enableHighAccuracy, timeout, maximumAge }
    )
  })
}
