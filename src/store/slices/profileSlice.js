import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '@/services/userService'

export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const [profile, bookings, wishlistSalons] = await Promise.all([
        userService.getProfile(),
        userService.getBookings(),
        userService.getWishlist(),
      ])
      return {
        bookings,
        wishlistSalons: wishlistSalons || [],
        loyaltyPoints: profile.loyaltyPoints || 0,
        totalSpent: profile.totalSpent || 0,
        totalVisits: profile.totalVisits || 0,
      }
    } catch (err) { return rejectWithValue(err.message) }
  }
)

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (data, { rejectWithValue }) => {
    try {
      return await userService.updateProfile(data)
    } catch (err) { return rejectWithValue(err.message) }
  }
)

export const cancelBooking = createAsyncThunk(
  'profile/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      await userService.cancelBooking(bookingId)
      return bookingId
    } catch (err) { return rejectWithValue(err.message) }
  }
)

export const submitReview = createAsyncThunk(
  'profile/submitReview',
  async ({ bookingId, salonId, rating, text, serviceName }, { rejectWithValue }) => {
    try {
      await userService.submitReview(salonId, { rating, text, serviceName })
      return { bookingId, rating, text }
    } catch (err) { return rejectWithValue(err.message) }
  }
)

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
    activeTab:      'bookings',
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
