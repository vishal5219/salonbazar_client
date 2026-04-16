import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../store/slices/authSlice'
import salonReducer from '../store/slices/salonSlice'
import bookingReducer from '../store/slices/bookingSlice'
import wishlistReducer from '../store/slices/wishlistSlice'
import uiReducer from '../store/slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    salons: salonReducer,
    booking: bookingReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
})

export default store
