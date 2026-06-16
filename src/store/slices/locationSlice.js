import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  isGeolocationSupported,
  readCachedLocation,
  requestBrowserLocation,
  clearCachedLocation,
} from '@/utils/geolocation'

export const requestUserLocation = createAsyncThunk(
  'location/request',
  async (_, { rejectWithValue }) => {
    try {
      const cached = readCachedLocation()
      if (cached) return { ...cached, fromCache: true }
      const coords = await requestBrowserLocation()
      return { ...coords, fromCache: false }
    } catch (err) {
      return rejectWithValue(err.message || 'Could not get location')
    }
  }
)

const cached = readCachedLocation()

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    coords: cached,
    status: cached ? 'granted' : 'idle',
    error: null,
    prompted: false,
    supported: isGeolocationSupported(),
  },
  reducers: {
    setLocationPrompted: (state) => {
      state.prompted = true
    },
    clearUserLocation: (state) => {
      state.coords = null
      state.status = 'idle'
      state.error = null
      clearCachedLocation()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestUserLocation.pending, (state) => {
        state.status = 'requesting'
        state.error = null
      })
      .addCase(requestUserLocation.fulfilled, (state, action) => {
        state.status = 'granted'
        state.coords = {
          lat: action.payload.lat,
          lng: action.payload.lng,
          accuracy: action.payload.accuracy,
        }
        state.error = null
      })
      .addCase(requestUserLocation.rejected, (state, action) => {
        state.status = 'denied'
        state.error = action.payload
      })
  },
})

export const { setLocationPrompted, clearUserLocation } = locationSlice.actions
export default locationSlice.reducer
