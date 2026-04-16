// pages/SalonDetails/index.jsx
import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSalonById } from '@/store/slices/salonSlice'
import { MOCK_SALON_DETAIL } from '@/constants/mockSalonDetail'

import SalonDetailHero     from '@/components/salon/SalonDetails/SalonDetailHero'
import SalonDetailNav      from '@/components/salon/SalonDetails/SalonDetailNav'
import GallerySection      from '@/components/salon/SalonDetails/GallerySection'
import AboutSection        from '@/components/salon/SalonDetails/AboutSection'
import ServicesSection     from '@/components/salon/SalonDetails/ServicesSection'
import StaffSection        from '@/components/salon/SalonDetails/StaffSection'
import ReviewsSection      from '@/components/salon/SalonDetails/ReviewsSection'
import LocationSection     from '@/components/salon/SalonDetails/LocationSection'
import BookingPanel        from '@/components/salon/SalonDetails/BookingPanel'
import MobileBookingBar    from '@/components/salon/SalonDetails/MobileBookingBar'
import SalonDetailSkeleton from '@/components/salon/SalonDetails/SalonDetailSkeleton'

import styles from './SalonDetails.module.css'

const NAV_SECTIONS = ['Gallery', 'Services', 'Staff', 'Reviews', 'Location']

export default function SalonDetails() {
  const { id }       = useParams()
  console.log(`id::::::`, id)
  const dispatch     = useDispatch()
  const navigate     = useNavigate()

  const [salon,          setSalon]          = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [activeSection,  setActiveSection]  = useState('Gallery')
  const [selectedService, setSelectedService] = useState(null)
  const [bookingPanelFixed, setBookingPanelFixed] = useState(false)

  const sectionRefs = useRef({})
  const heroRef     = useRef(null)

  // ── Load salon data ───────────────────────────────────────
  useEffect(() => {
    setLoading(true)
    // TODO: replace with real API → dispatch(fetchSalonById(id))
    setTimeout(() => {
      setSalon(MOCK_SALON_DETAIL)
      setLoading(false)
    }, 600)
  }, [id])

  // ── Scroll spy for nav highlighting ──────────────────────
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

  // ── Sticky booking panel on scroll ────────────────────────
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
    // Scroll to booking panel on mobile
    if (window.innerWidth < 1024) {
      document.getElementById('mobile-booking-bar')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (loading) return <SalonDetailSkeleton />
  if (!salon)  return <div style={{ padding: '120px 24px', textAlign: 'center' }}>Salon not found.</div>

  return (
    <div className={styles.page}>
      {/* Hero with gallery mosaic */}
      <div ref={heroRef}>
        <SalonDetailHero salon={salon} />
      </div>

      {/* Sticky section nav */}
      <SalonDetailNav
        sections={NAV_SECTIONS}
        active={activeSection}
        onNav={scrollTo}
        salon={salon}
      />

      {/* Body: content + sticky booking panel */}
      <div className={styles.body}>
        <div className={styles.content}>

          {/* Gallery */}
          <section
            data-section="Gallery"
            ref={el => sectionRefs.current['Gallery'] = el}
            className={styles.section}
          >
            <GallerySection images={salon.gallery} name={salon.name} />
          </section>

          {/* About */}
          <section className={styles.section}>
            <AboutSection salon={salon} />
          </section>

          {/* Services */}
          <section
            data-section="Services"
            ref={el => sectionRefs.current['Services'] = el}
            className={styles.section}
          >
            <ServicesSection
              categories={salon.services}
              selectedService={selectedService}
              onSelect={handleSelectService}
            />
          </section>

          {/* Staff */}
          <section
            data-section="Staff"
            ref={el => sectionRefs.current['Staff'] = el}
            className={styles.section}
          >
            <StaffSection staff={salon.staff} />
          </section>

          {/* Reviews */}
          <section
            data-section="Reviews"
            ref={el => sectionRefs.current['Reviews'] = el}
            className={styles.section}
          >
            <ReviewsSection
              reviews={salon.reviews}
              rating={salon.rating}
              totalReviews={salon.reviews.length}
              breakdown={salon.ratingBreakdown}
            />
          </section>

          {/* Location */}
          <section
            data-section="Location"
            ref={el => sectionRefs.current['Location'] = el}
            className={styles.section}
          >
            <LocationSection salon={salon} />
          </section>

        </div>

        {/* Desktop sticky booking panel */}
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

      {/* Mobile bottom booking bar */}
      <MobileBookingBar
        salon={salon}
        selectedService={selectedService}
        id="mobile-booking-bar"
      />
    </div>
  )
}
