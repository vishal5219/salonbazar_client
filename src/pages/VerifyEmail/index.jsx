import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authService from '@/services/authService'
import { setSession } from '@/store/slices/authSlice'
import { showNotification } from '@/store/slices/uiSlice'
import { getPostAuthPath } from '@/utils/authRedirect'
import Logo from '@/components/brand/Logo'
import styles from './VerifyEmail.module.css'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('Missing verification link.')
      return undefined
    }

    let ignore = false

    const verify = async () => {
      try {
        const data = await authService.verifySignupEmail(token)
        if (ignore) return

        authService.saveTokens(data.token, data.refreshToken)
        dispatch(setSession(data))
        dispatch(showNotification({ message: 'Email verified — welcome to SalonBazar!', type: 'success' }))
        setStatus('success')

        const role = data?.role || data?.user?.role
        const salonId = data?.user?.salonId
        setTimeout(() => {
          if (!ignore) navigate(getPostAuthPath(role, salonId))
        }, 1500)
      } catch (err) {
        if (ignore) return
        setStatus('error')
        setErrorMessage(err?.message || 'Verification failed')
      }
    }

    verify()
    return () => { ignore = true }
  }, [token, dispatch, navigate])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Logo linked={false} variant="modal" className={styles.logo} />
        {status === 'loading' && (
          <>
            <div className={styles.spinner} />
            <h1 className={styles.title}>Verifying your email…</h1>
            <p className={styles.sub}>Please wait a moment.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className={styles.successIcon}>✓</div>
            <h1 className={styles.title}>Email verified!</h1>
            <p className={styles.sub}>Redirecting you now…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className={styles.errorIcon}>!</div>
            <h1 className={styles.title}>Verification failed</h1>
            <p className={styles.sub}>{errorMessage}</p>
            <Link to="/?auth=register" className={styles.btn}>Try signing up again</Link>
          </>
        )}
      </div>
    </div>
  )
}
