import { useRef, useState } from 'react'
import { useDispatch }      from 'react-redux'
import { FiCamera, FiEdit2, FiAward, FiCalendar, FiShoppingBag, FiTrendingUp } from 'react-icons/fi'
import { showNotification } from '@/store/slices/uiSlice'
import styles from './ProfileHero.module.css'

export default function ProfileHero({ user, loyaltyPoints, totalSpent, totalVisits, upcomingCount }) {
  const dispatch    = useDispatch()
  const fileRef     = useRef(null)
  const [avatar,    setAvatar]  = useState(null)

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setAvatar(ev.target.result)
    reader.readAsDataURL(file)
    dispatch(showNotification({ message: 'Profile photo updated!', type: 'success' }))
  }

  const tierLevel = loyaltyPoints >= 2000 ? 'Gold' : loyaltyPoints >= 1000 ? 'Silver' : 'Bronze'
  const tierNext  = tierLevel === 'Gold' ? 5000 : tierLevel === 'Silver' ? 2000 : 1000
  const tierPct   = Math.min(100, Math.round((loyaltyPoints / tierNext) * 100))

  return (
    <div className={styles.heroWrap}>
      {/* Background pattern */}
      <div className={styles.heroBg}>
        <div className={styles.heroBgInner} />
      </div>

      <div className={styles.heroInner}>
        {/* Avatar + name */}
        <div className={styles.identity}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatarRing}>
              {avatar ? (
                <img src={avatar} alt={`${user?.name || 'User'} profile photo`} className={styles.avatarImg} />
              ) : (
                <div className={styles.avatarInitials}>{initials}</div>
              )}
            </div>
            <button
              className={styles.cameraBtn}
              onClick={() => fileRef.current?.click()}
              title="Change photo"
            >
              <FiCamera size={13} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleAvatarChange}
            />
          </div>

          <div className={styles.nameBlock}>
            <div className={styles.tierBadge} data-tier={tierLevel}>
              <FiAward size={12} /> {tierLevel} Member
            </div>
            <h1 className={styles.userName}>{user?.name || 'My Profile'}</h1>
            <div className={styles.userEmail}>{user?.email || ''}</div>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <FiCalendar size={18} className={styles.statIcon} />
            <div className={styles.statNum}>{totalVisits}</div>
            <div className={styles.statLabel}>Total Visits</div>
          </div>
          <div className={styles.statCard}>
            <FiShoppingBag size={18} className={styles.statIcon} />
            <div className={styles.statNum}>₹{(totalSpent / 1000).toFixed(1)}K</div>
            <div className={styles.statLabel}>Total Spent</div>
          </div>
          <div className={styles.statCard}>
            <FiTrendingUp size={18} className={styles.statIcon} />
            <div className={styles.statNum}>{upcomingCount}</div>
            <div className={styles.statLabel}>Upcoming</div>
          </div>

          {/* Loyalty points card */}
          <div className={`${styles.statCard} ${styles.loyaltyCard}`}>
            <FiAward size={18} className={styles.statIconGold} />
            <div className={styles.statNumGold}>{loyaltyPoints.toLocaleString()}</div>
            <div className={styles.statLabel}>Loyalty Points</div>
            <div className={styles.loyaltyBar}>
              <div className={styles.loyaltyFill} style={{ width: `${tierPct}%` }} />
            </div>
            <div className={styles.loyaltySub}>
              {tierNext - loyaltyPoints} pts to {tierLevel === 'Gold' ? 'Platinum' : tierLevel === 'Silver' ? 'Gold' : 'Silver'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}