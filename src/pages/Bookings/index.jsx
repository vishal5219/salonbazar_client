import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiCalendar, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi'
import { fetchBookings } from '@/store/slices/profileSlice'
import BookingHistory from '@/components/Profile/BookingHistory'
import ProfileSkeleton from '@/components/Profile/ProfileSkeleton'
import SEO from '@/components/seo/SEO'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import { PAGE_SEO, buildCanonical } from '@/constants/seo'
import styles from './Bookings.module.css'

export default function Bookings() {
  const dispatch = useDispatch()
  const { bookingsLoading, bookingSummary } = useSelector(s => s.profile)

  useEffect(() => {
    dispatch(fetchBookings())
  }, [dispatch])

  const stats = [
    { label: 'Total', value: bookingSummary.total, icon: FiCalendar },
    { label: 'Upcoming', value: bookingSummary.upcoming, icon: FiClock },
    { label: 'Completed', value: bookingSummary.completed, icon: FiCheckCircle },
    { label: 'Cancelled', value: bookingSummary.cancelled, icon: FiXCircle },
  ]

  const seo = PAGE_SEO.bookings

  return (
    <div className={styles.page}>
      <SEO
        title={seo.title}
        description={seo.description}
        canonical={buildCanonical(seo.path)}
        noindex={seo.noindex}
      />
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container-custom ${styles.heroInner}`}>
          <Breadcrumbs
            className={styles.breadcrumb}
            items={[
              { label: 'Home', to: '/' },
              { label: 'My Bookings' },
            ]}
          />

          <span className="overline">Appointments</span>
          <h1 className={styles.heroTitle}>My <em>Bookings</em></h1>
          <p className={styles.heroSubtitle}>
            View upcoming appointments, past visits, and manage your salon bookings in one place.
          </p>
        </div>
      </section>

      <div className={styles.content}>
        <div className={styles.statsGrid}>
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className={styles.statCard}>
              <div className={styles.statIcon}><Icon size={18} /></div>
              <div>
                <div className={styles.statValue}>{value}</div>
                <div className={styles.statLabel}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.contentInner}>
          {bookingsLoading ? <ProfileSkeleton /> : <BookingHistory />}
        </div>
      </div>
    </div>
  )
}
