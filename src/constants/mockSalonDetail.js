// Mock detailed salon data — replace with API call to https://api.salonbazar.shop/api/v1/salons/:id
export const MOCK_SALON_DETAIL = {
  id: 1,
  name: 'Aura & Co.',
  tagline: 'Where Craft Meets Confidence',
  category: 'Premium Unisex Salon',
  rating: 4.9,
  reviews: 312,
  location: 'Shop 4, Navkar Complex, Navrangpura, Ahmedabad – 380009',
  city: 'Ahmedabad',
  distance: '0.8 km',
  phone: '+91 98765 43210',
  email: 'aura@salonbazar.shop',
  website: 'https://salonbazar.shop',
  isOpen: true,
  waitTime: '~12 min',
  queueCount: 4,
  featured: true,
  established: '2018',
  about: `Aura & Co. is Ahmedabad's most celebrated premium unisex salon, founded with one belief — that every person deserves to feel extraordinary. Our team of internationally trained stylists blends global trends with a deep understanding of Indian hair textures and skin tones.

From precision haircuts and transformative color treatments to bridal packages and advanced skin therapies, every service is crafted with meticulous attention to detail. We don't just style — we curate an experience.`,

  workingHours: [
    { day: 'Monday',    open: '10:00 AM', close: '8:00 PM',  closed: false },
    { day: 'Tuesday',   open: '10:00 AM', close: '8:00 PM',  closed: false },
    { day: 'Wednesday', open: '10:00 AM', close: '8:00 PM',  closed: false },
    { day: 'Thursday',  open: '10:00 AM', close: '8:00 PM',  closed: false },
    { day: 'Friday',    open: '10:00 AM', close: '9:00 PM',  closed: false },
    { day: 'Saturday',  open: '9:00 AM',  close: '9:00 PM',  closed: false },
    { day: 'Sunday',    open: '10:00 AM', close: '6:00 PM',  closed: false },
  ],

  amenities: ['Free Parking', 'Wi-Fi', 'Air Conditioned', 'Card Payment', 'UPI Accepted', 'Complimentary Beverages'],

  gallery: [
    { id: 1, url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80', caption: 'Salon Interior' },
    { id: 2, url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80', caption: 'Styling Station' },
    { id: 3, url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', caption: 'Color Lab' },
    { id: 4, url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80', caption: 'Skin Treatment Room' },
    { id: 5, url: 'https://images.unsplash.com/photo-1626957341926-98752fc2ba99?w=800&q=80', caption: 'Nail Studio' },
    { id: 6, url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80', caption: 'Men\'s Section' },
    { id: 7, url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80', caption: 'Wash Area' },
    { id: 8, url: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80', caption: 'Reception' },
  ],

  services: [
    {
      id: 'cat-hair',
      category: 'Hair',
      icon: '💇',
      items: [
        { id: 's1',  name: 'Haircut & Styling',          duration: 45,  price: 499,  popular: true,  desc: 'Precision cut by senior stylist with wash & blow-dry' },
        { id: 's2',  name: 'Hair Color (Global)',         duration: 120, price: 1499, popular: true,  desc: 'Full head color with premium Loreal / Wella shades' },
        { id: 's3',  name: 'Balayage & Highlights',      duration: 150, price: 2499, popular: false, desc: 'Hand-painted highlights for a natural sun-kissed look' },
        { id: 's4',  name: 'Keratin Treatment',          duration: 180, price: 3499, popular: false, desc: 'Brazilian keratin for frizz-free, smooth hair for 3-6 months' },
        { id: 's5',  name: 'Hair Spa',                   duration: 60,  price: 799,  popular: false, desc: 'Deep conditioning treatment with scalp massage' },
        { id: 's6',  name: 'Blow-dry & Styling',         duration: 30,  price: 349,  popular: false, desc: 'Professional blow-dry with finish serum' },
      ],
    },
    {
      id: 'cat-skin',
      category: 'Skin & Facial',
      icon: '✨',
      items: [
        { id: 's7',  name: 'Classic Facial',             duration: 60,  price: 899,  popular: false, desc: 'Deep cleanse, exfoliation, and hydration mask' },
        { id: 's8',  name: 'Gold Radiance Facial',       duration: 75,  price: 1599, popular: true,  desc: '24K gold infusion for luminous, glowing skin' },
        { id: 's9',  name: 'Anti-Aging Treatment',       duration: 90,  price: 2199, popular: false, desc: 'Collagen boost with RF technology and peptide serums' },
        { id: 's10', name: 'Cleanup',                    duration: 30,  price: 449,  popular: false, desc: 'Express skin cleanup for instant freshness' },
      ],
    },
    {
      id: 'cat-bridal',
      category: 'Bridal',
      icon: '👰',
      items: [
        { id: 's11', name: 'Bridal Makeup (Full)',        duration: 180, price: 7999, popular: true,  desc: 'Trial + day-of makeup with airbrush finish. HD ready.' },
        { id: 's12', name: 'Bridal Hair Styling',        duration: 90,  price: 3499, popular: false, desc: 'Updo or open hairstyle with extensions if needed' },
        { id: 's13', name: 'Pre-Bridal Package',         duration: 240, price: 9999, popular: false, desc: '4-session package: facial, body polish, wax, threading' },
      ],
    },
    {
      id: 'cat-nails',
      category: 'Nails',
      icon: '💅',
      items: [
        { id: 's14', name: 'Manicure (Classic)',          duration: 45,  price: 399,  popular: false, desc: 'Nail shaping, cuticle care, hand massage, and polish' },
        { id: 's15', name: 'Gel Extension',              duration: 90,  price: 1299, popular: true,  desc: 'Durable gel nails with your choice of design' },
        { id: 's16', name: 'Nail Art (Per Nail)',         duration: 60,  price: 699,  popular: false, desc: 'Custom nail art designs by our specialist' },
      ],
    },
    {
      id: 'cat-spa',
      category: 'Spa & Massage',
      icon: '🧖',
      items: [
        { id: 's17', name: 'Swedish Massage (60 min)',   duration: 60,  price: 1299, popular: false, desc: 'Full body relaxation with aromatic oils' },
        { id: 's18', name: 'Head & Shoulder Massage',   duration: 30,  price: 599,  popular: true,  desc: 'Tension-relief massage for neck, shoulders, scalp' },
        { id: 's19', name: 'Body Polishing',             duration: 90,  price: 1799, popular: false, desc: 'Full body scrub + mask for radiant, smooth skin' },
      ],
    },
  ],

  staff: [
    { id: 1, name: 'Meera Kapoor',  role: 'Senior Stylist & Color Expert', experience: '8 years',  rating: 4.9, reviews: 128, avatar: 'MK', specialties: ['Balayage', 'Keratin', 'Bridal Hair'],   image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&q=80', available: true },
    { id: 2, name: 'Rohan Shah',    role: "Men's Grooming Specialist",      experience: '6 years',  rating: 4.8, reviews: 97,  avatar: 'RS', specialties: ['Fade Cut', 'Beard Shaping', 'Hair Color'], image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', available: true },
    { id: 3, name: 'Priya Nair',    role: 'Skin & Bridal Specialist',       experience: '10 years', rating: 4.9, reviews: 204, avatar: 'PN', specialties: ['Bridal Makeup', 'Facials', 'Skin Therapy'], image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&q=80', available: false },
    { id: 4, name: 'Arjun Mehta',   role: 'Nail Technician & Artist',       experience: '4 years',  rating: 4.7, reviews: 63,  avatar: 'AM', specialties: ['Gel Nails', 'Nail Art', 'Pedicure'],       image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80', available: true },
    { id: 5, name: 'Sneha Joshi',   role: 'Spa & Massage Therapist',        experience: '5 years',  rating: 4.8, reviews: 89,  avatar: 'SJ', specialties: ['Swedish Massage', 'Body Polishing', 'Reflexology'], image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80', available: true },
  ],

  reviews: [
    { id: 1, name: 'Ananya Patel',   avatar: 'AP', rating: 5, date: '12 Jan 2025', service: 'Bridal Makeup',       verified: true,  text: 'Priya is an absolute magician! I cried happy tears when I saw myself. The makeup lasted the entire 12-hour wedding function without any touch-ups. Totally worth every rupee.' },
    { id: 2, name: 'Devraj Singh',   avatar: 'DS', rating: 5, date: '8 Jan 2025',  service: 'Haircut & Styling',   verified: true,  text: 'Rohan understood exactly what I wanted from just a reference photo. Perfect fade. The QR walk-in system meant zero waiting. Will never go anywhere else.' },
    { id: 3, name: 'Kavya Sharma',   avatar: 'KS', rating: 5, date: '2 Jan 2025',  service: 'Balayage',            verified: true,  text: 'Meera is honestly the best colorist in Ahmedabad. My balayage looks so natural — everyone thinks it\'s my natural hair! The salon itself is stunning too.' },
    { id: 4, name: 'Rahul Joshi',    avatar: 'RJ', rating: 4, date: '28 Dec 2024', service: 'Hair Spa',            verified: false, text: 'Very relaxing experience. The head massage with the hair spa is divine. Booking through the app was super simple. Would recommend the Gold Facial too next time.' },
    { id: 5, name: 'Nisha Mehta',    avatar: 'NM', rating: 5, date: '20 Dec 2024', service: 'Gold Radiance Facial', verified: true, text: 'My skin literally glowed for a week after the Gold Facial. Sneha was so thorough and explained every step. The salon environment is very hygienic and premium.' },
    { id: 6, name: 'Vikram Desai',   avatar: 'VD', rating: 4, date: '15 Dec 2024', service: 'Haircut & Styling',   verified: true, text: 'Good service overall. The live queue tracker on SalonBazar is very useful — I arrived just as the previous customer was finishing. Clean premises, friendly staff.' },
  ],

  ratingBreakdown: { 5: 245, 4: 48, 3: 12, 2: 5, 1: 2 },

  similarSalons: [2, 3, 4],
}
