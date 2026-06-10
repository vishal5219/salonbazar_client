/** Default map center when API does not return coordinates */
const SALON_COORDS = {
  1: [23.0395, 72.5600],
  2: [23.0280, 72.5131],
  3: [23.0209, 72.5267],
  4: [23.0437, 72.5169],
  5: [23.0152, 72.5290],
  6: [22.9988, 72.6032],
  7: [21.1702, 72.8311],
  8: [21.1959, 72.8302],
  9: [22.3072, 73.1812],
  10: [22.3039, 70.8022],
}

const CITY_COORDS = {
  Ahmedabad: [23.0225, 72.5714],
  Surat: [21.1702, 72.8311],
  Vadodara: [22.3072, 73.1812],
  Rajkot: [22.3039, 70.8022],
}

export function getSalonMapCoords(salon) {
  if (!salon) return CITY_COORDS.Ahmedabad

  const lat = parseFloat(salon.lat ?? salon.latitude)
  const lng = parseFloat(salon.lng ?? salon.longitude)
  if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng]

  if (SALON_COORDS[salon.id]) return SALON_COORDS[salon.id]

  const city = salon.city?.trim()
  if (city && CITY_COORDS[city]) return CITY_COORDS[city]

  return CITY_COORDS.Ahmedabad
}
