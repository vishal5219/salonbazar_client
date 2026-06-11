import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { closeAuthModal, setAuthModalTab, showNotification } from '@/store/slices/uiSlice'
import { loginUser, registerUser } from '@/store/slices/authSlice'
import { ROLES } from '@/constants/roles'
import { getPostAuthPath } from '@/utils/authRedirect'
import styles from './AuthModal.module.css'

export default function AuthModal() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { authModalOpen, authModalTab } = useSelector(s => s.ui)
  const { loading } = useSelector(s => s.auth)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', accountType: ROLES.CUSTOMER,
  })

  if (!authModalOpen) return null

  const handleClose = () => dispatch(closeAuthModal())
  const handleTab = (tab) => dispatch(setAuthModalTab(tab))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let authResult
      if (authModalTab === 'login') {
        authResult = await dispatch(loginUser({ email: form.email, password: form.password })).unwrap()
      } else {
        authResult = await dispatch(registerUser({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.accountType,
        })).unwrap()
      }
      dispatch(closeAuthModal())
      dispatch(showNotification({ message: 'Welcome to SalonBazar!', type: 'success' }))

      const role = authResult?.role || authResult?.user?.role
      const salonId = authResult?.user?.salonId
      navigate(getPostAuthPath(role, salonId))
    } catch (err) {
      dispatch(showNotification({ message: err || 'Authentication failed', type: 'error' }))
    }
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <div className={styles.topDeco}>
            <span className={styles.logoMark}>✦ Salon<em>Bazar</em></span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={handleClose} aria-label="Close">✕</button>
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${authModalTab === 'login' ? styles.activeTab : ''}`}
              onClick={() => handleTab('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`${styles.tab} ${authModalTab === 'register' ? styles.activeTab : ''}`}
              onClick={() => handleTab('register')}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {authModalTab === 'register' && (
            <div className={styles.field}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
          )}

          <div className={styles.field}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>

          {authModalTab === 'register' && (
            <div className={styles.field}>
              <label>I am signing up as</label>
              <div className={styles.accountTypes}>
                <button
                  type="button"
                  className={`${styles.accountType} ${form.accountType === ROLES.CUSTOMER ? styles.accountTypeActive : ''}`}
                  onClick={() => setForm(f => ({ ...f, accountType: ROLES.CUSTOMER }))}
                >
                  <span className={styles.accountTypeTitle}>Customer</span>
                  <span className={styles.accountTypeDesc}>Book salons & save favourites</span>
                </button>
                <button
                  type="button"
                  className={`${styles.accountType} ${form.accountType === ROLES.SHOP_OWNER ? styles.accountTypeActive : ''}`}
                  onClick={() => setForm(f => ({ ...f, accountType: ROLES.SHOP_OWNER }))}
                >
                  <span className={styles.accountTypeTitle}>Salon Owner</span>
                  <span className={styles.accountTypeDesc}>List & manage your salon</span>
                </button>
              </div>
            </div>
          )}

          {authModalTab === 'register' && (
            <div className={styles.field}>
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
            </div>
          )}

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          {authModalTab === 'login' && (
            <div className={styles.forgotRow}>
              <button type="button" className={styles.forgotBtn}>Forgot password?</button>
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Please wait…' : authModalTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div className={styles.divider}><span>or continue with</span></div>

          <div className={styles.socials}>
            <button type="button" className={styles.socialBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className={styles.socialBtn}>
              📱 OTP Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
