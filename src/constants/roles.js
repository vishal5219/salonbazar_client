export const ROLES = {
  CUSTOMER: 'customer',
  SHOP_OWNER: 'shop_owner',
  SHOP_STAFF: 'shop_staff',
  SUPER_ADMIN: 'super_admin',
}

export const SIGNUP_ROLES = [ROLES.CUSTOMER, ROLES.SHOP_OWNER]

/** Legacy JWT / DB value */
export const SUPER_ADMIN_ALIASES = [ROLES.SUPER_ADMIN, 'admin']

export const SALON_TEAM_ROLES = [ROLES.SHOP_OWNER, ROLES.SHOP_STAFF]

export function isSuperAdmin(role) {
  return SUPER_ADMIN_ALIASES.includes(role)
}

export function isSalonTeam(role) {
  return SALON_TEAM_ROLES.includes(role)
}

export function isCustomer(role) {
  return role === ROLES.CUSTOMER
}

export function roleLabel(role) {
  switch (role) {
    case ROLES.CUSTOMER: return 'Customer'
    case ROLES.SHOP_OWNER: return 'Salon Owner'
    case ROLES.SHOP_STAFF: return 'Salon Staff'
    case ROLES.SUPER_ADMIN:
    case 'admin': return 'Platform Admin'
    default: return 'User'
  }
}
