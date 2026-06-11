import { APP_URL, APP_NAME, APP_TAGLINE } from './config'

export const SEO_DEFAULTS = {
  siteName: APP_NAME,
  tagline: APP_TAGLINE,
  baseUrl: APP_URL.replace(/\/$/, ''),
  defaultImage: `${APP_URL.replace(/\/$/, '')}/logo/salonbazar-mark.png`,
  twitterHandle: '@salonbazar',
  locale: 'en_IN',
}

export const PAGE_SEO = {
  home: {
    title: 'SalonBazar – Book Salons Online in Ahmedabad | Hair, Spa & Grooming',
    description: 'Discover and book premium salons in Ahmedabad. Compare ratings, skip the queue, and schedule haircuts, facials, bridal makeup and more — instantly on SalonBazar.',
    path: '/',
  },
  salons: {
    title: 'Explore Salons in Ahmedabad | SalonBazar',
    description: 'Browse 250+ verified salons in Ahmedabad. Filter by service, rating, price and location. Book unisex salons, men\'s grooming and ladies beauty services online.',
    path: '/salons',
  },
  about: {
    title: 'About SalonBazar | India\'s Trusted Salon Booking Platform',
    description: 'Learn how SalonBazar connects customers with premium salons across Ahmedabad. Our mission, values, and story behind India\'s smartest salon booking marketplace.',
    path: '/about',
  },
  offers: {
    title: 'Salon Offers & Coupon Codes | Save on Bookings | SalonBazar',
    description: 'Grab exclusive SalonBazar coupon codes and spotlight deals from top-rated salons. Save on haircuts, facials, spa and grooming — apply at checkout.',
    path: '/offers',
  },
  registerSalon: {
    title: 'Register Your Salon | SalonBazar',
    description: 'List your salon on SalonBazar. Manage bookings, live queue, and staff from your owner dashboard.',
    path: '/register-salon',
    noindex: true,
  },
  bookings: {
    title: 'My Bookings | SalonBazar',
    description: 'View and manage your salon appointments. Track upcoming visits, past bookings and cancellations on SalonBazar.',
    path: '/bookings',
    noindex: true,
  },
  wishlist: {
    title: 'My Wishlist | SalonBazar',
    description: 'Your saved favourite salons on SalonBazar. Quick access to book hair, spa and grooming services.',
    path: '/wishlist',
    noindex: true,
  },
  profile: {
    title: 'My Profile | SalonBazar',
    description: 'Manage your SalonBazar profile, booking history, wishlist and account settings.',
    path: '/profile',
    noindex: true,
  },
  dashboard: {
    title: 'Salon Dashboard | SalonBazar',
    description: 'Manage bookings, queue, analytics and revenue for your salon on SalonBazar.',
    path: '/dashboard',
    noindex: true,
  },
  admin: {
    title: 'Admin Panel | SalonBazar',
    description: 'SalonBazar platform administration.',
    path: '/admin',
    noindex: true,
  },
  notFound: {
    title: 'Page Not Found | SalonBazar',
    description: 'The page you are looking for does not exist. Browse salons or return to SalonBazar home.',
    path: '/404',
    noindex: true,
  },
}

export function buildCanonical(path = '/') {
  const base = SEO_DEFAULTS.baseUrl
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${base}${clean === '/' ? '' : clean}` || base
}

export function buildSalonSeo(salon) {
  if (!salon) return null
  const priceHint = salon.price || 'affordable prices'
  return {
    title: `${salon.name} – ${salon.category || 'Salon'} in ${salon.city || 'Ahmedabad'} | Book Online`,
    description: `Book ${salon.name} on SalonBazar. ${salon.tagline ? `${salon.tagline}. ` : ''}Rated ${salon.rating}★ · ${salon.location}. Services from ${priceHint}.`,
    path: `/salons/${salon.id}`,
    image: salon.image || salon.gallery?.[0]?.url,
    ogType: 'website',
  }
}

export function buildBookingSeo(salonName, salonId) {
  return {
    title: `Book Appointment${salonName ? ` at ${salonName}` : ''} | SalonBazar`,
    description: `Complete your salon booking${salonName ? ` at ${salonName}` : ''}. Choose service, date, time and pay securely on SalonBazar.`,
    path: `/booking/${salonId}`,
    noindex: true,
  }
}

export function buildSalonListSeo(query, category) {
  let title = 'Explore Salons in Ahmedabad | SalonBazar'
  let description = PAGE_SEO.salons.description

  if (query) {
    title = `${query} Salons in Ahmedabad | SalonBazar`
    description = `Find salons for "${query}" in Ahmedabad. Compare ratings, prices and book instantly on SalonBazar.`
  } else if (category) {
    title = `${category} Salons in Ahmedabad | SalonBazar`
    description = `Browse ${category} salons in Ahmedabad. Verified reviews, live queue and instant booking on SalonBazar.`
  }

  return { title, description, path: '/salons' }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: SEO_DEFAULTS.baseUrl,
    logo: SEO_DEFAULTS.defaultImage,
    description: APP_TAGLINE,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'hello@salonbazar.shop',
      availableLanguage: ['English', 'Hindi'],
    },
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APP_NAME,
    url: SEO_DEFAULTS.baseUrl,
    description: APP_TAGLINE,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_DEFAULTS.baseUrl}/salons?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function localBusinessJsonLd(salon) {
  if (!salon) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: salon.name,
    description: salon.about || salon.tagline,
    image: salon.image || salon.gallery?.[0]?.url,
    url: buildCanonical(`/salons/${salon.id}`),
    telephone: salon.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: salon.city || 'Ahmedabad',
      streetAddress: salon.location,
      addressCountry: 'IN',
    },
    aggregateRating: salon.rating ? {
      '@type': 'AggregateRating',
      ratingValue: salon.rating,
      reviewCount: salon.reviews || salon.review_count || 0,
    } : undefined,
    priceRange: salon.price || '₹₹',
  }
}
