// ─────────────────────────────────────────────────────────────
//  services/uploadService.js
//  Image uploads proxied through https://api.salonbazar.shop
//  so Cloudinary credentials never reach the browser.
// ─────────────────────────────────────────────────────────────
import api from './api'
import { UPLOAD_ENDPOINTS } from '@/constants/config'

export const uploadService = {

  /**
   * Upload a single image file.
   * The API proxies it to Cloudinary and returns the CDN URL.
   *
   * @param {File} file
   * @param {string} folder  e.g. 'salons', 'avatars', 'services'
   * @returns {Promise<{ url: string, publicId: string }>}
   */
  uploadImage: async (file, folder = 'general') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    return api.post(UPLOAD_ENDPOINTS.image, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  /**
   * Upload multiple images at once.
   * Returns array of CDN URLs in the same order as input files.
   */
  uploadMultiple: async (files, folder = 'general') => {
    const uploads = Array.from(files).map(f =>
      uploadService.uploadImage(f, folder)
    )
    return Promise.all(uploads)
  },
}

export default uploadService
