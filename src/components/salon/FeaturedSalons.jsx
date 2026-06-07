import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchFeaturedSalons } from '@/store/slices/salonSlice'
import SalonCard from '@/components/salon/SalonCard'
import styles from './FeaturedSalons.module.css'

export default function FeaturedSalons() {
  const dispatch = useDispatch()
  const { featuredSalons, loading } = useSelector(s => s.salons)
  const topSalons = featuredSalons.slice(0, 3)

  useEffect(() => {
    dispatch(fetchFeaturedSalons())
  }, [dispatch])

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <span className="overline">Top Picks</span>
            <h2 className={styles.title}>
              Featured<br /><em>Salons</em><br />Near You
            </h2>
            <p className={styles.desc}>
              Hand-picked for exceptional quality, stellar reviews, and consistent excellence.
            </p>
            <Link to="/salons?featured=true" className={styles.cta}>
              <span>Explore All</span>
              <span className={styles.ctaArrow}>→</span>
            </Link>

            <div className={styles.decoBlock}>
              <div className={styles.decoStat}>
                <span className={styles.decoNum}>4.8+</span>
                <span className={styles.decoLabel}>Rating Required</span>
              </div>
              <div className={styles.decoStat}>
                <span className={styles.decoNum}>100+</span>
                <span className={styles.decoLabel}>Reviews Minimum</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.cardsArea}>
          {loading && topSalons.length === 0 ? (
            <p className={styles.desc}>Loading featured salons...</p>
          ) : (
            topSalons.map((salon, i) => (
              <div
                key={salon.id}
                className={styles.cardWrap}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <SalonCard salon={salon} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
