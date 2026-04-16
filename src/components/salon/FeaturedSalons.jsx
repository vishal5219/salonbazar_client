import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SalonCard from '@/components/salon/SalonCard'
import styles from './FeaturedSalons.module.css'

export default function FeaturedSalons() {
  const { salons } = useSelector(s => s.salons)
  const topSalons = salons.slice(0, 3)

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Left sidebar label */}
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

            {/* Gold decorative element */}
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

        {/* Cards */}
        <div className={styles.cardsArea}>
          {topSalons.map((salon, i) => (
            <div
              key={salon.id}
              className={styles.cardWrap}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <SalonCard salon={salon} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
