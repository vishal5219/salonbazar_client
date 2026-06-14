import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { closeAuthModal, setAuthModalTab, showNotification } from '@/store/slices/uiSlice'
import {
  loginUser,
  initiateSignup,
  verifySignupOtp,
  resendSignupVerification,
  googleLogin,
} from '@/store/slices/authSlice'
import { ROLES } from '@/constants/roles'
import { getPostAuthPath } from '@/utils/authRedirect'
import Logo from '@/components/brand/Logo'
import GoogleAuthButton from '@/components/common/GoogleAuthButton'
import styles from './AuthModal.module.css'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  accountType: ROLES.CUSTOMER,
  verifyMethod: 'email',
}

export default function AuthModal() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { authModalOpen, authModalTab } = useSelector(s => s.ui)
  const { loading } = useSelector(s => s.auth)

  const [form, setForm] = useState(emptyForm)
  const [loginId, setLoginId] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupStep, setSignupStep] = useState('details')
  const [verificationId, setVerificationId] = useState(null)
  const [otp, setOtp] = useState('')
  const [devHint, setDevHint] = useState(null)

  if (!authModalOpen) return null

  const resetSignup = () => {
    setSignupStep('details')
    setVerificationId(null)
    setOtp('')
    setDevHint(null)
  }

  const handleClose = () => {
    resetSignup()
    dispatch(closeAuthModal())
  }

  const handleTab = (tab) => {
    resetSignup()
    setForm(emptyForm)
    dispatch(setAuthModalTab(tab))
  }

  const finishAuth = (authResult) => {
    dispatch(closeAuthModal())
    resetSignup()
    dispatch(showNotification({ message: 'Welcome to SalonBazar!', type: 'success' }))
    const role = authResult?.role || authResult?.user?.role
    const salonId = authResult?.user?.salonId
    navigate(getPostAuthPath(role, salonId))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const authResult = await dispatch(loginUser({
        identifier: loginId.trim(),
        password: loginPassword,
      })).unwrap()
      finishAuth(authResult)
    } catch (err) {
      dispatch(showNotification({ message: err || 'Authentication failed', type: 'error' }))
    }
  }

  const handleSignupInitiate = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: form.name.trim(),
        password: form.password,
        role: form.accountType,
        method: form.verifyMethod,
      }
      if (form.verifyMethod === 'email') {
        payload.email = form.email.trim()
      } else {
        payload.phone = form.phone.trim()
      }

      const result = await dispatch(initiateSignup(payload)).unwrap()
      setVerificationId(result.verificationId)

      if (form.verifyMethod === 'phone') {
        setSignupStep('verify-phone')
        setDevHint(result.devOtp ? { type: 'otp', value: result.devOtp } : null)
        dispatch(showNotification({ message: 'OTP sent to your phone', type: 'success' }))
      } else {
        setSignupStep('verify-email-sent')
        setDevHint(result.verifyUrl ? { type: 'link', value: result.verifyUrl } : null)
        dispatch(showNotification({ message: 'Check your email to verify', type: 'success' }))
      }
    } catch (err) {
      dispatch(showNotification({ message: err || 'Could not start signup', type: 'error' }))
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    try {
      const authResult = await dispatch(verifySignupOtp({
        verificationId,
        otp: otp.trim(),
      })).unwrap()
      finishAuth(authResult)
    } catch (err) {
      dispatch(showNotification({ message: err || 'Invalid OTP', type: 'error' }))
    }
  }

  const handleResend = async () => {
    if (!verificationId) return
    try {
      const result = await dispatch(resendSignupVerification(verificationId)).unwrap()
      if (result.devOtp) setDevHint({ type: 'otp', value: result.devOtp })
      if (result.verifyUrl) setDevHint({ type: 'link', value: result.verifyUrl })
      dispatch(showNotification({ message: result.message || 'Sent again', type: 'success' }))
    } catch (err) {
      dispatch(showNotification({ message: err || 'Could not resend', type: 'error' }))
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential
    if (!idToken) {
      dispatch(showNotification({ message: 'Google sign-in failed', type: 'error' }))
      return
    }
    try {
      const role = authModalTab === 'register' ? form.accountType : undefined
      const authResult = await dispatch(googleLogin({ idToken, role })).unwrap()
      finishAuth(authResult)
    } catch (err) {
      dispatch(showNotification({ message: err || 'Google sign-in failed', type: 'error' }))
    }
  }

  const handleGoogleError = () => {
    dispatch(showNotification({ message: 'Google sign-in was cancelled', type: 'warning' }))
  }

  const renderGoogleSection = () => (
    <>
      <div className={styles.divider}><span>or continue with</span></div>
      <GoogleAuthButton
        mode={authModalTab === 'login' ? 'signin' : 'signup'}
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        disabled={loading}
      />
    </>
  )

  const renderSignupDetails = () => (
    <>
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

      <div className={styles.field}>
        <label>Verify with</label>
        <div className={styles.methodToggle}>
          <button
            type="button"
            className={`${styles.methodBtn} ${form.verifyMethod === 'email' ? styles.methodBtnActive : ''}`}
            onClick={() => setForm(f => ({ ...f, verifyMethod: 'email' }))}
          >
            ✉ Email
          </button>
          <button
            type="button"
            className={`${styles.methodBtn} ${form.verifyMethod === 'phone' ? styles.methodBtnActive : ''}`}
            onClick={() => setForm(f => ({ ...f, verifyMethod: 'phone' }))}
          >
            📱 Phone
          </button>
        </div>
      </div>

      {form.verifyMethod === 'email' ? (
        <div className={styles.field}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <p className={styles.fieldHint}>We&apos;ll send a verification link to this email.</p>
        </div>
      ) : (
        <div className={styles.field}>
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            required
          />
          <p className={styles.fieldHint}>We&apos;ll send a 6-digit OTP to this number.</p>
        </div>
      )}

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

      <div className={styles.field}>
        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          required
          minLength={6}
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? 'Please wait…' : form.verifyMethod === 'email' ? 'Send Verification Email' : 'Send OTP'}
      </button>
    </>
  )

  const renderVerifyPhone = () => (
    <>
      <div className={styles.verifyBanner}>
        <span className={styles.verifyIcon}>📱</span>
        <p>Enter the 6-digit code sent to <strong>{form.phone}</strong></p>
      </div>

      {devHint?.type === 'otp' && (
        <div className={styles.devHint}>Dev OTP: <strong>{devHint.value}</strong></div>
      )}

      <div className={styles.field}>
        <label>Verification Code</label>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
          className={styles.otpInput}
          required
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading || otp.length < 6}>
        {loading ? 'Verifying…' : 'Verify & Create Account'}
      </button>

      <div className={styles.verifyActions}>
        <button type="button" className={styles.textBtn} onClick={handleResend} disabled={loading}>
          Resend OTP
        </button>
        <button type="button" className={styles.textBtn} onClick={resetSignup}>
          Change details
        </button>
      </div>
    </>
  )

  const renderVerifyEmailSent = () => (
    <>
      <div className={styles.verifyBanner}>
        <span className={styles.verifyIcon}>✉</span>
        <p>We sent a verification link to <strong>{form.email}</strong>. Open it to finish creating your account.</p>
      </div>

      {devHint?.type === 'link' && (
        <div className={styles.devHint}>
          Dev link: <a href={devHint.value} target="_blank" rel="noreferrer">{devHint.value}</a>
        </div>
      )}

      <p className={styles.emailNote}>Didn&apos;t get it? Check spam or resend.</p>

      <button type="button" className={styles.submitBtn} onClick={handleResend} disabled={loading}>
        {loading ? 'Sending…' : 'Resend Email'}
      </button>

      <div className={styles.verifyActions}>
        <button type="button" className={styles.textBtn} onClick={resetSignup}>
          Change details
        </button>
      </div>
    </>
  )

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <div className={styles.topDeco}>
            <Logo linked={false} variant="modal" className={styles.logoMark} />
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

        {authModalTab === 'login' ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.field}>
              <label>Email or Phone</label>
              <input
                type="text"
                placeholder="you@example.com or +91 98765 43210"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.forgotRow}>
              <button type="button" className={styles.forgotBtn}>Forgot password?</button>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Please wait…' : 'Sign In'}
            </button>
            {renderGoogleSection()}
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              if (signupStep === 'verify-phone') handleVerifyOtp(e)
              else if (signupStep === 'details') handleSignupInitiate(e)
              else e.preventDefault()
            }}
            className={styles.form}
          >
            {signupStep === 'details' && (
              <>
                {renderSignupDetails()}
                {renderGoogleSection()}
              </>
            )}
            {signupStep === 'verify-phone' && renderVerifyPhone()}
            {signupStep === 'verify-email-sent' && renderVerifyEmailSent()}
          </form>
        )}
      </div>
    </div>
  )
}
