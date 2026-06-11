import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSalonById } from '@/store/slices/salonSlice'
import SalonDetailHero from './SalonDetailHero'
import SalonDetailNav from './SalonDetailNav'
import GallerySection from './GallerySection'
import AboutSection from './AboutSection'
import ServicesSection from './ServicesSection'
import StaffSection from './StaffSection'
import ReviewsSection from './ReviewsSection'
import LocationSection from './LocationSection'
import BookingPanel from './BookingPanel'
import MobileBookingBar from './MobileBookingBar'
import SalonDetailSkeleton from './SalonDetailSkeleton'
import { getSalonDisplayGallery } from '@/utils/salonImages'
import styles from '@/pages/SalonDetails/SalonDetails.module.css'

const NAV_SECTIONS = ['Gallery', 'Services', 'Staff', 'Reviews', 'Location']

export default function SalonDetailView({ salonId }) {
  const dispatch = useDispatch()
  const { selectedSalon: salon, loading } = useSelector(s => s.salons)
  const [activeSection, setActiveSection] = useState('Gallery')
  const [selectedService, setSelectedService] = useState(null)
  const [bookingPanelFixed, setBookingPanelFixed] = useState(false)

  const sectionRefs = useRef({})
  const heroRef = useRef(null)

  useEffect(() => {
    if (salonId) dispatch(fetchSalonById(salonId))
  }, [salonId, dispatch])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.dataset.section)
        })
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
    )

    NAV_SECTIONS.forEach(s => {
      const el = sectionRefs.current[s]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [salon])

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        setBookingPanelFixed(window.scrollY > heroRef.current.offsetHeight)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (section) => {
    const el = sectionRefs.current[section]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSelectService = (service) => {
    setSelectedService(service)
    if (window.innerWidth < 1024) {
      document.getElementById('mobile-booking-bar')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (loading && !salon) return <SalonDetailSkeleton />
  if (!salon || String(salon.id) !== String(salonId)) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center' }}>Salon not found.</div>
    )
  }

  return (
    <div className={styles.page}>
      <div ref={heroRef}>
        <SalonDetailHero salon={salon} />
      </div>

      <SalonDetailNav
        sections={NAV_SECTIONS}
        active={activeSection}
        onNav={scrollTo}
        salon={salon}
      />

      <div className={styles.body}>
        <div className={styles.content}>
          <section
            data-section="Gallery"
            ref={el => { sectionRefs.current.Gallery = el }}
            className={styles.section}
          >
            <GallerySection images={getSalonDisplayGallery(salon)} name={salon.name} />
          </section>

          <section className={styles.section}>
            <AboutSection salon={salon} />
          </section>

          <section
            data-section="Services"
            ref={el => { sectionRefs.current.Services = el }}
            className={styles.section}
          >
            <ServicesSection
              categories={salon.services}
              selectedService={selectedService}
              onSelect={handleSelectService}
            />
          </section>

          <section
            data-section="Staff"
            ref={el => { sectionRefs.current.Staff = el }}
            className={styles.section}
          >
            <StaffSection staff={salon.staff} />
          </section>

          <section
            data-section="Reviews"
            ref={el => { sectionRefs.current.Reviews = el }}
            className={styles.section}
          >
            <ReviewsSection
              reviews={salon.reviews}
              rating={salon.rating}
              totalReviews={salon.reviews?.length || salon.reviews}
              breakdown={salon.ratingBreakdown}
            />
          </section>

          <section
            data-section="Location"
            ref={el => { sectionRefs.current.Location = el }}
            className={styles.section}
          >
            <LocationSection salon={salon} />
          </section>
        </div>

        <aside className={styles.bookingAside}>
          <div className={`${styles.bookingWrap} ${bookingPanelFixed ? styles.bookingFixed : ''}`}>
            <BookingPanel
              salon={salon}
              selectedService={selectedService}
              onClearService={() => setSelectedService(null)}
            />
          </div>
        </aside>
      </div>

      <MobileBookingBar
        salon={salon}
        selectedService={selectedService}
        id="mobile-booking-bar"
      />
    </div>
  )
}
