/** Fallback offers when API is unavailable */
export const FALLBACK_COUPONS = [
  {
    code: 'FIRST50',
    description: '₹50 off your first booking',
    minOrder: 0,
    discount: 50,
    type: 'flat',
    maxDiscount: null,
    label: '₹50 OFF',
  },
  {
    code: 'SALON20',
    description: '20% off (up to ₹200)',
    minOrder: 0,
    discount: 20,
    type: 'percent',
    maxDiscount: 200,
    label: '20% OFF',
  },
  {
    code: 'BAZAR100',
    description: '₹100 off on orders above ₹500',
    minOrder: 500,
    discount: 100,
    type: 'flat',
    maxDiscount: null,
    label: '₹100 OFF',
  },
]

export const FALLBACK_SPOTLIGHT = [
  {
    salonId: 1,
    salonName: 'Aura & Co.',
    category: 'Premium Unisex Salon',
    city: 'Ahmedabad',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
    priceFrom: '₹499',
    badge: 'Bridal Special',
    title: '15% off bridal packages',
    validUntil: '2026-08-31',
  },
  {
    salonId: 2,
    salonName: 'The Blade Studio',
    category: "Men's Grooming Lounge",
    city: 'Ahmedabad',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
    priceFrom: '₹349',
    badge: 'New Customer',
    title: 'Free beard trim with haircut',
    validUntil: '2026-07-31',
  },
  {
    salonId: 3,
    salonName: 'Lumière Beauty',
    category: 'Ladies Boutique Salon',
    city: 'Ahmedabad',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    priceFrom: '₹599',
    badge: 'Weekend Glow',
    title: 'Gold facial at ₹1,299',
    validUntil: '2026-06-30',
  },
]

export const REDEEM_STEPS = [
  {
    step: '01',
    title: 'Pick a salon',
    desc: 'Browse verified salons and choose your service.',
  },
  {
    step: '02',
    title: 'Apply at checkout',
    desc: 'Enter your coupon code on the payment step before confirming.',
  },
  {
    step: '03',
    title: 'Enjoy the savings',
    desc: 'Discount is applied instantly — online or pay at salon.',
  },
]
