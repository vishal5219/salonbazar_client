import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiCopy, FiTag, FiArrowRight, FiCheck, FiPercent } from 'react-icons/fi'
import SEO from '@/components/seo/SEO'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import { PAGE_SEO, buildCanonical } from '@/constants/seo'
import { FALLBACK_COUPONS, FALLBACK_SPOTLIGHT, REDEEM_STEPS } from '@/constants/offers'
import offerService from '@/services/offerService'
import { showNotification } from '@/store/slices/uiSlice'
import styles from './Offers.module.css'

function formatValidUntil(dateStr) {
  if (!dateStr) return 'Limited time'
  return `Valid till ${new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`
}

function CouponSkeleton() {
  return (
    <div className={styles.couponGrid}>
      {[1, 2, 3].map(i => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </div>
  )
}

export default function Offers() {
  const dispatch = useDispatch()
  const [coupons, setCoupons] = useState([])
  const [spotlight, setSpotlight] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadOffers() {
      try {
        const data = await offerService.getAll()
        if (cancelled) return
        setCoupons(data.coupons?.length ? data.coupons : FALLBACK_COUPONS)
        setSpotlight(data.spotlight?.length ? data.spotlight : FALLBACK_SPOTLIGHT)
      } catch {
        if (!cancelled) {
          setCoupons(FALLBACK_COUPONS)
          setSpotlight(FALLBACK_SPOTLIGHT)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadOffers()
    return () => { cancelled = true }
  }, [])

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      dispatch(showNotification({ message: `Coupon ${code} copied!`, type: 'success' }))
      setTimeout(() => setCopiedCode(null), 2000)
    } catch {
      dispatch(showNotification({ message: 'Could not copy code', type: 'error' }))
    }
  }

  const seo = PAGE_SEO.offers

  return (
    <div className={styles.page}>
      <SEO
        title={seo.title}
        description={seo.description}
        canonical={buildCanonical(seo.path)}
      />

      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrain} />
        <div className={`container-custom ${styles.heroInner}`}>
          <Breadcrumbs
            className={styles.breadcrumb}
            items={[
              { label: 'Home', to: '/' },
              { label: 'Offers' },
            ]}
          />

          <span className="overline">Save More</span>
          <h1 className={styles.heroTitle}>
            Exclusive <em>Offers</em><br />& Deals
          </h1>
          <p className={styles.heroSubtitle}>
            Platform-wide coupon codes and spotlight deals from top-rated salons.
            Copy a code and apply it at checkout.
          </p>

          <div className={styles.heroPills}>
            <span className={styles.heroPill}><FiTag size={13} /> {coupons.length || 3} active coupons</span>
            <span className={styles.heroPill}><FiPercent size={13} /> Up to 20% off</span>
          </div>
        </div>
      </section>

      <section className={`container-custom ${styles.section}`}>
        <div className={styles.sectionHead}>
          <span className="overline">Coupon Codes</span>
          <h2 className={styles.sectionTitle}>Platform <em>Coupons</em></h2>
          <p className={styles.sectionDesc}>
            Use these codes during booking on the payment step. One coupon per booking.
          </p>
        </div>

        {loading ? (
          <CouponSkeleton />
        ) : (
          <div className={styles.couponGrid}>
            {coupons.map((coupon, i) => (
              <article
                key={coupon.code}
                className={styles.couponCard}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className={styles.couponTop}>
                  <span className={styles.couponLabel}>{coupon.label}</span>
                  {coupon.minOrder > 0 && (
                    <span className={styles.couponMin}>Min ₹{coupon.minOrder}</span>
                  )}
                </div>

                <p className={styles.couponDesc}>{coupon.description}</p>

                {coupon.type === 'percent' && coupon.maxDiscount && (
                  <p className={styles.couponNote}>Max savings ₹{coupon.maxDiscount}</p>
                )}

                <div className={styles.couponCodeRow}>
                  <code className={styles.couponCode}>{coupon.code}</code>
                  <button
                    type="button"
                    className={`${styles.copyBtn} ${copiedCode === coupon.code ? styles.copied : ''}`}
                    onClick={() => handleCopy(coupon.code)}
                    aria-label={`Copy coupon ${coupon.code}`}
                  >
                    {copiedCode === coupon.code ? <FiCheck size={15} /> : <FiCopy size={15} />}
                    {copiedCode === coupon.code ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {spotlight.length > 0 && (
        <section className={styles.spotlightSection}>
          <div className={`container-custom ${styles.section}`}>
            <div className={styles.sectionHead}>
              <span className="overline">Featured Salons</span>
              <h2 className={styles.sectionTitle}>Salon <em>Spotlights</em></h2>
              <p className={styles.sectionDesc}>
                Hand-picked deals from our highest-rated partner salons.
              </p>
            </div>

            <div className={styles.spotlightGrid}>
              {spotlight.map((deal, i) => (
                <Link
                  key={deal.salonId}
                  to={`/salons/${deal.salonId}`}
                  className={styles.spotlightCard}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className={styles.spotlightImgWrap}>
                    <img src={deal.image} alt={deal.salonName} className={styles.spotlightImg} loading="lazy" />
                    <span className={styles.spotlightBadge}>{deal.badge}</span>
                  </div>
                  <div className={styles.spotlightBody}>
                    <p className={styles.spotlightCat}>{deal.category} · {deal.city}</p>
                    <h3 className={styles.spotlightName}>{deal.salonName}</h3>
                    <p className={styles.spotlightOffer}>{deal.title}</p>
                    <div className={styles.spotlightFooter}>
                      <span className={styles.spotlightValid}>{formatValidUntil(deal.validUntil)}</span>
                      <span className={styles.spotlightCta}>
                        View salon <FiArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`container-custom ${styles.section}`}>
        <div className={styles.sectionHead}>
          <span className="overline">How It Works</span>
          <h2 className={styles.sectionTitle}>Redeem in <em>3 Steps</em></h2>
        </div>

        <div className={styles.stepsGrid}>
          {REDEEM_STEPS.map((item, i) => (
            <div key={item.step} className={styles.stepCard} style={{ animationDelay: `${i * 0.08}s` }}>
              <span className={styles.stepNum}>{item.step}</span>
              <h3 className={styles.stepTitle}>{item.title}</h3>
              <p className={styles.stepDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={`container-custom ${styles.ctaInner}`}>
          <h2 className={styles.ctaTitle}>Ready to book your <em>next visit?</em></h2>
          <p className={styles.ctaDesc}>
            Explore salons near you and apply your coupon at checkout.
          </p>
          <Link to="/salons" className={styles.ctaBtn}>
            Browse Salons <FiArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
