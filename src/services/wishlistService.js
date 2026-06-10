import api from './api'
import { WISHLIST_ENDPOINTS } from '@/constants/config'

export const wishlistService = {
  getAll: () => api.get(WISHLIST_ENDPOINTS.list),

  getIds: () => api.get(WISHLIST_ENDPOINTS.ids),

  check: (salonId) => api.get(WISHLIST_ENDPOINTS.check(salonId)),

  add: (salonId) => api.post(WISHLIST_ENDPOINTS.add, { salonId }),

  remove: (salonId) => api.delete(WISHLIST_ENDPOINTS.remove(salonId)),
}

export default wishlistService
