import { useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import {
  FiGrid, FiUsers, FiCalendar, FiBarChart2, FiUserPlus, FiSettings, FiExternalLink,
} from 'react-icons/fi'
import { ROLES } from '@/constants/roles'
import { roleLabel } from '@/constants/roles'
import { DASHBOARD_NAV } from '@/constants/dashboardRoutes'
import styles from './DashSidebar.module.css'

const NAV_ICONS = {
  overview: FiGrid,
  queue: FiUsers,
  appointments: FiCalendar,
  walkIn: FiUserPlus,
  analytics: FiBarChart2,
  team: FiUsers,
}

export default function DashSidebar({ salon, role, onNavigate }) {
  const { queue, bookings } = useSelector(s => s.dashboard)
  const isOwner = role === ROLES.SHOP_OWNER
  const navItems = DASHBOARD_NAV.filter(item => !item.ownerOnly || isOwner)

  const getBadge = (badgeKey) => {
    if (badgeKey === 'queue')
      return queue.filter(q => q.status === 'waiting').length || null
    if (badgeKey === 'bookings')
      return bookings.filter(b => b.status === 'pending').length || null
    return null
  }

  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={styles.sidebar}>
      <div className={styles.salonBlock}>
        <div className={styles.salonImgWrap}>
          {salon.image ? (
            <img src={salon.image} alt={salon.name} className={styles.salonImg} />
          ) : (
            <div className={styles.salonImgPlaceholder}>✦</div>
          )}
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            Live
          </div>
        </div>
        <div className={styles.salonInfo}>
          <div className={styles.salonName}>{salon.name}</div>
          <div className={styles.salonMeta}>{roleLabel(role)} Dashboard</div>
          <div className={styles.salonTime}>{timeStr}</div>
        </div>
      </div>

      <div className={styles.quickStats}>
        <div className={styles.quickStat}>
          <span className={styles.quickNum}>{queue.length}</span>
          <span className={styles.quickLabel}>In Queue</span>
        </div>
        <div className={styles.quickDivider} />
        <div className={styles.quickStat}>
          <span className={styles.quickNum}>
            {bookings.filter(b => b.date === 'Today').length}
          </span>
          <span className={styles.quickLabel}>Today</span>
        </div>
        <div className={styles.quickDivider} />
        <div className={styles.quickStat}>
          <span className={styles.quickNum}>₹18K</span>
          <span className={styles.quickLabel}>Earned</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navLabel}>Management</div>
        {navItems.map(item => {
          const Icon = NAV_ICONS[item.id]
          const badge = getBadge(item.badge)

          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.id === 'overview'}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navActive : ''}`
              }
              onClick={onNavigate}
            >
              <Icon size={17} className={styles.navIcon} />
              <span className={styles.navLabel2}>{item.label}</span>
              {badge != null && (
                <span className={`${styles.badge} ${item.id === 'queue' ? styles.badgeLive : ''}`}>
                  {badge}
                </span>
              )}
              {item.id === 'queue' && (
                <span className={styles.livePill}>LIVE</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.navLabel}>Settings</div>
        <button type="button" className={styles.bottomItem}>
          <FiSettings size={16} /> Salon Settings
        </button>
        <Link to={`/salons/${salon.id}`} target="_blank" rel="noreferrer" className={styles.bottomItem}>
          <FiExternalLink size={16} /> View Public Page
        </Link>
      </div>
    </div>
  )
}
