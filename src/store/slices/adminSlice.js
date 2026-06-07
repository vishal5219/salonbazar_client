import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import adminService from '@/services/adminService'

export const fetchAdminData = createAsyncThunk('admin/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await adminService.getOverview()
  } catch (err) { return rejectWithValue(err.message) }
})

export const updateSalonStatus = createAsyncThunk('admin/updateSalonStatus', async ({ salonId, status }, { rejectWithValue }) => {
  try {
    await adminService.updateSalonStatus(salonId, status)
    return { salonId, status }
  } catch (err) { return rejectWithValue(err.message) }
})

export const updateSalonPlan = createAsyncThunk('admin/updateSalonPlan', async ({ salonId, plan }, { rejectWithValue }) => {
  try {
    return { salonId, plan }
  } catch (err) { return rejectWithValue(err.message) }
})

export const updateUserStatus = createAsyncThunk('admin/updateUserStatus', async ({ userId, status }, { rejectWithValue }) => {
  try {
    return { userId, status }
  } catch (err) { return rejectWithValue(err.message) }
})

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    salons:          [],
    users:           [],
    platformStats:   null,
    revenueTrend:    [],
    cityBreakdown:   [],
    planBreakdown:   [],
    recentActivity:  [],
    loading:         false,
    error:           null,
    activeView:      'overview',
    salonSearch:     '',
    salonFilter:     'all',
    userSearch:      '',
    userFilter:      'all',
    selectedSalon:   null,
  },
  reducers: {
    setActiveView:   (s, a) => { s.activeView = a.payload },
    setSalonSearch:  (s, a) => { s.salonSearch = a.payload },
    setSalonFilter:  (s, a) => { s.salonFilter = a.payload },
    setUserSearch:   (s, a) => { s.userSearch  = a.payload },
    setUserFilter:   (s, a) => { s.userFilter  = a.payload },
    setSelectedSalon:(s, a) => { s.selectedSalon = a.payload },
    clearSelectedSalon:(s)  => { s.selectedSalon = null },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAdminData.pending,   s => { s.loading = true })
      .addCase(fetchAdminData.fulfilled, (s, a) => {
        s.loading        = false
        s.salons         = a.payload.salons
        s.users          = a.payload.users
        s.platformStats  = a.payload.platformStats
        s.revenueTrend   = a.payload.revenueTrend
        s.cityBreakdown  = a.payload.cityBreakdown
        s.planBreakdown  = a.payload.planBreakdown
        s.recentActivity = a.payload.recentActivity
      })
      .addCase(fetchAdminData.rejected,  (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(updateSalonStatus.fulfilled, (s, a) => {
        const salon = s.salons.find(sl => sl.id === a.payload.salonId)
        if (salon) salon.status = a.payload.status
        if (s.selectedSalon?.id === a.payload.salonId) s.selectedSalon.status = a.payload.status
      })
      .addCase(updateSalonPlan.fulfilled, (s, a) => {
        const salon = s.salons.find(sl => sl.id === a.payload.salonId)
        if (salon) salon.plan = a.payload.plan
        if (s.selectedSalon?.id === a.payload.salonId) s.selectedSalon.plan = a.payload.plan
      })
      .addCase(updateUserStatus.fulfilled, (s, a) => {
        const user = s.users.find(u => u.id === a.payload.userId)
        if (user) user.status = a.payload.status
      })
  },
})

export const {
  setActiveView, setSalonSearch, setSalonFilter,
  setUserSearch, setUserFilter, setSelectedSalon, clearSelectedSalon,
} = adminSlice.actions
export default adminSlice.reducer
