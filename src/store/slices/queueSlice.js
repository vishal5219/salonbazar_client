import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import queueService from '@/services/queueService'

export const fetchMyQueuePosition = createAsyncThunk(
  'queue/fetchMyPosition',
  async (salonId, { rejectWithValue }) => {
    try {
      const entry = await queueService.getMyPosition(salonId)
      return { salonId, entry: entry || null }
    } catch (err) {
      return rejectWithValue(err.message || 'Could not load queue position')
    }
  }
)

export const joinSalonQueue = createAsyncThunk(
  'queue/join',
  async ({ salonId, serviceId, serviceName }, { rejectWithValue }) => {
    try {
      const entry = await queueService.join(salonId, {
        service_id: serviceId || undefined,
        service_name: serviceName || undefined,
      })
      return { salonId, entry }
    } catch (err) {
      return rejectWithValue(err.message || 'Could not join queue')
    }
  }
)

export const leaveSalonQueue = createAsyncThunk(
  'queue/leave',
  async (salonId, { rejectWithValue }) => {
    try {
      await queueService.leave(salonId)
      return { salonId }
    } catch (err) {
      return rejectWithValue(err.message || 'Could not leave queue')
    }
  }
)

const queueSlice = createSlice({
  name: 'queue',
  initialState: {
    salonId: null,
    myEntry: null,
    loading: false,
    joining: false,
    leaving: false,
    error: null,
  },
  reducers: {
    clearQueueState: (state) => {
      state.salonId = null
      state.myEntry = null
      state.error = null
    },
    setMyEntry: (state, action) => {
      state.myEntry = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyQueuePosition.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyQueuePosition.fulfilled, (state, action) => {
        state.loading = false
        state.salonId = action.payload.salonId
        state.myEntry = action.payload.entry
      })
      .addCase(fetchMyQueuePosition.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(joinSalonQueue.pending, (state) => {
        state.joining = true
        state.error = null
      })
      .addCase(joinSalonQueue.fulfilled, (state, action) => {
        state.joining = false
        state.salonId = action.payload.salonId
        state.myEntry = action.payload.entry
      })
      .addCase(joinSalonQueue.rejected, (state, action) => {
        state.joining = false
        state.error = action.payload
      })
      .addCase(leaveSalonQueue.pending, (state) => {
        state.leaving = true
      })
      .addCase(leaveSalonQueue.fulfilled, (state, action) => {
        state.leaving = false
        if (String(state.salonId) === String(action.payload.salonId)) {
          state.myEntry = null
        }
      })
      .addCase(leaveSalonQueue.rejected, (state, action) => {
        state.leaving = false
        state.error = action.payload
      })
  },
})

export const { clearQueueState, setMyEntry } = queueSlice.actions
export default queueSlice.reducer
