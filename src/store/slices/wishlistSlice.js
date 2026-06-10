import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import wishlistService from '@/services/wishlistService'

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const salons = await wishlistService.getAll()
      return salons || []
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggle',
  async (salonId, { getState, rejectWithValue }) => {
    const { items } = getState().wishlist
    const isSaved = items.includes(salonId)

    try {
      if (isSaved) {
        await wishlistService.remove(salonId)
        return { salonId, action: 'remove' }
      }

      const data = await wishlistService.add(salonId)
      return { salonId, action: 'add', salon: data.salon }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const removeWishlistItem = createAsyncThunk(
  'wishlist/remove',
  async (salonId, { rejectWithValue }) => {
    try {
      await wishlistService.remove(salonId)
      return salonId
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    salons: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = []
      state.salons = []
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWishlist.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false
        state.salons = action.payload
        state.items = action.payload.map(s => s.id)
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        const { salonId, action: toggleAction, salon } = action.payload
        if (toggleAction === 'remove') {
          state.items = state.items.filter(id => id !== salonId)
          state.salons = state.salons.filter(s => s.id !== salonId)
        } else {
          state.items.push(salonId)
          if (salon) state.salons.push(salon)
        }
      })

      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        state.items = state.items.filter(id => id !== action.payload)
        state.salons = state.salons.filter(s => s.id !== action.payload)
      })
  },
})

export const { clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
