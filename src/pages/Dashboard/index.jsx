import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { fetchDashboard } from '@/store/slices/dashboardSlice'
import { fetchSalonById } from '@/store/slices/salonSlice'
import { ROLES } from '@/constants/roles'
import { DASHBOARD_PATHS } from '@/constants/dashboardRoutes'

import DashSidebar   from '@/components/dashboard/DashSidebar'
import DashSkeleton  from '@/components/dashboard/DashSkeleton'

import SEO from '@/components/seo/SEO'
import { PAGE_SEO, buildCanonical } from '@/constants/seo'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { role, user } = useSelector(s => s.auth)
  const { loading } = useSelector(s => s.dashboard)
  const { selectedSalon } = useSelector(s => s.salons)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const salonId = user?.salonId

  useEffect(() => {
    if (!salonId && role === ROLES.SHOP_OWNER) {
      navigate('/register-salon')
    }
  }, [salonId, role, navigate])

  useEffect(() => {
    if (!salonId) return
    dispatch(fetchSalonById(salonId))
    dispatch(fetchDashboard(salonId))
  }, [dispatch, salonId])

  const salonInfo = selectedSalon?.id === salonId
    ? { id: selectedSalon.id, name: selectedSalon.name, image: selectedSalon.gallery?.[0]?.url || selectedSalon.image }
    : { id: salonId, name: user?.name ? `${user.name}'s Salon` : 'Salon Dashboard', image: '' }

  if (!salonId) {
    return (
      <div className={styles.page}>
        <div className={styles.noSalon}>
          <h2>No salon linked</h2>
          <p>Your account is not assigned to a salon yet.</p>
          {role === ROLES.SHOP_OWNER && (
            <Link to="/register-salon" className={styles.noSalonBtn}>Register your salon</Link>
          )}
        </div>
      </div>
    )
  }

  const seo = PAGE_SEO.dashboard

  return (
    <div className={styles.page}>
      <SEO
        title={seo.title}
        description={seo.description}
        canonical={buildCanonical(DASHBOARD_PATHS.overview)}
        noindex={seo.noindex}
      />
      {sidebarOpen && (
        <div className={styles.mobileOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <DashSidebar
          salon={salonInfo}
          role={role}
          onNavigate={() => setSidebarOpen(false)}
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
          {loading ? <DashSkeleton /> : <Outlet context={{ salon: salonInfo }} />}
        </div>
      </div>
    </div>
  )
}
