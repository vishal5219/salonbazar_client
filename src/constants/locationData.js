/**
 * SalonBazar location master data — states & cities.
 * Keep in sync with server-salonbazar/src/constants/locationData.js
 */

export const INDIA_STATES = [
  { id: 'GJ', name: 'Gujarat', capital: 'Gandhinagar' },
  { id: 'MH', name: 'Maharashtra', capital: 'Mumbai' },
  { id: 'RJ', name: 'Rajasthan', capital: 'Jaipur' },
  { id: 'MP', name: 'Madhya Pradesh', capital: 'Bhopal' },
  { id: 'UP', name: 'Uttar Pradesh', capital: 'Lucknow' },
  { id: 'DL', name: 'Delhi', capital: 'New Delhi' },
  { id: 'HR', name: 'Haryana', capital: 'Chandigarh' },
  { id: 'PB', name: 'Punjab', capital: 'Chandigarh' },
  { id: 'KA', name: 'Karnataka', capital: 'Bengaluru' },
  { id: 'TN', name: 'Tamil Nadu', capital: 'Chennai' },
  { id: 'TS', name: 'Telangana', capital: 'Hyderabad' },
  { id: 'AP', name: 'Andhra Pradesh', capital: 'Amaravati' },
  { id: 'KL', name: 'Kerala', capital: 'Thiruvananthapuram' },
  { id: 'WB', name: 'West Bengal', capital: 'Kolkata' },
  { id: 'OR', name: 'Odisha', capital: 'Bhubaneswar' },
  { id: 'BR', name: 'Bihar', capital: 'Patna' },
  { id: 'JH', name: 'Jharkhand', capital: 'Ranchi' },
  { id: 'CG', name: 'Chhattisgarh', capital: 'Raipur' },
  { id: 'UK', name: 'Uttarakhand', capital: 'Dehradun' },
  { id: 'HP', name: 'Himachal Pradesh', capital: 'Shimla' },
  { id: 'JK', name: 'Jammu & Kashmir', capital: 'Srinagar' },
  { id: 'AS', name: 'Assam', capital: 'Dispur' },
  { id: 'GA', name: 'Goa', capital: 'Panaji' },
]

