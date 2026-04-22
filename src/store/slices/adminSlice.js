import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ── Rich mock data ────────────────────────────────────────────
const MOCK_SALONS = [
  { id: 1,  name: 'Aura & Co.',         city: 'Ahmedabad', category: 'Unisex',  owner: 'Sneha Patel',   phone: '+91 98765 43210', email: 'aura@example.com',     status: 'active',   plan: 'pro',     totalBookings: 312, monthRevenue: 84200, rating: 4.9, joinedDate: '15 Mar 2023', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=120&q=80' },
  { id: 2,  name: 'The Blade Studio',   city: 'Ahmedabad', category: "Men's",   owner: 'Arjun Mehta',   phone: '+91 87654 32109', email: 'blade@example.com',    status: 'active',   plan: 'basic',   totalBookings: 197, monthRevenue: 31800, rating: 4.8, joinedDate: '2 Jun 2023',  image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=120&q=80' },
  { id: 3,  name: 'Lumière Beauty',     city: 'Ahmedabad', category: 'Ladies',  owner: 'Priya Sharma',  phone: '+91 76543 21098', email: 'lumiere@example.com',  status: 'active',   plan: 'premium', totalBookings: 243, monthRevenue: 112000, rating: 4.7, joinedDate: '8 Jan 2023',  image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&q=80' },
  { id: 4,  name: 'Velvet Grooming',    city: 'Ahmedabad', category: "Men's",   owner: 'Rahul Verma',   phone: '+91 65432 10987', email: 'velvet@example.com',   status: 'active',   plan: 'pro',     totalBookings: 156, monthRevenue: 62400, rating: 4.9, joinedDate: '20 Aug 2023', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=120&q=80' },
  { id: 5,  name: 'Zen Wellness',       city: 'Ahmedabad', category: 'Unisex',  owner: 'Kavya Reddy',   phone: '+91 54321 09876', email: 'zen@example.com',      status: 'active',   plan: 'basic',   totalBookings: 289, monthRevenue: 48900, rating: 4.6, joinedDate: '5 Nov 2023',  image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=120&q=80' },
  { id: 6,  name: 'Amore Salon',        city: 'Ahmedabad', category: 'Unisex',  owner: 'Dev Kumar',     phone: '+91 43210 98765', email: 'amore@example.com',    status: 'pending',  plan: 'basic',   totalBookings: 0,   monthRevenue: 0,     rating: 0,   joinedDate: '10 Jan 2025', image: 'https://images.unsplash.com/photo-1626957341926-98752fc2ba99?w=120&q=80' },
  { id: 7,  name: 'Style Hub',          city: 'Surat',     category: 'Unisex',  owner: 'Meena Joshi',   phone: '+91 32109 87654', email: 'stylehub@example.com', status: 'active',   plan: 'pro',     totalBookings: 188, monthRevenue: 55600, rating: 4.5, joinedDate: '18 Apr 2023', image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=120&q=80' },
  { id: 8,  name: 'Glamour Zone',       city: 'Surat',     category: 'Ladies',  owner: 'Ritu Shah',     phone: '+91 21098 76543', email: 'glamour@example.com',  status: 'suspended',plan: 'basic',   totalBookings: 42,  monthRevenue: 0,     rating: 3.8, joinedDate: '2 Sep 2023',  image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&q=80' },
  { id: 9,  name: 'Trim & Style',       city: 'Vadodara',  category: "Men's",   owner: 'Vikas Patel',   phone: '+91 10987 65432', email: 'trim@example.com',     status: 'active',   plan: 'basic',   totalBookings: 134, monthRevenue: 22300, rating: 4.4, joinedDate: '12 Jul 2023', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80' },
  { id: 10, name: 'Royal Cuts',         city: 'Rajkot',    category: "Men's",   owner: 'Nikhil Rao',    phone: '+91 09876 54321', email: 'royal@example.com',    status: 'pending',  plan: 'pro',     totalBookings: 0,   monthRevenue: 0,     rating: 0,   joinedDate: '5 Jan 2025',  image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&q=80' },
]

const MOCK_USERS = [
  { id: 'u1', name: 'Ananya Patel',  email: 'ananya@example.com', phone: '+91 99887 76655', city: 'Ahmedabad', role: 'customer',   totalBookings: 8,  totalSpent: 12400, joinedDate: '10 Feb 2024', status: 'active'   },
  { id: 'u2', name: 'Devraj Kumar',  email: 'dev@example.com',    phone: '+91 88776 65544', city: 'Ahmedabad', role: 'customer',   totalBookings: 14, totalSpent: 7800,  joinedDate: '5 Mar 2024',  status: 'active'   },
  { id: 'u3', name: 'Kavya Sharma',  email: 'kavya@example.com',  phone: '+91 77665 54433', city: 'Surat',     role: 'customer',   totalBookings: 3,  totalSpent: 3200,  joinedDate: '20 Apr 2024', status: 'active'   },
  { id: 'u4', name: 'Rahul Mehta',   email: 'rahul@example.com',  phone: '+91 66554 43322', city: 'Vadodara',  role: 'customer',   totalBookings: 22, totalSpent: 34600, joinedDate: '1 Jan 2024',  status: 'active'   },
  { id: 'u5', name: 'Nisha Verma',   email: 'nisha@example.com',  phone: '+91 55443 32211', city: 'Ahmedabad', role: 'shop_owner', totalBookings: 0,  totalSpent: 0,     joinedDate: '15 Mar 2023', status: 'active'   },
  { id: 'u6', name: 'Spam Account',  email: 'spam@fake.com',      phone: '+91 00000 00000', city: 'Unknown',   role: 'customer',   totalBookings: 0,  totalSpent: 0,     joinedDate: '3 Jan 2025',  status: 'suspended'},
]

const MOCK_PLATFORM_STATS = {
  totalSalons:      { value: 250,      trend: '+18',    trendPct: '+7.7%'  },
  activeSalons:     { value: 238,      trend: '+12',    trendPct: '+5.3%'  },
  totalUsers:       { value: 52400,    trend: '+1240',  trendPct: '+2.4%'  },
  totalBookings:    { value: 18640,    trend: '+840',   trendPct: '+4.7%'  },
  monthRevenue:     { value: 4820000,  trend: '+640000',trendPct: '+15.3%' },
  platformCommission:{ value: 241000,  trend: '+32000', trendPct: '+15.3%' },
  avgRating:        { value: 4.7,      trend: '+0.1',   trendPct: '+2.2%'  },
  pendingApprovals: { value: 4,        trend: null,     trendPct: null     },
}

const MOCK_REVENUE_TREND = [
  { month: 'Aug', revenue: 2800000, commission: 140000 },
  { month: 'Sep', revenue: 3200000, commission: 160000 },
  { month: 'Oct', revenue: 3600000, commission: 180000 },
  { month: 'Nov', revenue: 3900000, commission: 195000 },
  { month: 'Dec', revenue: 4100000, commission: 205000 },
  { month: 'Jan', revenue: 4820000, commission: 241000 },
]

const MOCK_CITY_BREAKDOWN = [
  { city: 'Ahmedabad', salons: 142, bookings: 11200, revenue: 2980000 },
  { city: 'Surat',     salons: 48,  bookings: 3800,  revenue: 1020000 },
  { city: 'Vadodara',  salons: 34,  bookings: 2100,  revenue: 540000  },
  { city: 'Rajkot',    salons: 18,  bookings: 980,   revenue: 210000  },
  { city: 'Gandhinagar',salons: 8,  bookings: 560,   revenue: 70000   },
]

const MOCK_PLAN_BREAKDOWN = [
  { plan: 'Premium', salons: 28,  monthlyRevenue: 1680000, pct: 35 },
  { plan: 'Pro',     salons: 92,  monthlyRevenue: 2208000, pct: 46 },
  { plan: 'Basic',   salons: 130, monthlyRevenue: 932000,  pct: 19 },
]

const MOCK_RECENT_ACTIVITY = [
  { id: 'a1', type: 'salon_joined',   message: 'Amore Salon registered and awaiting approval',    time: '2 min ago',  icon: '🏪' },
  { id: 'a2', type: 'booking_spike',  message: 'Aura & Co. received 12 bookings in the last hour',time: '18 min ago', icon: '📈' },
  { id: 'a3', type: 'salon_joined',   message: 'Royal Cuts (Rajkot) submitted for review',        time: '1 hr ago',   icon: '🏪' },
  { id: 'a4', type: 'report',         message: 'User reported Glamour Zone for poor service',      time: '2 hr ago',   icon: '🚨' },
  { id: 'a5', type: 'payment',        message: '₹2,41,000 commission settled for January 2025',   time: '4 hr ago',   icon: '💰' },
  { id: 'a6', type: 'user_milestone', message: 'Platform crossed 52,000 registered customers',    time: '6 hr ago',   icon: '🎉' },
]

// ── Async thunks ──────────────────────────────────────────────
export const fetchAdminData = createAsyncThunk('admin/fetchAll', async (_, { rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 700))
    return {
      salons:           MOCK_SALONS,
      users:            MOCK_USERS,
      platformStats:    MOCK_PLATFORM_STATS,
      revenueTrend:     MOCK_REVENUE_TREND,
      cityBreakdown:    MOCK_CITY_BREAKDOWN,
      planBreakdown:    MOCK_PLAN_BREAKDOWN,
      recentActivity:   MOCK_RECENT_ACTIVITY,
    }
  } catch (err) { return rejectWithValue(err.message) }
})

export const updateSalonStatus = createAsyncThunk('admin/updateSalonStatus', async ({ salonId, status }, { rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 400))
    return { salonId, status }
  } catch (err) { return rejectWithValue(err.message) }
})

export const updateSalonPlan = createAsyncThunk('admin/updateSalonPlan', async ({ salonId, plan }, { rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 400))
    return { salonId, plan }
  } catch (err) { return rejectWithValue(err.message) }
})

export const updateUserStatus = createAsyncThunk('admin/updateUserStatus', async ({ userId, status }, { rejectWithValue }) => {
  try {
    await new Promise(r => setTimeout(r, 400))
    return { userId, status }
  } catch (err) { return rejectWithValue(err.message) }
})

// ── Slice ─────────────────────────────────────────────────────
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
    activeView:      'overview',  // overview | salons | users | analytics | settings
    salonSearch:     '',
    salonFilter:     'all',       // all | active | pending | suspended
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