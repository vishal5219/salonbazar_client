import api from './api'
import { LOCATION_ENDPOINTS } from '@/constants/config'

export const locationService = {
  getStates: () => api.get(LOCATION_ENDPOINTS.states),

  getCitiesByState: (stateId) => api.get(LOCATION_ENDPOINTS.citiesByState(stateId)),

  getActiveCities: () => api.get(LOCATION_ENDPOINTS.activeCities),

  resolve: (lat, lng) => api.get(LOCATION_ENDPOINTS.resolve, { params: { lat, lng } }),
}

export default locationService
