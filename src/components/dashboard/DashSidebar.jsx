import { useSelector } from 'react-redux'
import {
  FiGrid, FiUsers, FiCalendar, FiBarChart2, FiUserPlus,
  FiSettings, FiExternalLink, FiLogOut,
} from 'react-icons/fi'
import styles from './DashSidebar.module.css'

const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',        icon: FiGrid,      badge: null },
  { id: 'queue',     label: 'Live Queue',       icon: FiUsers,     badge: 'queue' },
  { id: 'bookings',  label: 'Appointments',     icon: FiCalendar,  badge: 'bookings' },
  { id: 'walkin',    label: 'Walk-In Entry',    icon: FiUserPlus,  badge: null },
  { id: 'analytics', label: 'Analytics',        icon: FiBarChart2, badge: null },
]

export default function DashSidebar({ salon, activeView, onNav }) {
  const { queue, bookings } = useSelector(s => s.dashboard)

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
      {/* Salon identity */}
      <div className={styles.salonBlock}>
        <div className={styles.salonImgWrap}>
          <img src={salon.image} alt={salon.name} className={styles.salonImg} />
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            Live
          </div>
        </div>
        <div className={styles.salonInfo}>
          <div className={styles.salonName}>{salon.name}</div>
          <div className={styles.salonMeta}>Owner Dashboard</div>
          <div className={styles.salonTime}>{timeStr}</div>
        </div>
      </div>

      {/* Quick stats strip */}
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

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navLabel}>Management</div>
        {NAV_ITEMS.map(item => {
          const Icon  = item.icon
          const badge = getBadge(item.badge)
          const isAct = activeView === item.id

          return (
            <button
              key={item.id}
              className={`${styles.navItem} ${isAct ? styles.navActive : ''}`}
              onClick={() => onNav(item.id)}
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
            </button>
          )
        })}
      </nav>

      {/* Bottom links */}
      <div className={styles.bottom}>
        <div className={styles.navLabel}>Settings</div>
        <button className={styles.bottomItem}>
          <FiSettings size={16} /> Salon Settings
        </button>
        <a href={`/salons/1`} target="_blank" rel="noreferrer" className={styles.bottomItem}>
          <FiExternalLink size={16} /> View Public Page
        </a>
        <button className={styles.bottomItem} style={{ color: '#DC2626' }}>
          <FiLogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  )
}