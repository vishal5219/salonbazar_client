import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchDashboard, setActiveView } from '@/store/slices/dashboardSlice'

import DashSidebar   from '@/components/dashboard/DashSidebar'
import DashOverview  from '@/components/dashboard/DashOverview'
import DashQueue     from '@/components/dashboard/DashQueue'
import DashBookings  from '@/components/dashboard/DashBookings'
import DashAnalytics from '@/components/dashboard/DashAnalytics'
import DashWalkIn    from '@/components/dashboard/DashWalkIn'
import DashSkeleton  from '@/components/dashboard/DashSkeleton'

import styles from './Dashboard.module.css'

const MOCK_SALON = {
  id:   1,
  name: 'Aura & Co.',
  image:'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=120&q=80',
}

export default function Dashboard() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { isAuthenticated, role } = useSelector(s => s.auth)
  const { loading, activeView }   = useSelector(s => s.dashboard)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return }
    // if (role !== 'shop_owner' && role !== 'admin') { navigate('/'); return }
  }, [isAuthenticated, role, navigate])

  useEffect(() => {
    dispatch(fetchDashboard(MOCK_SALON.id))
  }, [dispatch])

  const renderView = () => {
    if (loading) return <DashSkeleton />
    switch (activeView) {
      case 'overview':   return <DashOverview  salon={MOCK_SALON} />
      case 'queue':      return <DashQueue     />
      case 'bookings':   return <DashBookings  />
      case 'analytics':  return <DashAnalytics />
      case 'walkin':     return <DashWalkIn    />
      default:           return <DashOverview  salon={MOCK_SALON} />
    }
  }

  return (
    <div className={styles.page}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.mobileOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <DashSidebar
          salon={MOCK_SALON}
          activeView={activeView}
          onNav={(v) => { dispatch(setActiveView(v)); setSidebarOpen(false) }}
        />
      </div>

      {/* Main area */}
      <div className={styles.main}>
        {/* Mobile top bar */}
        <div className={styles.mobileBar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(v => !v)}>
            <span /><span /><span />
          </button>
          <span className={styles.mobileTitle}>{MOCK_SALON.name} · Dashboard</span>
        </div>

        <div className={styles.viewArea}>
          {renderView()}
        </div>
      </div>
    </div>
  )
}