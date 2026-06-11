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
      return {
        queue: result.queue || [],
        completedToday: result.completedToday,
      }
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

export const updateQueueEntry = createAsyncThunk(
  'dashboard/updateQueueEntry',
  async ({ entryId, ...fields }, { getState, rejectWithValue }) => {
    try {
      const salonId = getState().dashboard.salonId || getState().auth.user?.salonId || 1
      const payload = {}
      if (fields.customerName !== undefined) payload.customer_name = fields.customerName
      if (fields.phone !== undefined) payload.phone = fields.phone
      if (fields.service !== undefined) payload.service_name = fields.service
      if (fields.serviceId !== undefined) payload.service_id = fields.serviceId
      if (fields.staffName !== undefined) payload.staff_name = fields.staffName
      if (fields.duration !== undefined) payload.duration = fields.duration
      if (fields.status !== undefined) payload.status = fields.status

      const result = await queueService.updateEntry(salonId, entryId, payload)
      return {
        queue: result.queue || [],
        completedToday: result.completedToday,
      }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const removeQueueEntry = createAsyncThunk(
  'dashboard/removeQueueEntry',
  async (entryId, { getState, rejectWithValue }) => {
    try {
      const salonId = getState().dashboard.salonId || getState().auth.user?.salonId || 1
      const result = await queueService.removeEntry(salonId, entryId)
      return result.queue || []
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const reorderQueue = createAsyncThunk(
  'dashboard/reorderQueue',
  async (order, { getState, rejectWithValue }) => {
    try {
      const salonId = getState().dashboard.salonId || getState().auth.user?.salonId || 1
      const result = await queueService.reorder(salonId, order)
      return result.queue || []
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
  queueStats:   { completedToday: 0 },
  bookings:     [],
  earnings:     null,
  analytics:    null,
  loading:      false,
  queueLoading: false,
  error:        null,
}

function applyQueueMutation(s, payload) {
  if (payload?.queue) s.queue = payload.queue
  if (payload?.completedToday != null) {
    s.queueStats = { ...s.queueStats, completedToday: payload.completedToday }
  }
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
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
        s.queue      = a.payload.queue || []
        s.queueStats = a.payload.queueStats || { completedToday: 0 }
        s.bookings   = a.payload.bookings || []
        s.earnings   = a.payload.earnings || null
        s.analytics  = a.payload.analytics || null
      })
      .addCase(fetchDashboard.rejected,  (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(advanceQueue.pending,   s => { s.queueLoading = true })
      .addCase(advanceQueue.fulfilled, (s, a) => {
        s.queueLoading = false
        if (a.payload?.queue) {
          applyQueueMutation(s, a.payload)
        } else if (Array.isArray(a.payload) && a.payload.length) {
          s.queue = a.payload
        } else {
          const inProgressIdx = s.queue.findIndex(q => q.status === 'in_progress')
          if (inProgressIdx >= 0) s.queue[inProgressIdx].status = 'completed'
          const nextWaiting = s.queue.find(q => q.status === 'waiting')
          if (nextWaiting) nextWaiting.status = 'in_progress'
          s.queue = s.queue.filter(q => q.status !== 'completed')
            .map((q, i) => ({ ...q, position: i + 1 }))
          s.queueStats.completedToday = (s.queueStats.completedToday || 0) + 1
        }
      })
      .addCase(advanceQueue.rejected,  s => { s.queueLoading = false })

      .addCase(addManualCustomer.fulfilled, (s, a) => {
        const newEntry = { ...a.payload, position: s.queue.length + 1 }
        s.queue.push(newEntry)
      })

      .addCase(updateQueueEntry.pending,   s => { s.queueLoading = true })
      .addCase(updateQueueEntry.fulfilled, (s, a) => {
        s.queueLoading = false
        applyQueueMutation(s, a.payload)
      })
      .addCase(updateQueueEntry.rejected, s => { s.queueLoading = false })

      .addCase(removeQueueEntry.pending,   s => { s.queueLoading = true })
      .addCase(removeQueueEntry.fulfilled, (s, a) => {
        s.queueLoading = false
        if (a.payload?.length !== undefined) s.queue = a.payload
      })
      .addCase(removeQueueEntry.rejected, s => { s.queueLoading = false })

      .addCase(reorderQueue.pending,   s => { s.queueLoading = true })
      .addCase(reorderQueue.fulfilled, (s, a) => {
        s.queueLoading = false
        if (a.payload?.length) s.queue = a.payload
      })
      .addCase(reorderQueue.rejected, s => { s.queueLoading = false })

      .addCase(updateBookingStatus.fulfilled, (s, a) => {
        const b = s.bookings.find(b => b.id === a.payload.bookingId)
        if (b) b.status = a.payload.status
      })
  },
})

export const { removeFromQueue, markCompleted } = dashboardSlice.actions
export default dashboardSlice.reducer
