import { useSelector } from 'react-redux'
import { FiCalendar, FiHeart, FiSettings } from 'react-icons/fi'
import styles from './ProfileTabs.module.css'

const TABS = [
  { id: 'bookings', label: 'Booking History', icon: FiCalendar },
  { id: 'wishlist', label: 'Wishlist',         icon: FiHeart    },
  { id: 'settings', label: 'Account Settings', icon: FiSettings },
]

export default function ProfileTabs({ activeTab, onTabChange }) {
  const { bookings } = useSelector(s => s.profile)
  const upcomingCount = bookings.filter(b => b.status === 'upcoming').length

  return (
    <div className={styles.tabBar}>
      <div className={styles.tabInner}>
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.id === 'bookings' && upcomingCount > 0 && (
                <span className={styles.tabBadge}>{upcomingCount}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}