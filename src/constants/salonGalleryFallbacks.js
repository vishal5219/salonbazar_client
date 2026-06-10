/** Default gallery photos when the API returns an empty or sparse gallery array */

const GALLERY_POOLS = {
  unisex: [
    { caption: 'Salon Interior', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80' },
    { caption: 'Styling Station', url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80' },
    { caption: 'Color Lab', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80' },
    { caption: 'Reception', url: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb09d?w=800&q=80' },
    { caption: 'Spa Room', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbbe4f?w=800&q=80' },
  ],
  mens: [
    { caption: 'Barber Station', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80' },
    { caption: 'Fade & Styling', url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80' },
    { caption: 'Beard Grooming', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80' },
    { caption: 'Salon Interior', url: 'https://images.unsplash.com/photo-1585747860715-2ba37f7887a0?w=800&q=80' },
    { caption: 'Wash Area', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80' },
  ],
  ladies: [
    { caption: 'Styling Lounge', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80' },
    { caption: 'Makeup Studio', url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80' },
    { caption: 'Nail Studio', url: 'https://images.unsplash.com/photo-1626957341926-98752fc2ba99?w=800&q=80' },
    { caption: 'Bridal Room', url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80' },
    { caption: 'Reception', url: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80' },
  ],
  spa: [
    { caption: 'Treatment Room', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80' },
    { caption: 'Spa Lounge', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbbe4f?w=800&q=80' },
    { caption: 'Massage Suite', url: 'https://images.unsplash.com/photo-1519823551278-64b92793cd27?w=800&q=80' },
    { caption: 'Relaxation Area', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80' },
    { caption: 'Reception', url: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb09d?w=800&q=80' },
  ],
}

function resolveGalleryPool(category = '') {
  const normalized = category.toLowerCase()
  if (normalized.includes('men') || normalized.includes('barber')) return GALLERY_POOLS.mens
  if (normalized.includes('ladies') || normalized.includes('boutique')) return GALLERY_POOLS.ladies
  if (normalized.includes('spa')) return GALLERY_POOLS.spa
  return GALLERY_POOLS.unisex
}

export function getSalonGalleryFallbacks(salon) {
  const pool = resolveGalleryPool(salon?.category)
  return pool.map((item, index) => ({
    id: `fallback-${index}`,
    url: item.url,
    caption: item.caption,
  }))
}
