import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAdminData, setActiveView } from '@/store/slices/adminSlice'

import AdminSidebar    from '@/components/admin/AdminSidebar'
import AdminOverview   from '@/components/admin/AdminOverview'
import AdminSalons     from '@/components/admin/AdminSalons'
import AdminUsers      from '@/components/admin/AdminUsers'
import AdminAnalytics  from '@/components/admin/AdminAnalytics'
import AdminSettings   from '@/components/admin/AdminSettings'
import AdminSkeleton   from '@/components/admin/AdminSkeleton'

import styles from './Admin.module.css'

export default function Admin() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { isAuthenticated } = useSelector(s => s.auth)
  const { loading, activeView } = useSelector(s => s.admin)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Admin guard — in production check role === 'admin'
  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return }
    dispatch(fetchAdminData())
  }, [isAuthenticated, dispatch, navigate])

  const renderView = () => {
    if (loading) return <AdminSkeleton />
    switch (activeView) {
      case 'overview':  return <AdminOverview />
      case 'salons':    return <AdminSalons />
      case 'users':     return <AdminUsers />
      case 'analytics': return <AdminAnalytics />
      case 'settings':  return <AdminSettings />
      default:          return <AdminOverview />
    }
  }

  return (
    <div className={styles.page}>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <AdminSidebar
          activeView={activeView}
          onNav={v => { dispatch(setActiveView(v)); setSidebarOpen(false) }}
        />
      </div>

      <div className={styles.main}>
        <div className={styles.mobileTopBar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(v => !v)}>
            <span /><span /><span />
          </button>
          <span className={styles.mobileTitle}>SalonBazar Admin</span>
        </div>
        <div className={styles.viewArea}>
          {renderView()}
        </div>
      </div>
    </div>
  )
}