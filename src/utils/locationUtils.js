/** Display label for a city — always use proper name, never slug */
export function formatCityLabel(city) {
  if (!city) return ''
  return city.name || city.label || ''
}

/** Display label for a state */
export function formatStateLabel(state) {
  if (!state) return ''
  return state.name || ''
}

export function isSameCity(a, b) {
  if (!a || !b) return false
  if (a.id != null && b.id != null) return a.id === b.id
  if (a.slug && b.slug) return a.slug === b.slug
  const nameA = (a.name || '').toLowerCase()
  const nameB = (b.name || '').toLowerCase()
  return nameA && nameA === nameB
}

export function findCityInList(cities, target) {
  if (!target || !cities?.length) return null
  return cities.find(city => isSameCity(city, target)) || null
}

export function findStateInList(states, target) {
  if (!target || !states?.length) return null
  if (target.id != null) {
    const byId = states.find(state => state.id === target.id)
    if (byId) return byId
  }
  if (target.code) {
    const byCode = states.find(state => state.code === target.code)
    if (byCode) return byCode
  }
  const name = (target.name || '').toLowerCase()
  return states.find(state => state.name?.toLowerCase() === name) || null
}
