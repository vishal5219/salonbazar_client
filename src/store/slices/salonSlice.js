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

const mockSalons = [
  { id: 1, name: 'Aura & Co.', category: 'Premium Unisex Salon', rating: 4.9, reviews: 312, location: 'Navrangpura, Ahmedabad', distance: '0.8 km', price: '₹499', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', tags: ['Hair', 'Skin', 'Bridal'], isOpen: true, waitTime: '~12 min', featured: true },
  { id: 2, name: 'The Blade Studio', category: "Men's Grooming Lounge", rating: 4.8, reviews: 197, location: 'Satellite, Ahmedabad', distance: '1.2 km', price: '₹349', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80', tags: ['Haircut', 'Beard', 'Spa'], isOpen: true, waitTime: '~5 min', featured: true },
  { id: 3, name: 'Lumière Beauty', category: 'Ladies Boutique Salon', rating: 4.7, reviews: 243, location: 'Vastrapur, Ahmedabad', distance: '2.1 km', price: '₹599', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', tags: ['Bridal', 'Makeup', 'Hair'], isOpen: false, waitTime: null, featured: false },
  { id: 4, name: 'Velvet Grooming', category: "Luxury Men's Barbershop", rating: 4.9, reviews: 156, location: 'Bodakdev, Ahmedabad', distance: '1.8 km', price: '₹799', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', tags: ['Haircut', 'Shave', 'Facial'], isOpen: true, waitTime: '~20 min', featured: false },
  { id: 5, name: 'Zen Wellness', category: 'Spa & Salon', rating: 4.6, reviews: 289, location: 'Prahlad Nagar, Ahmedabad', distance: '3.0 km', price: '₹450', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', tags: ['Spa', 'Skin', 'Massage'], isOpen: true, waitTime: '~8 min', featured: false },
  { id: 6, name: 'Amore Salon', category: 'Premium Unisex', rating: 4.5, reviews: 178, location: 'Maninagar, Ahmedabad', distance: '4.2 km', price: '₹299', image: 'https://images.unsplash.com/photo-1626957341926-98752fc2ba99?w=600&q=80', tags: ['Hair', 'Nails', 'Waxing'], isOpen: true, waitTime: '~3 min', featured: false },
]

const initialState = {
  salons: mockSalons,
  featuredSalons: mockSalons.filter(s => s.featured),
  nearbySalons: mockSalons,
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
      .addCase(fetchFeaturedSalons.fulfilled,(s, a) => { s.featuredSalons = a.payload.salons || a.payload })
      .addCase(fetchNearbySalons.fulfilled,  (s, a) => { s.nearbySalons   = a.payload.salons || a.payload })
      .addCase(fetchSalonById.pending,       (s) => { s.loading = true })
      .addCase(fetchSalonById.fulfilled,     (s, a) => { s.loading = false; s.selectedSalon = a.payload })
      .addCase(fetchSalonById.rejected,      (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(searchSalons.fulfilled,       (s, a) => { s.salons = a.payload.salons || a.payload })
  },
})

export const { setSelectedSalon, setSearchQuery, setFilters, clearFilters, setPage } = salonSlice.actions
export default salonSlice.reducer
