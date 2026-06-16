import { DEFAULT_CITY, getDefaultCityCoords } from '@/constants/locationData'

const SELECTED_LOCATION_KEY = 'salonbazar_selected_location'

export function readSelectedLocation() {
  try {
    const raw = localStorage.getItem(SELECTED_LOCATION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeSelectedLocation(payload) {
  try {
    localStorage.setItem(SELECTED_LOCATION_KEY, JSON.stringify(payload))
  } catch {
    // ignore
  }
}

/** Fallback when GPS/API unavailable — Phase 1 launch city (Ahmedabad) */
export function getDefaultLocationFallback() {
  const { lat, lng } = getDefaultCityCoords()
  return {
    state: { code: 'GJ', name: 'Gujarat' },
    city: {
      slug: DEFAULT_CITY?.id || 'ahmedabad',
      name: DEFAULT_CITY?.name || 'Ahmedabad',
      latitude: lat,
      longitude: lng,
      tier: DEFAULT_CITY?.tier ?? 1,
      active: DEFAULT_CITY?.active ?? true,
    },
    coords: { lat, lng },
  }
}
