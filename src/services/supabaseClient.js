// ─────────────────────────────────────────────────────────────
//  services/supabaseClient.js
//  Used for Realtime subscriptions (live queue, booking updates)
//  Regular REST calls go through services/api.js instead.
// ─────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/constants/config'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[SalonBazar] Supabase credentials missing. ' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession:    true,
    autoRefreshToken:  true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// ── Realtime helpers ──────────────────────────────────────────

/**
 * Subscribe to live queue changes for a salon.
 * Used in the Queue page and QR walk-in flow.
 *
 * @param {string|number} salonId
 * @param {Function} callback  — called with the updated queue row
 * @returns {Function} unsubscribe — call on component unmount
 */
export function subscribeToQueue(salonId, callback) {
  const channel = supabase
    .channel(`queue:salon_${salonId}`)
    .on(
      'postgres_changes',
      {
        event:  '*',           // INSERT | UPDATE | DELETE
        schema: 'public',
        table:  'queues',
        filter: `salon_id=eq.${salonId}`,
      },
      (payload) => callback(payload)
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

/**
 * Subscribe to booking status changes for a user.
 * Used on the customer booking-history / tracking page.
 *
 * @param {string|number} bookingId
 * @param {Function} callback
 * @returns {Function} unsubscribe
 */
export function subscribeToBooking(bookingId, callback) {
  const channel = supabase
    .channel(`booking:${bookingId}`)
    .on(
      'postgres_changes',
      {
        event:  'UPDATE',
        schema: 'public',
        table:  'bookings',
        filter: `id=eq.${bookingId}`,
      },
      (payload) => callback(payload.new)
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

export default supabase
