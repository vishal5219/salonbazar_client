import {
  ROLES, SUPER_ADMIN_ALIASES, SALON_TEAM_ROLES, isSuperAdmin, isSalonTeam,
} from '@/constants/roles'

export { ROLES, isSuperAdmin, isSalonTeam }

export const ROUTE_ROLES = {
  customerPages: [ROLES.CUSTOMER],
  salonDashboard: SALON_TEAM_ROLES,
  platformAdmin: SUPER_ADMIN_ALIASES,
  registerSalon: [ROLES.SHOP_OWNER],
}

export function canAccessRoute(role, allowedRoles) {
  if (!allowedRoles?.length) return true
  if (isSuperAdmin(role) && allowedRoles.some(r => SUPER_ADMIN_ALIASES.includes(r))) {
    return true
  }
  return allowedRoles.includes(role)
}

export function getDefaultPathForRole(role) {
  if (isSuperAdmin(role)) return '/admin'
  if (isSalonTeam(role)) return '/dashboard/overview'
  return '/salons'
}
