import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import dashboardService from '@/services/dashboardService'
import queueService from '@/services/queueService'

export const fetchDashboard = createAsyncThunk(
  'dashboard/fetchAll',
  async (salonId, { rejectWithValue }) => {
    try {
      return await dashboardService.getDashboard(salonId)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const advanceQueue = createAsyncThunk(
  'dashboard/advanceQueue',
  async (_, { getState, rejectWithValue }) => {
    try {
      const salonId = getState().dashboard.salonId || getState().auth.user?.salonId || 1
      const result = await queueService.advance(salonId)
      return result.queue || []
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const addManualCustomer = createAsyncThunk(
  'dashboard/addManual',
  async ({ salonId, ...customerData }, { rejectWithValue }) => {
    try {
      return await queueService.manualAdd(salonId, {
        customer_name: customerData.name,
        phone: customerData.phone,
        service_name: customerData.service,
        service_id: customerData.serviceId,
      })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateBookingStatus = createAsyncThunk(
  'dashboard/updateBookingStatus',
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      return { bookingId, status }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const initialState = {
  salonId:      null,
  queue:        [],
  bookings:     [],
  earnings:     null,
  analytics:    null,
  loading:      false,
  queueLoading: false,
  error:        null,
  activeView:   'overview',
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setActiveView:    (s, a) => { s.activeView = a.payload },
    removeFromQueue:  (s, a) => {
      s.queue = s.queue.filter(q => q.id !== a.payload)
        .map((q, i) => ({ ...q, position: i + 1 }))
    },
    markCompleted: (s, a) => {
      s.queue = s.queue.map(q =>
        q.id === a.payload ? { ...q, status: 'completed' } : q
      )
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDashboard.pending,   s => { s.loading = true })
      .addCase(fetchDashboard.fulfilled, (s, a) => {
        s.loading   = false
        s.salonId   = a.meta.arg
        s.queue     = a.payload.queue || []
        s.bookings  = a.payload.bookings || []
        s.earnings  = a.payload.earnings || null
        s.analytics = a.payload.analytics || null
      })
      .addCase(fetchDashboard.rejected,  (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(advanceQueue.pending,   s => { s.queueLoading = true })
      .addCase(advanceQueue.fulfilled, (s, a) => {
        s.queueLoading = false
        if (a.payload?.length) {
          s.queue = a.payload
        } else {
          const inProgressIdx = s.queue.findIndex(q => q.status === 'in_progress')
          if (inProgressIdx >= 0) s.queue[inProgressIdx].status = 'completed'
          const nextWaiting = s.queue.find(q => q.status === 'waiting')
          if (nextWaiting) nextWaiting.status = 'in_progress'
          s.queue = s.queue.filter(q => q.status !== 'completed')
            .map((q, i) => ({ ...q, position: i + 1 }))
        }
      })
      .addCase(advanceQueue.rejected,  s => { s.queueLoading = false })

      .addCase(addManualCustomer.fulfilled, (s, a) => {
        const newEntry = { ...a.payload, position: s.queue.length + 1 }
        s.queue.push(newEntry)
      })

      .addCase(updateBookingStatus.fulfilled, (s, a) => {
        const b = s.bookings.find(b => b.id === a.payload.bookingId)
        if (b) b.status = a.payload.status
      })
  },
})

export const { setActiveView, removeFromQueue, markCompleted } = dashboardSlice.actions
export default dashboardSlice.reducer
