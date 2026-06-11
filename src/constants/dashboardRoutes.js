/** Salon dashboard URL segments — each section has its own route for reload-safe navigation */
export const DASHBOARD_PATHS = {
  root: '/dashboard',
  overview: '/dashboard/overview',
  queue: '/dashboard/queue',
  queueCompleted: '/dashboard/queue/completed',
  appointments: '/dashboard/appointments',
  walkIn: '/dashboard/walk-in',
  analytics: '/dashboard/analytics',
  team: '/dashboard/team',
  settings: '/dashboard/settings',
}

export const DASHBOARD_NAV = [
  { id: 'overview', path: DASHBOARD_PATHS.overview, label: 'Overview', badge: null, ownerOnly: false },
  { id: 'queue', path: DASHBOARD_PATHS.queue, label: 'Live Queue', badge: 'queue', ownerOnly: false },
  { id: 'queueCompleted', path: DASHBOARD_PATHS.queueCompleted, label: 'Completed', badge: 'completed', ownerOnly: false },
  { id: 'appointments', path: DASHBOARD_PATHS.appointments, label: 'Appointments', badge: 'bookings', ownerOnly: false },
  { id: 'walkIn', path: DASHBOARD_PATHS.walkIn, label: 'Walk-In Entry', badge: null, ownerOnly: false },
  { id: 'analytics', path: DASHBOARD_PATHS.analytics, label: 'Analytics', badge: null, ownerOnly: true },
  { id: 'team', path: DASHBOARD_PATHS.team, label: 'Team & Staff', badge: null, ownerOnly: true },
]
