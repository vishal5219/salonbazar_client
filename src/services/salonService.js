// ─────────────────────────────────────────────────────────────
//  services/salonService.js
//  All calls go to https://api.salonbazar.shop/api/v1/salons/*
// ─────────────────────────────────────────────────────────────
import api from './api'
import { SALON_ENDPOINTS, SERVICE_ENDPOINTS } from '@/constants/config'

export const salonService = {

  /** Get all salons (with optional filters as query params) */
  getAll: (params = {}) =>
    api.get(SALON_ENDPOINTS.list, { params }),
  // params: { page, limit, category, city, minRating, minPrice, maxPrice, isOpen }

  /** Get featured salons for homepage */
  getFeatured: () =>
    api.get(SALON_ENDPOINTS.featured),

  /** Get salons near a GPS location */
  getNearby: (lat, lng, radiusKm = 5) =>
    api.get(SALON_ENDPOINTS.nearby, { params: { lat, lng, radius: radiusKm } }),

  /** Get single salon by ID */
  getById: (id) =>
    api.get(SALON_ENDPOINTS.detail(id)),

  /** Full-text search */
  search: (query, filters = {}) =>
    api.get(SALON_ENDPOINTS.search, { params: { q: query, ...filters } }),

  /** Register a new salon (shop owner) */
  register: (data) =>
    api.post(SALON_ENDPOINTS.register, data),

  /** Update salon details */
  update: (id, data) =>
    api.patch(SALON_ENDPOINTS.update(id), data),

  /** Delete a salon */
  delete: (id) =>
    api.delete(SALON_ENDPOINTS.delete(id)),

  /** Get salon's unique QR code data */
  getQRCode: (id) =>
    api.get(SALON_ENDPOINTS.qrCode(id)),

  // ── Services ────────────────────────────────────────────────
  getServices: (salonId) =>
    api.get(SERVICE_ENDPOINTS.bySalon(salonId)),

  addService: (salonId, data) =>
    api.post(SERVICE_ENDPOINTS.create(salonId), data),

  updateService: (salonId, serviceId, data) =>
    api.patch(SERVICE_ENDPOINTS.update(salonId, serviceId), data),

  deleteService: (salonId, serviceId) =>
    api.delete(SERVICE_ENDPOINTS.delete(salonId, serviceId)),
}

export default salonService
