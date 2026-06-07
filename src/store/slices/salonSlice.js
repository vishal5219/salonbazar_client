import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import salonService from '@/services/salonService'

export const fetchFeaturedSalons = createAsyncThunk('salons/fetchFeatured', async (_, { rejectWithValue }) => {
  try { return await salonService.getFeatured() } catch (err) { return rejectWithValue(err.message) }
})
export const fetchNearbySalons = createAsyncThunk('salons/fetchNearby', async (params = {}, { rejectWithValue }) => {
  try { return await salonService.getNearby(params.lat, params.lng, params.radius) } catch (err) { return rejectWithValue(err.message) }
})
export const fetchAllSalons = createAsyncThunk('salons/fetchAll', async (params = {}, { rejectWithValue }) => {
  try { return await salonService.getAll(params) } catch (err) { return rejectWithValue(err.message) }
})
export const fetchSalonById = createAsyncThunk('salons/fetchById', async (id, { rejectWithValue }) => {
  try { return await salonService.getById(id) } catch (err) { return rejectWithValue(err.message) }
})
export const searchSalons = createAsyncThunk('salons/search', async ({ query, filters }, { rejectWithValue }) => {
  try { return await salonService.search(query, filters) } catch (err) { return rejectWithValue(err.message) }
})

const initialState = {
  salons: [],
  featuredSalons: [],
  nearbySalons: [],
  selectedSalon: null,
  loading: false,
  error: null,
  filters: { location: '', priceRange: [0, 5000], rating: 0, category: '' },
  searchQuery: '',
  pagination: { page: 1, limit: 12, total: 0 },
}

const salonSlice = createSlice({
  name: 'salons',
  initialState,
  reducers: {
    setSelectedSalon: (state, action) => { state.selectedSalon = action.payload },
    setSearchQuery:   (state, action) => { state.searchQuery   = action.payload },
    setFilters:       (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    clearFilters:     (state)         => { state.filters = initialState.filters; state.searchQuery = '' },
    setPage:          (state, action) => { state.pagination.page = action.payload },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSalons.pending,       (s) => { s.loading = true })
      .addCase(fetchAllSalons.fulfilled,     (s, a) => { s.loading = false; s.salons = a.payload.salons || a.payload; s.pagination.total = a.payload.total || 0 })
      .addCase(fetchAllSalons.rejected,      (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchFeaturedSalons.pending,   (s) => { s.loading = true })
      .addCase(fetchFeaturedSalons.fulfilled,(s, a) => { s.loading = false; s.featuredSalons = a.payload.salons || a.payload })
      .addCase(fetchFeaturedSalons.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchNearbySalons.pending,   (s) => { s.loading = true })
      .addCase(fetchNearbySalons.fulfilled, (s, a) => { s.loading = false; s.nearbySalons   = a.payload.salons || a.payload })
      .addCase(fetchNearbySalons.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchSalonById.pending,       (s, a) => {
        s.loading = true
        if (s.selectedSalon?.id !== parseInt(a.meta.arg, 10)) s.selectedSalon = null
      })
      .addCase(fetchSalonById.fulfilled,     (s, a) => { s.loading = false; s.selectedSalon = a.payload })
      .addCase(fetchSalonById.rejected,      (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(searchSalons.fulfilled,       (s, a) => { s.salons = a.payload.salons || a.payload })
  },
})

export const { setSelectedSalon, setSearchQuery, setFilters, clearFilters, setPage } = salonSlice.actions
export default salonSlice.reducer
