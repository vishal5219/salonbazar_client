import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchProfile, setActiveTab } from '@/store/slices/profileSlice'
import { fetchWishlist } from '@/store/slices/wishlistSlice'

import ProfileHero     from '@/components/Profile/ProfileHero'
import ProfileTabs     from '@/components/Profile/ProfileTabs'
import BookingHistory  from '@/components/Profile/BookingHistory'
import WishlistTab     from '@/components/Profile/WishlistTab'
import SettingsTab     from '@/components/Profile/SettingsTab'
import ProfileSkeleton from '@/components/Profile/ProfileSkeleton'

import SEO from '@/components/seo/SEO'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import { PAGE_SEO, buildCanonical } from '@/constants/seo'
import styles from './Profile.module.css'

export default function Profile() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const { isAuthenticated, initializing, user } = useSelector(s => s.auth)
  const { loading, activeTab, loyaltyPoints,
          totalSpent, totalVisits, bookings } = useSelector(s => s.profile)

  // Auth guard
  useEffect(() => {
    if (initializing || !isAuthenticated) return
    dispatch(fetchProfile())
    dispatch(fetchWishlist())
  }, [initializing, isAuthenticated, dispatch])

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

  if (initializing || !isAuthenticated) return null
  if (loading) return <ProfileSkeleton />

  const renderTab = () => {
    switch (activeTab) {
      case 'bookings': return <BookingHistory />
      case 'wishlist': return <WishlistTab />
      case 'settings': return <SettingsTab />
      default:         return <BookingHistory />
    }
  }

  const seo = PAGE_SEO.profile

  return (
    <div className={styles.page}>
      <SEO
        title={seo.title}
        description={seo.description}
        canonical={buildCanonical(seo.path)}
        noindex={seo.noindex}
      />
      <div className="container-custom" style={{ paddingTop: 'calc(var(--nav-height) + 16px)' }}>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'My Profile' },
          ]}
        />
      </div>
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