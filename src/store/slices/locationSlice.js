import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import locationService from '@/services/locationService'
import { getDefaultCityCoords } from '@/constants/locationData'
import {
  isGeolocationSupported,
  readCachedLocation,
  requestBrowserLocation,
  clearCachedLocation,
  writeCachedLocation,
} from '@/utils/geolocation'
import {
  readSelectedLocation,
  writeSelectedLocation,
  getDefaultLocationFallback,
} from '@/utils/selectedLocation'
import { findCityInList, findStateInList } from '@/utils/locationUtils'

function mapCityFromApi(city) {
  if (!city) return null
  return {
    id: city.id,
    slug: city.slug,
    name: city.name,
    latitude: city.latitude,
    longitude: city.longitude,
    tier: city.tier,
    active: city.active,
  }
}

function mapStateFromApi(state) {
  if (!state) return null
  return {
    id: state.id,
    name: state.name,
    code: state.code,
    capital: state.capital,
  }
}

function persistSelection(state) {
  if (state.selectedState && state.selectedCity) {
    writeSelectedLocation({
      state: state.selectedState,
      city: state.selectedCity,
      coords: state.coords,
    })
  }
}

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

export const fetchStates = createAsyncThunk(
  'location/fetchStates',
  async (_, { rejectWithValue }) => {
    try {
      const data = await locationService.getStates()
      return data.states || []
    } catch (err) {
      return rejectWithValue(err.message || 'Could not load states')
    }
  }
)

export const fetchCitiesByState = createAsyncThunk(
  'location/fetchCities',
  async (stateId, { rejectWithValue }) => {
    try {
      return await locationService.getCitiesByState(stateId)
    } catch (err) {
      return rejectWithValue(err.message || 'Could not load cities')
    }
  }
)

