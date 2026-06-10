// pages/SalonDetails/index.jsx
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSalonById } from '@/store/slices/salonSlice'

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

import SEO from '@/components/seo/SEO'
import { buildCanonical, buildSalonSeo, localBusinessJsonLd } from '@/constants/seo'
import { getSalonDisplayGallery } from '@/utils/salonImages'
import styles from './SalonDetails.module.css'

const NAV_SECTIONS = ['Gallery', 'Services', 'Staff', 'Reviews', 'Location']

export default function SalonDetails() {
  const { id }       = useParams()
  const dispatch     = useDispatch()

  const { selectedSalon: salon, loading } = useSelector(s => s.salons)
  const [activeSection,  setActiveSection]  = useState('Gallery')
  const [selectedService, setSelectedService] = useState(null)
  const [bookingPanelFixed, setBookingPanelFixed] = useState(false)

  const sectionRefs = useRef({})
  const heroRef     = useRef(null)

  useEffect(() => {
    if (id) dispatch(fetchSalonById(id))
  }, [id, dispatch])

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
  if (!salon) {
    return (
      <>
        <SEO
          title="Salon Not Found | SalonBazar"
          description="This salon could not be found. Browse verified salons in Ahmedabad on SalonBazar."
          canonical={buildCanonical('/salons')}
          noindex
        />
        <div style={{ padding: '120px 24px', textAlign: 'center' }}>Salon not found.</div>
      </>
    )
  }

  const salonSeo = buildSalonSeo(salon)

  return (
    <div className={styles.page}>
      <SEO
        title={salonSeo.title}
        description={salonSeo.description}
        canonical={buildCanonical(salonSeo.path)}
        image={salonSeo.image}
        jsonLd={localBusinessJsonLd(salon)}
      />
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
            ref={el => sectionRefs.current['Gallery'] = el}
            className={styles.section}
          >
            <GallerySection images={getSalonDisplayGallery(salon)} name={salon.name} />
          </section>

          <section className={styles.section}>
            <AboutSection salon={salon} />
          </section>

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

          <section
            data-section="Staff"
            ref={el => sectionRefs.current['Staff'] = el}
            className={styles.section}
          >
            <StaffSection staff={salon.staff} />
          </section>

          <section
            data-section="Reviews"
            ref={el => sectionRefs.current['Reviews'] = el}
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
            ref={el => sectionRefs.current['Location'] = el}
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
