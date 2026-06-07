import api from './api'
import { ADMIN_ENDPOINTS } from '@/constants/config'

export const adminService = {
  getOverview: () => api.get(ADMIN_ENDPOINTS.overview),

  updateSalonStatus: (salonId, status) =>
    api.patch(ADMIN_ENDPOINTS.salonStatus(salonId), { status }),
}

export default adminService
