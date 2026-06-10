import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchDashboard, setActiveView } from '@/store/slices/dashboardSlice'
import { fetchSalonById } from '@/store/slices/salonSlice'

import DashSidebar   from '@/components/dashboard/DashSidebar'
import DashOverview  from '@/components/dashboard/DashOverview'
import DashQueue     from '@/components/dashboard/DashQueue'
import DashBookings  from '@/components/dashboard/DashBookings'
import DashAnalytics from '@/components/dashboard/DashAnalytics'
import DashWalkIn    from '@/components/dashboard/DashWalkIn'
import DashSkeleton  from '@/components/dashboard/DashSkeleton'

import styles from './Dashboard.module.css'

export default function Dashboard() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { isAuthenticated, initializing, role, user } = useSelector(s => s.auth)
  const { loading, activeView }   = useSelector(s => s.dashboard)
  const { selectedSalon }         = useSelector(s => s.salons)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const salonId = user?.salonId || 1
  const salonInfo = selectedSalon?.id === salonId
    ? { id: selectedSalon.id, name: selectedSalon.name, image: selectedSalon.gallery?.[0]?.url || selectedSalon.image }
    : { id: salonId, name: user?.name ? `${user.name}'s Salon` : 'Salon Dashboard', image: '' }

  useEffect(() => {
    if (initializing || isAuthenticated) return
    navigate('/')
  }, [initializing, isAuthenticated, navigate])

  useEffect(() => {
    dispatch(fetchSalonById(salonId))
    dispatch(fetchDashboard(salonId))
  }, [dispatch, salonId])

  const renderView = () => {
    if (loading) return <DashSkeleton />
    switch (activeView) {
      case 'overview':   return <DashOverview  salon={salonInfo} />
      case 'queue':      return <DashQueue     />
      case 'bookings':   return <DashBookings  />
      case 'analytics':  return <DashAnalytics />
      case 'walkin':     return <DashWalkIn    />
      default:           return <DashOverview  salon={salonInfo} />
    }
  }

  return (
    <div className={styles.page}>
      {sidebarOpen && (
        <div className={styles.mobileOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <DashSidebar
          salon={salonInfo}
          activeView={activeView}
          onNav={(v) => { dispatch(setActiveView(v)); setSidebarOpen(false) }}
        />
      </div>

      <div className={styles.main}>
        <div className={styles.mobileBar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(v => !v)}>
            <span /><span /><span />
          </button>
          <span className={styles.mobileTitle}>{salonInfo.name} · Dashboard</span>
        </div>

        <div className={styles.viewArea}>
          {renderView()}
        </div>
      </div>
    </div>
  )
}