export const CITIES_BY_STATE = {
  GJ: [
    { id: 'ahmedabad', name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, tier: 1, active: true },
    { id: 'surat', name: 'Surat', lat: 21.1702, lng: 72.8311, tier: 1, active: true },
    { id: 'vadodara', name: 'Vadodara', lat: 22.3072, lng: 73.1812, tier: 1, active: true },
    { id: 'rajkot', name: 'Rajkot', lat: 22.3039, lng: 70.8022, tier: 2, active: false },
    { id: 'gandhinagar', name: 'Gandhinagar', lat: 23.2156, lng: 72.6369, tier: 2, active: false },
    { id: 'bhavnagar', name: 'Bhavnagar', lat: 21.7645, lng: 72.1519, tier: 2, active: false },
    { id: 'anand', name: 'Anand', lat: 22.5645, lng: 72.9289, tier: 3, active: false },
    { id: 'mehsana', name: 'Mehsana', lat: 23.5880, lng: 72.3693, tier: 3, active: false },
  ],
  MH: [
    { id: 'mumbai', name: 'Mumbai', lat: 19.0760, lng: 72.8777, tier: 1, active: false },
    { id: 'pune', name: 'Pune', lat: 18.5204, lng: 73.8567, tier: 1, active: false },
    { id: 'nagpur', name: 'Nagpur', lat: 21.1458, lng: 79.0882, tier: 1, active: false },
    { id: 'nashik', name: 'Nashik', lat: 19.9975, lng: 73.7898, tier: 2, active: false },
    { id: 'thane', name: 'Thane', lat: 19.2183, lng: 72.9781, tier: 2, active: false },
    { id: 'aurangabad', name: 'Aurangabad', lat: 19.8762, lng: 75.3433, tier: 2, active: false },
  ],
  RJ: [
    { id: 'jaipur', name: 'Jaipur', lat: 26.9124, lng: 75.7873, tier: 1, active: false },
    { id: 'jodhpur', name: 'Jodhpur', lat: 26.2389, lng: 73.0243, tier: 2, active: false },
    { id: 'udaipur', name: 'Udaipur', lat: 24.5854, lng: 73.7125, tier: 2, active: false },
    { id: 'kota', name: 'Kota', lat: 25.2138, lng: 75.8648, tier: 2, active: false },
  ],
  DL: [
    { id: 'delhi', name: 'Delhi', lat: 28.6139, lng: 77.2090, tier: 1, active: false },
    { id: 'noida', name: 'Noida', lat: 28.5355, lng: 77.3910, tier: 1, active: false },
    { id: 'gurugram', name: 'Gurugram', lat: 28.4595, lng: 77.0266, tier: 1, active: false },
  ],
  KA: [
    { id: 'bengaluru', name: 'Bengaluru', lat: 12.9716, lng: 77.5946, tier: 1, active: false },
    { id: 'mysuru', name: 'Mysuru', lat: 12.2958, lng: 76.6394, tier: 2, active: false },
    { id: 'hubli', name: 'Hubli', lat: 15.3647, lng: 75.1240, tier: 2, active: false },
  ],
  TN: [
    { id: 'chennai', name: 'Chennai', lat: 13.0827, lng: 80.2707, tier: 1, active: false },
    { id: 'coimbatore', name: 'Coimbatore', lat: 11.0168, lng: 76.9558, tier: 1, active: false },
    { id: 'madurai', name: 'Madurai', lat: 9.9252, lng: 78.1198, tier: 2, active: false },
  ],
  TS: [
    { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lng: 78.4867, tier: 1, active: false },
    { id: 'warangal', name: 'Warangal', lat: 17.9689, lng: 79.5941, tier: 2, active: false },
  ],
  WB: [
    { id: 'kolkata', name: 'Kolkata', lat: 22.5726, lng: 88.3639, tier: 1, active: false },
    { id: 'howrah', name: 'Howrah', lat: 22.5958, lng: 88.2636, tier: 2, active: false },
  ],
}

export const ALL_CITIES = Object.entries(CITIES_BY_STATE).flatMap(([stateCode, cities]) =>
  cities.map(city => ({ ...city, stateCode }))
)

export const ACTIVE_CITIES = ALL_CITIES.filter(city => city.active)

/** Phase 1 default launch city */
export const DEFAULT_CITY = ALL_CITIES.find(city => city.id === 'ahmedabad')

export function getStateByCode(stateCode) {
  return INDIA_STATES.find(state => state.id === stateCode) || null
}

export function getCitiesForStateCode(stateCode) {
  return CITIES_BY_STATE[stateCode] || []
}

export function getDefaultCityCoords() {
  return {
    lat: DEFAULT_CITY?.lat ?? 23.0225,
    lng: DEFAULT_CITY?.lng ?? 72.5714,
  }
}

/** Homepage popular search chips */
export const POPULAR_SEARCHES = [
  { label: 'Hair Color', category: 'hair', query: 'hair color' },
  { label: 'Bridal Makeup', category: 'bridal', query: 'bridal makeup' },
  { label: 'Haircut & Styling', category: 'hair', query: 'haircut' },
  { label: 'Facial', category: 'skin', query: 'facial' },
  { label: 'Nail Art', category: 'nails', query: 'nail art' },
  { label: 'Beard Trim', category: 'mens', query: 'beard trim' },
  { label: 'Keratin Treatment', category: 'hair', query: 'keratin' },
  { label: 'Body Massage', category: 'spa', query: 'massage' },
  { label: 'Waxing', category: 'waxing', query: 'waxing' },
  { label: "Men's Haircut", category: 'mens', query: 'mens haircut' },
]
