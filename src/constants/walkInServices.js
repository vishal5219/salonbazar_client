/** Quick-select services when a salon has no catalog in the database yet */
export const FALLBACK_WALK_IN_SERVICES = [
  { id: 'walkin-haircut', name: 'Haircut & Styling', duration: 45, price: 499, category: 'Hair' },
  { id: 'walkin-beard', name: 'Beard Trim & Shape', duration: 30, price: 299, category: 'Grooming' },
  { id: 'walkin-facial', name: 'Cleanup / Facial', duration: 60, price: 799, category: 'Skin' },
  { id: 'walkin-color', name: 'Hair Color', duration: 90, price: 1499, category: 'Hair' },
  { id: 'walkin-manicure', name: 'Manicure', duration: 45, price: 399, category: 'Nails' },
  { id: 'walkin-massage', name: 'Head Massage', duration: 30, price: 349, category: 'Spa' },
]
