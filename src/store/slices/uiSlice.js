import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    authModalOpen: false,
    authModalTab: 'login', // 'login' | 'register'
    notification: null,
    mobileMenuOpen: false,
    searchOpen: false,
  },
  reducers: {
    openAuthModal: (state, action) => {
      state.authModalOpen = true
      state.authModalTab = action.payload || 'login'
    },
    closeAuthModal: (state) => { state.authModalOpen = false },
    setAuthModalTab: (state, action) => { state.authModalTab = action.payload },
    showNotification: (state, action) => { state.notification = action.payload },
    clearNotification: (state) => { state.notification = null },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen },
    closeMobileMenu: (state) => { state.mobileMenuOpen = false },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen },
  },
})

export const {
  openAuthModal, closeAuthModal, setAuthModalTab,
  showNotification, clearNotification,
  toggleMobileMenu, closeMobileMenu, toggleSearch,
} = uiSlice.actions
export default uiSlice.reducer
