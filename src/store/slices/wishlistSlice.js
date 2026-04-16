import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] },
  reducers: {
    toggleWishlist: (state, action) => {
      const idx = state.items.findIndex(id => id === action.payload)
      if (idx >= 0) state.items.splice(idx, 1)
      else state.items.push(action.payload)
    },
  },
})

export const { toggleWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
