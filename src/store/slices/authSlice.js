import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '@/services/authService'

// ── Async thunks — call https://api.salonbazar.shop ──────────

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password)
      authService.saveTokens(data.token, data.refreshToken)
      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await authService.register(formData)
      authService.saveTokens(data.token, data.refreshToken)
      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const data = await authService.verifyOTP(phone, otp)
      authService.saveTokens(data.token, data.refreshToken)
      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (idToken, { rejectWithValue }) => {
    try {
      const data = await authService.googleLogin(idToken)
      authService.saveTokens(data.token, data.refreshToken)
      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    try { await authService.logout() } catch {}
    authService.clearTokens()
  }
)

// ── Slice ─────────────────────────────────────────────────────
const initialState = {
  user:            null,
  isAuthenticated: false,
  role:            null,   // 'customer' | 'shop_owner' | 'admin'
  loading:         false,
  error:           null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true
      state.user            = action.payload.user
      state.role            = action.payload.role
      state.loading         = false
    },
    logout: (state) => {
      state.user            = null
      state.isAuthenticated = false
      state.role            = null
      authService.clearTokens()
    },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    const pending   = (state) => { state.loading = true; state.error = null }
    const fulfilled = (state, action) => {
      state.loading         = false
      state.isAuthenticated = true
      state.user            = action.payload?.user
      state.role            = action.payload?.role || 'customer'
    }
    const rejected  = (state, action) => { state.loading = false; state.error = action.payload }

    builder
      .addCase(loginUser.pending,     pending)
      .addCase(loginUser.fulfilled,   fulfilled)
      .addCase(loginUser.rejected,    rejected)
      .addCase(registerUser.pending,  pending)
      .addCase(registerUser.fulfilled,fulfilled)
      .addCase(registerUser.rejected, rejected)
      .addCase(verifyOTP.pending,     pending)
      .addCase(verifyOTP.fulfilled,   fulfilled)
      .addCase(verifyOTP.rejected,    rejected)
      .addCase(googleLogin.pending,   pending)
      .addCase(googleLogin.fulfilled, fulfilled)
      .addCase(googleLogin.rejected,  rejected)
      .addCase(logoutUser.fulfilled,  (state) => {
        state.user = null; state.isAuthenticated = false; state.role = null
      })
  },
})

export const { loginSuccess, logout, clearError } = authSlice.actions
export default authSlice.reducer
