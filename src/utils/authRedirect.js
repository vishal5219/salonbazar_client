import { ROLES } from '@/constants/roles'
import { isSalonTeam, isSuperAdmin } from '@/utils/roleAccess'

export function getPostAuthPath(role, salonId) {
  if (isSuperAdmin(role)) return '/admin'
  if (isSalonTeam(role) && salonId) return '/dashboard/overview'
  if (role === ROLES.SHOP_OWNER) return '/register-salon'
  return '/salons'
}

export function normalizeAuthPayload(payload) {
  if (!payload) return null
  const user = payload.user || null
  const role = payload.role || user?.role || ROLES.CUSTOMER
  return {
    user: user ? { ...user, role: user.role || role } : null,
    role,
    token: payload.token || null,
  }
}
