import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ── Mock data generators ──────────────────────────────────────
const mockQueue = [
    { id: 'q1', position: 1, customerName: 'Rohan Mehta',   phone: '98765 43210', service: 'Haircut & Styling',   duration: 45, status: 'in_progress', joinedAt: '10:02 AM', estimatedTime: 'Now',     staffName: 'Rohan Shah',  bookingType: 'qr'     },
    { id: 'q2', position: 2, customerName: 'Priya Patel',   phone: '87654 32109', service: 'Gold Radiance Facial', duration: 75, status: 'waiting',     joinedAt: '10:15 AM', estimatedTime: '10:47 AM', staffName: 'Priya Nair',  bookingType: 'online' },
    { id: 'q3', position: 3, customerName: 'Arjun Desai',   phone: '76543 21098', service: 'Hair Color (Global)', duration: 120,status: 'waiting',     joinedAt: '10:28 AM', estimatedTime: '12:02 PM', staffName: 'Meera Kapoor',bookingType: 'manual' },
    { id: 'q4', position: 4, customerName: 'Sneha Joshi',   phone: '65432 10987', service: 'Manicure (Classic)',  duration: 45, status: 'waiting',     joinedAt: '10:41 AM', estimatedTime: '12:47 PM', staffName: 'Arjun Mehta', bookingType: 'online' },
    { id: 'q5', position: 5, customerName: 'Kiran Shah',    phone: '54321 09876', service: 'Head Massage',        duration: 30, status: 'waiting',     joinedAt: '10:55 AM', estimatedTime: '01:32 PM', staffName: 'Sneha Joshi', bookingType: 'qr'     },
  ]
  
  const mockBookings = [
    { id: 'b1', customerName: 'Ananya Singh',  service: 'Bridal Makeup',        time: '11:00 AM', date: 'Today',    status: 'confirmed', amount: 7999, bookingType: 'online', phone: '99887 76655' },
    { id: 'b2', customerName: 'Devraj Kumar',  service: 'Haircut & Styling',    time: '11:45 AM', date: 'Today',    status: 'confirmed', amount: 499,  bookingType: 'online', phone: '88776 65544' },
    { id: 'b3', customerName: 'Kavya Reddy',   service: 'Hair Spa',             time: '02:00 PM', date: 'Today',    status: 'pending',   amount: 799,  bookingType: 'online', phone: '77665 54433' },
    { id: 'b4', customerName: 'Rahul Verma',   service: 'Swedish Massage',      time: '03:30 PM', date: 'Today',    status: 'confirmed', amount: 1299, bookingType: 'online', phone: '66554 43322' },
    { id: 'b5', customerName: 'Nisha Mehta',   service: 'Gel Extension',        time: '05:00 PM', date: 'Today',    status: 'confirmed', amount: 1299, bookingType: 'qr',     phone: '55443 32211' },
    { id: 'b6', customerName: 'Vikram Sharma', service: 'Anti-Aging Treatment', time: '10:00 AM', date: 'Tomorrow', status: 'confirmed', amount: 2199, bookingType: 'online', phone: '44332 21100' },
  ]
  
  const mockEarnings = {
    today:    18400,
    yesterday:21200,
    thisWeek: 84600,
    thisMonth:312000,
    trend: '+12%',
  }
  
  const mockAnalytics = {
    peakHours: [
      { hour: '9AM',  count: 2  },
      { hour: '10AM', count: 6  },
      { hour: '11AM', count: 8  },
      { hour: '12PM', count: 5  },
      { hour: '1PM',  count: 4  },
      { hour: '2PM',  count: 7  },
      { hour: '3PM',  count: 9  },
      { hour: '4PM',  count: 6  },
      { hour: '5PM',  count: 5  },
      { hour: '6PM',  count: 3  },
      { hour: '7PM',  count: 2  },
    ],
    weeklyRevenue: [
      { day: 'Mon', revenue: 12400 },
      { day: 'Tue', revenue: 18200 },
      { day: 'Wed', revenue: 15600 },
      { day: 'Thu', revenue: 21300 },
      { day: 'Fri', revenue: 24100 },
      { day: 'Sat', revenue: 28400 },
      { day: 'Sun', revenue: 18400 },
    ],
    topServices: [
      { name: 'Haircut & Styling',  bookings: 48, revenue: 23952 },
      { name: 'Hair Color',         bookings: 22, revenue: 32978 },
      { name: 'Facial',             bookings: 19, revenue: 17081 },
      { name: 'Bridal Makeup',      bookings: 6,  revenue: 47994 },
      { name: 'Massage',            bookings: 15, revenue: 19485 },
    ],
    staffPerformance: [
      { name: 'Meera Kapoor', bookings: 38, revenue: 56200, rating: 4.9 },
      { name: 'Priya Nair',   bookings: 32, revenue: 82400, rating: 4.9 },
      { name: 'Rohan Shah',   bookings: 41, revenue: 21000, rating: 4.8 },
      { name: 'Sneha Joshi',  bookings: 29, revenue: 37700, rating: 4.8 },
      { name: 'Arjun Mehta',  bookings: 24, revenue: 31200, rating: 4.7 },
    ],
  }
  
  // ── Async thunks ──────────────────────────────────────────────
  export const fetchDashboard = createAsyncThunk(
    'dashboard/fetchAll',
    async (salonId, { rejectWithValue }) => {
      try {
        await new Promise(r => setTimeout(r, 700))
        return { queue: mockQueue, bookings: mockBookings, earnings: mockEarnings, analytics: mockAnalytics }
      } catch (err) {
        return rejectWithValue(err.message)
      }
    }
  )
  
  export const advanceQueue = createAsyncThunk(
    'dashboard/advanceQueue',
    async (_, { getState, rejectWithValue }) => {
      try {
        await new Promise(r => setTimeout(r, 400))
        return true
      } catch (err) {
        return rejectWithValue(err.message)
      }
    }
  )
  
  export const addManualCustomer = createAsyncThunk(
    'dashboard/addManual',
    async (customerData, { rejectWithValue }) => {
      try {
        await new Promise(r => setTimeout(r, 500))
        return {
          id:           `q${Date.now()}`,
          position:     99,
          customerName: customerData.name,
          phone:        customerData.phone || '',
          service:      customerData.service,
          duration:     customerData.duration || 45,
          status:       'waiting',
          joinedAt:     new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          estimatedTime:'TBD',
          staffName:    customerData.staff || 'Any Available',
          bookingType:  'manual',
        }
      } catch (err) {
        return rejectWithValue(err.message)
      }
    }
  )
  
  export const updateBookingStatus = createAsyncThunk(
    'dashboard/updateBookingStatus',
    async ({ bookingId, status }, { rejectWithValue }) => {
      try {
        await new Promise(r => setTimeout(r, 300))
        return { bookingId, status }
      } catch (err) {
        return rejectWithValue(err.message)
      }
    }
  )
  
  // ── Slice ─────────────────────────────────────────────────────
  const initialState = {
    queue:        [],
    bookings:     [],
    earnings:     null,
    analytics:    null,
    loading:      false,
    queueLoading: false,
    error:        null,
    activeView:   'overview', // 'overview' | 'queue' | 'bookings' | 'analytics' | 'walkin'
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
          s.queue     = a.payload.queue
          s.bookings  = a.payload.bookings
          s.earnings  = a.payload.earnings
          s.analytics = a.payload.analytics
        })
        .addCase(fetchDashboard.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
  
        .addCase(advanceQueue.pending,   s => { s.queueLoading = true })
        .addCase(advanceQueue.fulfilled, s => {
          s.queueLoading = false
          // Mark current in_progress as completed, promote next waiting
          const inProgressIdx = s.queue.findIndex(q => q.status === 'in_progress')
          if (inProgressIdx >= 0) s.queue[inProgressIdx].status = 'completed'
          const nextWaiting = s.queue.find(q => q.status === 'waiting')
          if (nextWaiting) nextWaiting.status = 'in_progress'
          s.queue = s.queue.filter(q => q.status !== 'completed')
            .map((q, i) => ({ ...q, position: i + 1 }))
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