import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchProfile, setActiveTab } from '@/store/slices/profileSlice'

import ProfileHero     from '@/components/Profile/ProfileHero'
import ProfileTabs     from '@/components/Profile/ProfileTabs'
import BookingHistory  from '@/components/Profile/BookingHistory'
import WishlistTab     from '@/components/Profile/WishlistTab'
import SettingsTab     from '@/components/Profile/SettingsTab'
import ProfileSkeleton from '@/components/Profile/ProfileSkeleton'

import styles from './Profile.module.css'

export default function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const { isAuthenticated, user }            = useSelector(s => s.auth)
  const { loading, activeTab, loyaltyPoints,
          totalSpent, totalVisits, bookings } = useSelector(s => s.profile)

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) { navigate('/?auth=login'); return }
    dispatch(fetchProfile())
  }, [isAuthenticated, dispatch, navigate])

  // Sync tab from URL param
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['bookings','wishlist','settings'].includes(tab)) {
      dispatch(setActiveTab(tab))
    }
  }, [searchParams, dispatch])

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab))
    setSearchParams({ tab })
  }

  if (!isAuthenticated) return null
  if (loading) return <ProfileSkeleton />

  const renderTab = () => {
    switch (activeTab) {
      case 'bookings': return <BookingHistory />
      case 'wishlist': return <WishlistTab />
      case 'settings': return <SettingsTab />
      default:         return <BookingHistory />
    }
  }

  return (
    <div className={styles.page}>
      {/* Hero / profile header */}
      <ProfileHero
        user={user}
        loyaltyPoints={loyaltyPoints}
        totalSpent={totalSpent}
        totalVisits={totalVisits}
        upcomingCount={bookings.filter(b => b.status === 'upcoming').length}
      />

      {/* Tab nav */}
      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Tab content */}
      <div className={styles.content}>
        <div className={styles.contentInner}>
          {renderTab()}
        </div>
      </div>
    </div>
  )
}