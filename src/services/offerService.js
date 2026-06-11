import api from './api'

export const offerService = {
  getAll: () => api.get('/offers'),
}

export default offerService
