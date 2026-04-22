import { useSelector } from 'react-redux'
import {
  FiGrid, FiHome, FiUsers, FiBarChart2,
  FiSettings, FiShield, FiAlertCircle, FiExternalLink,
} from 'react-icons/fi'
import styles from './AdminSidebar.module.css'

const NAV = [
  { id: 'overview',  label: 'Overview',     icon: FiGrid,      badge: null       },
  { id: 'salons',    label: 'Salons',        icon: FiHome,      badge: 'pending'  },
  { id: 'users',     label: 'Users',         icon: FiUsers,     badge: null       },
  { id: 'analytics', label: 'Analytics',     icon: FiBarChart2, badge: null       },
  { id: 'settings',  label: 'Platform Settings', icon: FiSettings, badge: null   },
]

export default function AdminSidebar({ activeView, onNav }) {
  const { platformStats, salons } = useSelector(s => s.admin)
  const pendingCount = salons.filter(s => s.status === 'pending').length

  const getBadge = (key) => {
    if (key === 'pending') return pendingCount > 0 ? pendingCount : null
    return null
  }

  return (
    <div className={styles.sidebar}>
      {/* Admin brand */}
      <div className={styles.brand}>
        <div className={styles.brandIcon}>
          <FiShield size={18} />
        </div>
        <div>
          <div className={styles.brandName}>Admin Panel</div>
          <div className={styles.brandSub}>SalonBazar Platform</div>
        </div>
      </div>

      {/* Platform health strip */}
      <div className={styles.healthStrip}>
        <div className={styles.healthDot} />
        <span className={styles.healthLabel}>All systems operational</span>
      </div>

      {/* Stats summary */}
      <div className={styles.statRow}>
        <div className={styles.stat}>
          <span className={styles.statNum}>
            {platformStats?.totalSalons?.value || '—'}
          </span>
          <span className={styles.statLbl}>Salons</span>
        </div>
        <div className={styles.statDiv} />
        <div className={styles.stat}>
          <span className={styles.statNum}>
            {platformStats?.totalUsers?.value
              ? `${(platformStats.totalUsers.value / 1000).toFixed(1)}K`
              : '—'}
          </span>
          <span className={styles.statLbl}>Users</span>
        </div>
        <div className={styles.statDiv} />
        <div className={styles.stat}>
          <span className={styles.statNum}>
            {platformStats?.pendingApprovals?.value ?? '—'}
          </span>
          <span className={styles.statLbl}>Pending</span>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navSection}>Main</div>
        {NAV.map(item => {
          const Icon  = item.icon
          const badge = getBadge(item.badge)
          const isAct = activeView === item.id
          return (
            <button
              key={item.id}
              className={`${styles.navItem} ${isAct ? styles.navActive : ''}`}
              onClick={() => onNav(item.id)}
            >
              <Icon size={16} className={styles.navIcon} />
              <span className={styles.navLabel}>{item.label}</span>
              {badge != null && (
                <span className={styles.navBadge}>{badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom links */}
      <div className={styles.bottom}>
        {pendingCount > 0 && (
          <div className={styles.alertBanner}>
            <FiAlertCircle size={14} />
            <span>{pendingCount} salon{pendingCount > 1 ? 's' : ''} awaiting approval</span>
          </div>
        )}
        <a href="/" target="_blank" rel="noreferrer" className={styles.bottomLink}>
          <FiExternalLink size={14} /> View Live Site
        </a>
      </div>
    </div>
  )
}