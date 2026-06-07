import api from './api'
import { DASHBOARD_ENDPOINTS } from '@/constants/config'

export const dashboardService = {
  getDashboard: (salonId) => api.get(DASHBOARD_ENDPOINTS.overview(salonId)),

  getEarnings: (salonId) => api.get(DASHBOARD_ENDPOINTS.earnings(salonId)),

  getPeakHours: (salonId) => api.get(DASHBOARD_ENDPOINTS.peakHours(salonId)),

  getTopServices: (salonId) => api.get(DASHBOARD_ENDPOINTS.popularity(salonId)),
}

export default dashboardService
