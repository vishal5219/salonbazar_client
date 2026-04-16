import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearNotification } from '@/store/slices/uiSlice'
import styles from './Notification.module.css'

export default function Notification() {
  const dispatch = useDispatch()
  const { notification } = useSelector(s => s.ui)

  useEffect(() => {
    if (!notification) return
    const t = setTimeout(() => dispatch(clearNotification()), 3500)
    return () => clearTimeout(t)
  }, [notification, dispatch])

  if (!notification) return null

  return (
    <div className={`${styles.toast} ${styles[notification.type || 'success']}`}>
      <span className={styles.icon}>
        {notification.type === 'error' ? '✕' : notification.type === 'warning' ? '⚠' : '✓'}
      </span>
      <span className={styles.message}>{notification.message}</span>
      <button className={styles.close} onClick={() => dispatch(clearNotification())}>✕</button>
    </div>
  )
}