export const syncLocationFromQuery = createAsyncThunk(
  'location/syncFromQuery',
  async ({ city, state }, { rejectWithValue }) => {
    try {
      const statesData = await locationService.getStates()
      const stateList = statesData.states || []
      const stateMatch = findStateInList(stateList, {
        name: state,
        code: state,
      })
      if (!stateMatch) return rejectWithValue('State not found')

      const citiesData = await locationService.getCitiesByState(stateMatch.id)
      const cityMatch = findCityInList(citiesData.cities || [], {
        slug: city,
        name: city,
      })

      return {
        state: stateMatch,
        city: cityMatch,
        cities: citiesData.cities || [],
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Could not sync location')
    }
  }
)

export const detectAndResolveLocation = createAsyncThunk(
  'location/detectAndResolve',
  async (options = {}, { rejectWithValue }) => {
    const { force = false } = options
    const { lat: defaultLat, lng: defaultLng } = getDefaultCityCoords()

    try {
      let coords
      try {
        const cached = readCachedLocation()
        coords = cached || await requestBrowserLocation()
        if (!cached) writeCachedLocation(coords)
      } catch {
        const resolved = await locationService.resolve(defaultLat, defaultLng)
        return {
          force,
          usedFallback: true,
          coords: { lat: defaultLat, lng: defaultLng },
          state: resolved.state,
          city: resolved.city,
        }
      }

      const resolved = await locationService.resolve(coords.lat, coords.lng)
      return {
        force,
        usedFallback: false,
        coords: { lat: coords.lat, lng: coords.lng, accuracy: coords.accuracy },
        state: resolved.state,
        city: resolved.city,
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Could not detect location')
    }
  }
)

const stored = readSelectedLocation()
const cached = readCachedLocation()
const defaultFallback = getDefaultLocationFallback()

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    coords: stored?.coords || cached,
    status: (stored?.coords || cached) ? 'granted' : 'idle',
    error: null,
    prompted: false,
    supported: isGeolocationSupported(),
    states: [],
    cities: [],
    statesLoading: false,
    citiesLoading: false,
    pendingCitiesStateId: null,
    detecting: false,
    selectedState: stored?.state || null,
    selectedCity: stored?.city || null,
    autoDetected: false,
    locationManuallySet: Boolean(stored?.city),
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
    setSelectedCity: (state, action) => {
      const city = mapCityFromApi(action.payload) || action.payload
      state.selectedCity = city
      if (city?.latitude != null && city?.longitude != null) {
        state.coords = { lat: city.latitude, lng: city.longitude }
        state.status = 'granted'
      }
      state.autoDetected = false
      state.locationManuallySet = true
      persistSelection(state)
    },
    setSelectedState: (state, action) => {
      state.selectedState = mapStateFromApi(action.payload) || action.payload
      state.selectedCity = null
      state.cities = []
      state.citiesLoading = true
      state.locationManuallySet = true
    },
    applyDefaultLocation: (state) => {
      state.selectedState = { code: defaultFallback.state.code, name: defaultFallback.state.name }
      state.selectedCity = mapCityFromApi(defaultFallback.city)
      state.coords = defaultFallback.coords
      state.status = 'granted'
      persistSelection(state)
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
      .addCase(fetchStates.pending, (state) => { state.statesLoading = true })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.statesLoading = false
        state.states = action.payload
        if (state.selectedState) {
          const matched = findStateInList(action.payload, state.selectedState)
          if (matched) state.selectedState = mapStateFromApi(matched)
        }
      })
      .addCase(fetchStates.rejected, (state) => { state.statesLoading = false })
      .addCase(fetchCitiesByState.pending, (state, action) => {
        state.citiesLoading = true
        state.pendingCitiesStateId = action.meta.arg
      })
      .addCase(fetchCitiesByState.fulfilled, (state, action) => {
        const requestedStateId = Number(action.meta.arg)
        if (requestedStateId !== Number(state.selectedState?.id)) {
          return
        }
        state.citiesLoading = false
        state.pendingCitiesStateId = null
        state.cities = (action.payload.cities || []).map(mapCityFromApi)
        if (action.payload.state) {
          state.selectedState = mapStateFromApi(action.payload.state)
        }
        if (state.selectedCity) {
          const matched = findCityInList(state.cities, state.selectedCity)
          if (matched) state.selectedCity = matched
        }
      })
      .addCase(fetchCitiesByState.rejected, (state, action) => {
        if (Number(action.meta.arg) !== Number(state.selectedState?.id)) {
          return
        }
        state.citiesLoading = false
        state.pendingCitiesStateId = null
      })
      .addCase(detectAndResolveLocation.pending, (state) => {
        state.detecting = true
        state.error = null
      })
      .addCase(detectAndResolveLocation.fulfilled, (state, action) => {
        state.detecting = false
        const force = action.payload?.force || action.meta.arg?.force
        if (state.locationManuallySet && !force) {
          return
        }
        const { usedFallback, coords, state: st, city } = action.payload
        const mappedCity = mapCityFromApi(city)
        const mappedState = mapStateFromApi(st)

        state.selectedState = mappedState
        state.selectedCity = mappedCity
        state.coords = usedFallback
          ? { lat: mappedCity.latitude, lng: mappedCity.longitude }
          : coords
        state.status = usedFallback ? 'denied' : 'granted'
        state.autoDetected = !usedFallback
        state.locationManuallySet = false
        persistSelection(state)
      })
      .addCase(detectAndResolveLocation.rejected, (state, action) => {
        state.detecting = false
        state.error = action.payload
        if (!state.selectedCity) {
          state.selectedState = { code: defaultFallback.state.code, name: defaultFallback.state.name }
          state.selectedCity = mapCityFromApi(defaultFallback.city)
          state.coords = defaultFallback.coords
        }
      })
      .addCase(syncLocationFromQuery.fulfilled, (state, action) => {
        const { state: st, city, cities } = action.payload
        if (st) state.selectedState = mapStateFromApi(st)
        if (cities) state.cities = cities.map(mapCityFromApi)
        if (city) {
          state.selectedCity = mapCityFromApi(city)
          if (city.latitude != null && city.longitude != null) {
            state.coords = { lat: city.latitude, lng: city.longitude }
            state.status = 'granted'
          }
          state.locationManuallySet = true
          persistSelection(state)
        }
      })
  },
})

export const {
  setLocationPrompted,
  clearUserLocation,
  setSelectedCity,
  setSelectedState,
  applyDefaultLocation,
} = locationSlice.actions
export default locationSlice.reducer
