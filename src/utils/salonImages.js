import { getSalonGalleryFallbacks } from '@/constants/salonGalleryFallbacks'

const MIN_GALLERY_IMAGES = 5

function normalizeImageUrl(url) {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    return `${parsed.origin}${parsed.pathname}`
  } catch {
    return url.split('?')[0]
  }
}

function addUniqueImage(gallery, seen, image) {
  if (!image?.url) return
  const key = normalizeImageUrl(image.url)
  if (seen.has(key)) return
  seen.add(key)
  gallery.push(image)
}

/** Gallery rows for display — fills sparse API data so hero mosaic and gallery strip both render */
export function getSalonDisplayGallery(salon) {
  if (!salon) return []

  const gallery = []
  const seen = new Set()

  for (const item of salon.gallery || []) {
    addUniqueImage(gallery, seen, item)
  }

  if (salon.image) {
    addUniqueImage(gallery, seen, {
      id: 'cover',
      url: salon.image,
      caption: salon.name || 'Salon photo',
    })
  }

  if (gallery.length < MIN_GALLERY_IMAGES) {
    for (const item of getSalonGalleryFallbacks(salon)) {
      addUniqueImage(gallery, seen, item)
      if (gallery.length >= MIN_GALLERY_IMAGES) break
    }
  }

  for (const member of salon.staff || []) {
    if (gallery.length >= MIN_GALLERY_IMAGES) break
    addUniqueImage(gallery, seen, {
      id: `staff-${member.id}`,
      url: member.image,
      caption: member.name,
    })
  }

  return gallery
}
