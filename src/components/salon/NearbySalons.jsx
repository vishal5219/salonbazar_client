import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SalonCard from '@/components/salon/SalonCard'
import styles from './NearbySalons.module.css'

const filters = ['All', 'Open Now', 'Hair', 'Spa', 'Bridal', 'Men\'s']

export default function NearbySalons() {
  const { salons } = useSelector(s => s.salons)
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? salons
    : activeFilter === 'Open Now'
    ? salons.filter(s => s.isOpen)
    : salons.filter(s => s.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase())))

  return (
    <section className={styles.section}>
      <div className="container-custom">
        <div className={styles.header}>
          <div>
            <span className="overline">Discover</span>
            <h2 className={styles.title}>Salons Near <em>You</em></h2>
          </div>
          <Link to="/salons" className={styles.viewAll}>View All →</Link>
        </div>

        {/* Filter pills */}
        <div className={styles.filters}>
          {filters.map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${activeFilter === f ? styles.active : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === 'Open Now' && <span className={styles.filterDot} />}
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {filtered.map((salon, i) => (
            <div
              key={salon.id}
              className={styles.cardWrap}
              style={{ animationDelay: `${(i % 6) * 0.07}s` }}
            >
              <SalonCard salon={salon} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <span>😔</span>
            <p>No salons found for this filter.</p>
          </div>
        )}
      </div>
    </section>
  )
}
