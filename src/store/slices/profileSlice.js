import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ── Mock booking history ──────────────────────────────────────
const MOCK_BOOKINGS = [
  {
    id: 'SB-A1B2C3',
    salonName: 'Aura & Co.',
    salonImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=120&q=80',
    salonId: 1,
    serviceName: 'Hair Color (Global)',
    date: '15 Jan 2025',
    time: '11:00 AM',
    staffName: 'Meera Kapoor',
    amount: 1499,
    status: 'completed',
    paymentMethod: 'online',
    bookingType: 'online',
    canReview: true,
    reviewed: false,
  },
  {
    id: 'SB-D4E5F6',
    salonName: 'The Blade Studio',
    salonImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=120&q=80',
    salonId: 2,
    serviceName: 'Haircut & Styling',
    date: '8 Jan 2025',
    time: '02:30 PM',
    staffName: 'Any Available',
    amount: 499,
    status: 'completed',
    paymentMethod: 'counter',
    bookingType: 'qr',
    canReview: true,
    reviewed: true,
  },
  {
    id: 'SB-G7H8I9',
    salonName: 'Aura & Co.',
    salonImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=120&q=80',
    salonId: 1,
    serviceName: 'Gold Radiance Facial',
    date: '20 Feb 2025',
    time: '03:00 PM',
    staffName: 'Priya Nair',
    amount: 1599,
    status: 'upcoming',
    paymentMethod: 'online',
    bookingType: 'online',
    canReview: false,
    reviewed: false,
  },
  {
    id: 'SB-J1K2L3',
    salonName: 'Velvet Grooming',
    salonImage: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=120&q=80',
    salonId: 4,
    serviceName: 'Beard Shaping',
    date: '2 Dec 2024',
    time: '10:00 AM',
    staffName: 'Rohan Shah',
    amount: 349,
    status: 'cancelled',
    paymentMethod: 'online',
    bookingType: 'online',
    canReview: false,
    reviewed: false,
  },
  {
    id: 'SB-M4N5O6',
    salonName: 'Zen Wellness',
    salonImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=120&q=80',
    salonId: 5,
    serviceName: 'Swedish Massage (60 min)',
    date: '18 Nov 2024',
    time: '04:00 PM',
    staffName: 'Sneha Joshi',
    amount: 1299,
    status: 'completed',
    paymentMethod: 'counter',
    bookingType: 'qr',
    canReview: true,
    reviewed: false,
  },
]

const MOCK_WISHLIST_SALONS = [
  { id: 1, name: 'Aura & Co.', category: 'Premium Unisex Salon', rating: 4.9, reviews: 312, location: 'Navrangpura, Ahmedabad', distance: '0.8 km', price: '₹499', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', isOpen: true, waitTime: '~12 min' },
  { id: 2, name: 'The Blade Studio', category: "Men's Grooming Lounge", rating: 4.8, reviews: 197, location: 'Satellite, Ahmedabad', distance: '1.2 km', price: '₹349', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80', isOpen: true, waitTime: '~5 min' },
  { id: 4, name: 'Velvet Grooming', category: "Luxury Men's Barbershop", rating: 4.9, reviews: 156, location: 'Bodakdev, Ahmedabad', distance: '1.8 km', price: '₹799', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', isOpen: true, waitTime: '~20 min' },
]

// ── Async thunks ──────────────────────────────────────────────
export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(r => setTimeout(r, 600))
      return {
        bookings:       MOCK_BOOKINGS,
        wishlistSalons: MOCK_WISHLIST_SALONS,
        loyaltyPoints:  1240,
        totalSpent:     8745,
        totalVisits:    12,
      }
    } catch (err) { return rejectWithValue(err.message) }
  }
)

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (data, { rejectWithValue }) => {
    try {
      await new Promise(r => setTimeout(r, 800))
      return data
    } catch (err) { return rejectWithValue(err.message) }
  }
)

export const cancelBooking = createAsyncThunk(
  'profile/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      await new Promise(r => setTimeout(r, 500))
      return bookingId
    } catch (err) { return rejectWithValue(err.message) }
  }
)

export const submitReview = createAsyncThunk(
  'profile/submitReview',
  async ({ bookingId, rating, text }, { rejectWithValue }) => {
    try {
      await new Promise(r => setTimeout(r, 700))
      return { bookingId, rating, text }
    } catch (err) { return rejectWithValue(err.message) }
  }
)

// ── Slice ─────────────────────────────────────────────────────
const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    bookings:       [],
    wishlistSalons: [],
    loyaltyPoints:  0,
    totalSpent:     0,
    totalVisits:    0,
    loading:        false,
    saving:         false,
    error:          null,
    activeTab:      'bookings', // 'bookings' | 'wishlist' | 'settings'
  },
  reducers: {
    setActiveTab: (s, a) => { s.activeTab = a.payload },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProfile.pending,   s => { s.loading = true })
      .addCase(fetchProfile.fulfilled, (s, a) => {
        s.loading        = false
        s.bookings       = a.payload.bookings
        s.wishlistSalons = a.payload.wishlistSalons
        s.loyaltyPoints  = a.payload.loyaltyPoints
        s.totalSpent     = a.payload.totalSpent
        s.totalVisits    = a.payload.totalVisits
      })
      .addCase(fetchProfile.rejected,  (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(updateProfile.pending,   s => { s.saving = true })
      .addCase(updateProfile.fulfilled, s => { s.saving = false })
      .addCase(updateProfile.rejected,  (s, a) => { s.saving = false; s.error = a.payload })

      .addCase(cancelBooking.fulfilled, (s, a) => {
        const b = s.bookings.find(b => b.id === a.payload)
        if (b) b.status = 'cancelled'
      })

      .addCase(submitReview.fulfilled, (s, a) => {
        const b = s.bookings.find(b => b.id === a.payload.bookingId)
        if (b) b.reviewed = true
      })
  },
})

export const { setActiveTab } = profileSlice.actions
export default profileSlice.reducer