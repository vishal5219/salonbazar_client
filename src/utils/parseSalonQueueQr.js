/**
 * Parse salon walk-in QR payloads:
 * - https://domain/salons/1?queue=join
 * - salonbazar:queue:1
 */
export function parseSalonQueueQr(text) {
  if (!text || typeof text !== 'string') return null
  const trimmed = text.trim()

  if (trimmed.startsWith('salonbazar:queue:')) {
    const salonId = trimmed.split(':')[2]
    return salonId ? { salonId, joinQueue: true } : null
  }

  try {
    const url = new URL(trimmed)
    const match = url.pathname.match(/\/salons\/(\d+)/)
    if (match) {
      return {
        salonId: match[1],
        joinQueue: url.searchParams.get('queue') === 'join' || url.searchParams.has('queue'),
      }
    }
  } catch {
    const pathMatch = trimmed.match(/\/salons\/(\d+)/)
    if (pathMatch) {
      return { salonId: pathMatch[1], joinQueue: /queue=join/.test(trimmed) }
    }
  }

  return null
}

export function buildSalonQueuePath(salonId) {
  return `/salons/${salonId}?queue=join`
}
